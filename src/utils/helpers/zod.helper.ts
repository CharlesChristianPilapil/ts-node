import { ZodError } from "zod"

export const formatZodError = (error: unknown): Record<string, string> => {
    if (error instanceof ZodError) {
        const formattedErrors: Record<string, string> = {};

        error.issues.forEach((issue) => {
            const key = issue.path[0]?.toString() || "unknown";
            formattedErrors[key] = issue.message;
        });

        return formattedErrors;
    }

    return {};
};