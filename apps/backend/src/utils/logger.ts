type LogLevel = "info" | "warn" | "error";

interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: string;
    context?: string;
}

class Logger {
    private log(level: LogLevel, message: string, context?: string): void {
        const entry: LogEntry = {
            level,
            message,
            timestamp: new Date().toISOString(),
            context,
        };

        const output = `[${entry.timestamp}] ${level.toUpperCase()}${
            context ? ` [${context}]` : ""
        }: ${message}`;

        if (level === "error") {
            process.stderr.write(`${output}\n`);
        } else {
            process.stdout.write(`${output}\n`);
        }
    }

    info(message: string, context?: string): void {
        this.log("info", message, context);
    }

    warn(message: string, context?: string): void {
        this.log("warn", message, context);
    }

    error(message: string, context?: string, error?: Error): void {
        const errorMessage = error ? `${message}: ${error.message}` : message;
        this.log("error", errorMessage, context);
        if (error?.stack) {
            process.stderr.write(`${error.stack}\n`);
        }
    }
}

export const logger = new Logger();
