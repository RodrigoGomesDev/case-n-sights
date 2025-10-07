import { logger } from "../logger";

describe("Logger", () => {
    let stdoutSpy: jest.SpyInstance;
    let stderrSpy: jest.SpyInstance;

    beforeEach(() => {
        stdoutSpy = jest.spyOn(process.stdout, "write").mockImplementation();
        stderrSpy = jest.spyOn(process.stderr, "write").mockImplementation();
    });

    afterEach(() => {
        stdoutSpy.mockRestore();
        stderrSpy.mockRestore();
    });

    describe("info", () => {
        it("should log info messages to stdout", () => {
            logger.info("Test message");

            expect(stdoutSpy).toHaveBeenCalled();
            const output = stdoutSpy.mock.calls[0][0];
            expect(output).toContain("INFO");
            expect(output).toContain("Test message");
        });

        it("should include context when provided", () => {
            logger.info("Test message", "TestContext");

            const output = stdoutSpy.mock.calls[0][0];
            expect(output).toContain("[TestContext]");
        });
    });

    describe("warn", () => {
        it("should log warning messages to stdout", () => {
            logger.warn("Warning message");

            expect(stdoutSpy).toHaveBeenCalled();
            const output = stdoutSpy.mock.calls[0][0];
            expect(output).toContain("WARN");
            expect(output).toContain("Warning message");
        });

        it("should include context when provided", () => {
            logger.warn("Warning message", "TestContext");

            const output = stdoutSpy.mock.calls[0][0];
            expect(output).toContain("[TestContext]");
        });
    });

    describe("error", () => {
        it("should log error messages to stderr", () => {
            logger.error("Error message");

            expect(stderrSpy).toHaveBeenCalled();
            const output = stderrSpy.mock.calls[0][0];
            expect(output).toContain("ERROR");
            expect(output).toContain("Error message");
        });

        it("should include error details when Error object is provided", () => {
            const error = new Error("Test error");
            logger.error("Error occurred", undefined, error);

            const output = stderrSpy.mock.calls[0][0];
            expect(output).toContain("Error occurred: Test error");
        });

        it("should log stack trace when Error object has stack", () => {
            const error = new Error("Test error");
            logger.error("Error occurred", "TestContext", error);

            expect(stderrSpy).toHaveBeenCalledTimes(2);
            const stackOutput = stderrSpy.mock.calls[1][0];
            expect(stackOutput).toContain("Error: Test error");
        });

        it("should include context when provided", () => {
            logger.error("Error message", "TestContext");

            const output = stderrSpy.mock.calls[0][0];
            expect(output).toContain("[TestContext]");
        });
    });

    describe("timestamp", () => {
        it("should include ISO timestamp in all log messages", () => {
            logger.info("Test message");

            const output = stdoutSpy.mock.calls[0][0];
            // Check for ISO 8601 timestamp format
            expect(output).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/);
        });
    });
});
