import { Request, Response, NextFunction } from "express";
import { Session } from "express-session";

export interface ICustomSession extends Session {
    twoFA_authenticated?: boolean;
}

export const ensureAuthenticated = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const session: ICustomSession = req.session;

    if (req.isAuthenticated() && session.twoFA_authenticated) return next();

    return res.status(401).json({
        message: "Unauthorized user."
    });
}