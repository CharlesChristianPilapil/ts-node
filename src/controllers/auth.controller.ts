import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import { type Session } from "express-session";
import { comparePassword, hashPassword } from "../utils/helpers/password.helpers";
import generateOtp from "../utils/helpers/generate-otp.helper";
import { ICustomSession } from "../middleware/auth.middleware";
import { sendOTP } from "../utils/helpers/send-email.helper";

// @desc    Register user
// @route   POST /auth/register
// @access  Public
export const handleRegister = async (req: Request, res: Response, next: NextFunction) => {
    let errors: Record<string, string> = {};
    
    try {
        const { email, username, password } = req.body;

        const usernameExist = await User.findOne({ username });
        const emailExist = await User.findOne({ email });

        if (usernameExist) errors.username = "Username already exists.";
        if (emailExist) errors.email = "Email already exists.";

        if (Object.keys(errors).length > 0) {
            return res.status(409).json({
                message: "Some fields already exist.",
                errors,
            });
        }

        const otp = generateOtp();
        
        await sendOTP({
            receiver: email,
            subject: "Registration Code",
            code: otp
        });

        const user = new User({
            ...req.body,
            password: hashPassword(password),
            twoFA_authentication: {
                enabled: true,
                code: hashPassword(otp),
                expiration: new Date(Date.now() + 5 * 60 * 1000),
            }
        });
        const savedUser = await user.save();

        req.login(savedUser, (err) => {
            if (err) return next(err);
            
            (req.session as Session & { twoFA_authenticated: boolean }).twoFA_authenticated = false;

            return res.status(201).json({
                otp,
                message: "User registered.",
                user: {
                    id: savedUser._id,
                    name: savedUser.username,
                    email: savedUser.email
                },
            });
        });
    } catch (error) {
        return next(error);
    }
}

// @desc    Login user
// @route   POST /auth/login
// @access  Public
export const handleLogin = async (req: Request, res: Response) => {
    const user = req.user as any;

    const dbUser = await User.findById(user?._id);
    const is2FAEnabled = dbUser?.twoFA_authentication?.enabled;

    if (!dbUser) throw new Error("User does not exist.");

    if (is2FAEnabled) {
        (req.session as ICustomSession).twoFA_authenticated = false;

        if (dbUser?.twoFA_authentication) {
            const otp = generateOtp();
            dbUser.twoFA_authentication.code = hashPassword(otp);
            dbUser.twoFA_authentication.expiration = new Date(Date.now() + 5 * 60 * 1000);

            await sendOTP({
                receiver: dbUser.email,
                subject: "Registration Code",
                code: otp
            });

            await dbUser.save();
        }
    } else {
        (req.session as ICustomSession).twoFA_authenticated = true;
    }

    return res.status(200).json({
        message: is2FAEnabled
            ? "Login successful. Please verify your account with two-factor authentication."
            : "Login successful.",
        required2FA: is2FAEnabled,
        user: {
            id: dbUser._id,
            name: dbUser.username,
            email: dbUser.email,
            twoFA_authentication: dbUser?.twoFA_authentication.enabled
        }
    });
};

// @desc    User status
// @route   POST /auth/status
// @access  Private
export const handleAuthStatus = (req: Request, res: Response) => {
	return req.user ? res.send(req.user) : res.sendStatus(401);
};

// @desc    Verify authentication
// @route   POST /auth/2fa
// @access  Private
export const handle2FA = async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.body;
    const user : any = req.user;
    
    try {
        const dbUser = await User.findById(user._id);

        if (!dbUser) {
            return res.status(404).json({ message: "User not found." });
        }

        const twoFA = dbUser.twoFA_authentication;

        const isMatch = comparePassword(code, twoFA?.code!);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid verification code." });
        }

        (req.session as ICustomSession).twoFA_authenticated = true;

        dbUser.twoFA_authentication.code = undefined;
        dbUser.twoFA_authentication.expiration = undefined;
        dbUser.twoFA_authentication.expiration = undefined;
        await dbUser.save();

        return res.status(200).json({
            message: "Authentication successful. You are now logged in.",
            user: {
                id: dbUser._id,
                name: dbUser.username,
                email: dbUser.email
            }
        })
    } catch (error) {
        console.error(error);
        return next(error);
    }
}

// @desc    Test to ge tall users
// @route   POST /auth/
// @access  Private
export const handleGetAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        return next(error);
    }
}