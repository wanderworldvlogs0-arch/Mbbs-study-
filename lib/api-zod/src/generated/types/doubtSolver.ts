export interface DoubtChatSummary {
  id: string;
  title: string;
  createdAt: string;
}

export interface DoubtMessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface DoubtChatDetail {
  id: string;
  title: string;
  messages: DoubtMessageItem[];
}

export interface SendDoubtMessageRequest {
  chatId: string | null;
  message: string;
}

export interface SendDoubtMessageResponse {
  chatId: string;
  reply: string;
}
