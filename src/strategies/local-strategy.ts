import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/user.model";
import { comparePassword } from "../utils/helpers/password.helpers";

passport.serializeUser((user: any, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        if (!user) throw new Error("User not found.");

        const user_obj = user.toObject();
        delete (user_obj as any).password;
        done(null, user_obj);
    } catch (error) {
        done(error, null);
    }
});

export default passport.use(
    new LocalStrategy(
        { usernameField: "email", passwordField: "password" },
        async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) throw new Error("User not found.");

            const isMatch = comparePassword(password, user.password);
            if (!isMatch) throw new Error("Bad Credentials");

            const user_obj = user.toObject();
            delete (user_obj as any).password; 
            done(null, user_obj);
        } catch (error) {
            return done(error);
        }
    })
);