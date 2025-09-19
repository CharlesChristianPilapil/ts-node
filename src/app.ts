import express, { type Response, type Request } from "express";
import dotenv from 'dotenv';
dotenv.config({ quiet: true });

import { errorHandler, notFound } from "./middleware/error.middleware";
import authRoutes from "./routes/auth.route";
import connectDB from "./config/dbConfig";
import cookieParser from 'cookie-parser';
import session from "express-session";
import config from "./config/config";
import passport from "passport";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";

const createApp = () => {
    connectDB();
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser("helloworld"));
    app.use(
        session({
            secret: config.session_secret,
            saveUninitialized: true,
            resave: false,
            cookie: {
                maxAge: 24 * 60 * 60 * 1000,
            },
            store: MongoStore.create({
                client: mongoose.connection.getClient(),
            })
        })
    );

    app.use(passport.initialize());
    app.use(passport.session());

    app.use("/auth", authRoutes);

    app.get('/favicon.ico', (_req, res) => res.status(204));
    app.get("/", (_req: Request, res: Response) => {
        res.send("Check");
    });

    app.use(notFound);
    app.use(errorHandler);

    return app;
};

export default createApp;