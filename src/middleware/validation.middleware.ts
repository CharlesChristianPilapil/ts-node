import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod";

export const validate = <T>(schema: ZodType<T>) =>
    (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            const formattedErrors: Record<string, string> = {};

            error.issues.forEach((issue) => {
                const key = issue.path.join('.') || "unknown";
                formattedErrors[key] = issue.message;
            });

            return res.status(400).json({
                message: "Validation failed.",
                errors: formattedErrors,
            });
        };
        next(error);
    }
}