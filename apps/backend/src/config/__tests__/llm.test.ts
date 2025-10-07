import { ChatGroq } from "@langchain/groq";
import { config, createAnalysisLLM, createResearchLLM, createWriterLLM } from "../llm";

jest.mock("@langchain/groq");
jest.mock("@langchain/openai");

describe("LLM Configuration", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("config", () => {
        it("should have the correct default provider", () => {
            expect(config.provider).toBe("groq");
        });

        it("should have research, analysis, and writer models defined", () => {
            expect(config.researchModel).toBeDefined();
            expect(config.analysisModel).toBeDefined();
            expect(config.writerModel).toBeDefined();
        });
    });

    describe("createResearchLLM", () => {
        it("should create ChatGroq instance when provider is groq", () => {
            process.env.LLM_PROVIDER = "groq";

            createResearchLLM();

            expect(ChatGroq).toHaveBeenCalledWith({
                model: expect.any(String),
                temperature: 0.3,
                apiKey: process.env.GROQ_API_KEY,
            });
        });

        it("should use correct API key from environment", () => {
            createResearchLLM();

            expect(ChatGroq).toHaveBeenCalledWith(
                expect.objectContaining({
                    apiKey: process.env.GROQ_API_KEY,
                }),
            );
        });

        it("should use temperature 0.3 for research", () => {
            createResearchLLM();

            expect(ChatGroq).toHaveBeenCalledWith(expect.objectContaining({ temperature: 0.3 }));
        });
    });

    describe("createAnalysisLLM", () => {
        it("should create ChatGroq instance when provider is groq", () => {
            createAnalysisLLM();

            expect(ChatGroq).toHaveBeenCalledWith({
                model: expect.any(String),
                temperature: 0.4,
                apiKey: process.env.GROQ_API_KEY,
            });
        });

        it("should use temperature 0.4 for analysis", () => {
            createAnalysisLLM();

            expect(ChatGroq).toHaveBeenCalledWith(expect.objectContaining({ temperature: 0.4 }));
        });
    });

    describe("createWriterLLM", () => {
        it("should create ChatGroq instance when provider is groq", () => {
            createWriterLLM();

            expect(ChatGroq).toHaveBeenCalledWith({
                model: expect.any(String),
                temperature: 0.5,
                apiKey: process.env.GROQ_API_KEY,
            });
        });

        it("should use temperature 0.5 for writer", () => {
            createWriterLLM();

            expect(ChatGroq).toHaveBeenCalledWith(expect.objectContaining({ temperature: 0.5 }));
        });
    });

    describe("temperature values", () => {
        it("should use appropriate temperatures for different tasks", () => {
            createResearchLLM();
            createAnalysisLLM();
            createWriterLLM();

            const calls = (ChatGroq as jest.MockedClass<typeof ChatGroq>).mock.calls;

            expect(calls[0]?.[0]?.temperature).toBe(0.3); // Research
            expect(calls[1]?.[0]?.temperature).toBe(0.4); // Analysis
            expect(calls[2]?.[0]?.temperature).toBe(0.5); // Writer
        });
    });
});
