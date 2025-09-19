import mongoose, { Types } from "mongoose";

export interface ITwoFASettings {
    enabled: boolean;
    secret?: string;
    code?: string;
    expiration?: Date;
}

export interface IUser {
    _id: Types.ObjectId;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
    twoFA_authentication: ITwoFASettings;
}

const userSchema = new mongoose.Schema<IUser>(
    {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        username: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        twoFA_authentication: {
            enabled: { type: Boolean, default: true },
            secret: { type: String },
            code: { type: String },
            expiration: { type: Date }
        }
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model<IUser>("User", userSchema, "users");

export default User;