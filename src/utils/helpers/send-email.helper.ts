import nodemailer from "nodemailer";
import config from "../../config/config";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.transporter_email,
        pass: config.transporter_pass,
    }
});

interface ISendOtp {
    receiver: string;
    subject: string;
    code?: string
    html?: string
}

export const sendOTP = async (props: ISendOtp) => {
    try {
        await transporter.sendMail({
            from: config.transporter_email,
            to: props.receiver,
            subject: props.subject,
            html: props.html || `<p>Your otp code: ${props.code}</p>`
        })
    } catch (error) {
        console.error("Failed to send OTP:", error);
        throw error;
    }
}