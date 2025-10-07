// Test setup file
process.env.NODE_ENV = "test";
process.env.LLM_PROVIDER = "groq";
process.env.GROQ_API_KEY = "test-groq-key";
process.env.OPENAI_API_KEY = "test-openai-key";
process.env.TAVILY_API_KEY = "test-tavily-key";

// Mock console methods to reduce noise during tests
global.console = {
    ...console,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
};
