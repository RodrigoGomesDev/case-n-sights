import { ChatGroq } from "@langchain/groq";
import { ChatOpenAI } from "@langchain/openai";

type LLMProvider = "groq" | "openai";

interface LLMConfig {
    provider: LLMProvider;
    researchModel: string;
    analysisModel: string;
    writerModel: string;
}

const provider = (process.env.LLM_PROVIDER || "groq") as LLMProvider;

const config: LLMConfig = {
    provider,
    researchModel: provider === "groq" ? "llama-3.3-70b-versatile" : "gpt-4o-mini",
    analysisModel: provider === "groq" ? "llama-3.3-70b-versatile" : "gpt-4o",
    writerModel: provider === "groq" ? "llama-3.3-70b-versatile" : "gpt-4o",
};

export function createResearchLLM() {
    if (config.provider === "groq") {
        return new ChatGroq({
            model: config.researchModel,
            temperature: 0.3,
            apiKey: process.env.GROQ_API_KEY,
        });
    }

    return new ChatOpenAI({
        modelName: config.researchModel,
        temperature: 0.3,
        apiKey: process.env.OPENAI_API_KEY,
    });
}

export function createAnalysisLLM() {
    if (config.provider === "groq") {
        return new ChatGroq({
            model: config.analysisModel,
            temperature: 0.4,
            apiKey: process.env.GROQ_API_KEY,
        });
    }

    return new ChatOpenAI({
        modelName: config.analysisModel,
        temperature: 0.4,
        apiKey: process.env.OPENAI_API_KEY,
    });
}

export function createWriterLLM() {
    if (config.provider === "groq") {
        return new ChatGroq({
            model: config.writerModel,
            temperature: 0.5,
            apiKey: process.env.GROQ_API_KEY,
        });
    }

    return new ChatOpenAI({
        modelName: config.writerModel,
        temperature: 0.5,
        apiKey: process.env.OPENAI_API_KEY,
    });
}

export { config };
