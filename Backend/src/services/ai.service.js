import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AIMessage, HumanMessage, SystemMessage } from "langchain";
import { ChatMistralAI } from "@langchain/mistralai";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistrialModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

export async function genereateResponse(messages) {
  const response = await geminiModel.invoke(
    messages.map((msg) => {
      if (msg.role == "user") {
        return new HumanMessage(msg.content);
      } else if (msg.role == "ai") {
        return new AIMessage(msg.content);
      }
    }),
  );
  return response.text;
}

export async function generateChatTitle(message) {
  const response = await mistrialModel.invoke([
    new SystemMessage(
      `You are a helpful assistant that generates concise and desctiptive title for chat conversations.

      User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2-4 words. The title should be clear, relavent, and engaging, giving users a quick understanding of the chat's topic`,
    ),
    new HumanMessage(
      `Generate a title for a chat conversation based on the following first message: ${message}`,
    ),
  ]);
  return response.text;
}
