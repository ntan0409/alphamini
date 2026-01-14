import { pythonHttp } from "@/utils/http";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatbotQueryRequest {
  question: string;
}

export interface ChatbotQueryResponse {
  answer: string;
}

export const sendChatbotQuery = async (
  question: string,
  signal?: AbortSignal
): Promise<ChatbotQueryResponse> => {
  const response = await pythonHttp.post<ChatbotQueryResponse>(
    "/chatbot/query",
    { question },
    { signal }
  );
  return response.data;
};
