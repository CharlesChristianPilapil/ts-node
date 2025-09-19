import { Request, Response, NextFunction } from "express";

export type AppError ={
    status?: number;
} & Error;

export const notFound = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const error = new Error(`Not found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}

export const errorHandler = (
    err: AppError,
    _req: Request,
    res: Response,
    _next: NextFunction,
) => {
    console.error(err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
    });
};