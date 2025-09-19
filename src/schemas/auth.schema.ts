import * as z from "zod";

export const registerSchema = z.object({
    first_name: z.string()
        .nonempty("Please enter your first name.")
        .min(2, "First name must be at least 2 characters long.")
        .max(32, "First name cannot exceed 32 characters."),
    last_name: z.string()
        .nonempty("Please enter your last name.")
        .min(2, "Last name must be at least 2 characters long.")
        .max(32, "Last name cannot exceed 32 characters."),
    username: z.string()
        .nonempty("Please enter your username.")
        .min(2, "Usernmae must be at least 2 characters long.")
        .max(32, "Username cannot exceed 32 characters."),
    email: z.email("Must be a valid email address.")
        .nonempty("Please enter your email."),
    password: z.string()
        .nonempty("Password is required.")
        .min(8, "Password must be at least 8 characters.")
        .max(64, "Password cannot exceed 64 characters.")
        .regex(
            /(?=.*[0-9])(?=.*[!@#$%^&*])/,
            "Password must contain at least one number and one special character."
        ),
});