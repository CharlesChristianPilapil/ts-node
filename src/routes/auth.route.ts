import express, { Request, Response, NextFunction } from "express";
import { handle2FA, handleAuthStatus, handleGetAllUsers, handleLogin, handleRegister } from "../controllers/auth.controller";
import { validate } from "../middleware/validation.middleware";
import { registerSchema } from "../schemas/auth.schema";
import passport from "../strategies/local-strategy";
import { ensureAuthenticated } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/register", validate(registerSchema), handleRegister);
router.post("/login", passport.authenticate("local"), handleLogin);
router.post(
    "/2fa", 
    (req: Request, res: Response, next: NextFunction) => {
        if (req.isAuthenticated()) return next();

        return res.status(401).json({
            message: "Unauthorized user."
        })
    }, 
    handle2FA
);

router.get("/status", ensureAuthenticated, handleAuthStatus);
router.get("/", ensureAuthenticated, handleGetAllUsers);

export default router;