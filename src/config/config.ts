type Config = {
    port: number;
    nodeEnv: string;
    session_secret: string;
    transporter_email: string;
    transporter_pass: string;
}

const config: Config = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    session_secret: process.env.SESSION_SECRET || "session-secret",
    transporter_email: process.env.EMAIL_USER || "gmail account",
    transporter_pass: process.env.EMAIL_PASS || "gmail app password"
};

export default config;