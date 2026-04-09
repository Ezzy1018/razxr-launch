import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai";

let model: GenerativeModel | null = null;

function readGeminiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("Missing required environment variable: GEMINI_API_KEY");
  }
  return key;
}

export function getGeminiModel(): GenerativeModel {
  if (model) {
    return model;
  }

  const client = new GoogleGenerativeAI(readGeminiKey());
  model = client.getGenerativeModel({ model: "gemini-2.5-flash" });
  return model;
}

export async function generateReviewFeedback(prompt: string): Promise<string> {
  const response = await getGeminiModel().generateContent(prompt);
  return response.response.text();
}
