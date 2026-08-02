import { useEffect, useRef, useState } from "react";
import { Send, Plus, MessageSquare, Sparkles, User } from "lucide-react";
import { AppLayout } from "../components/layout/AppLayout";
import { doubtSolverApi } from "../lib/api";
import type { DoubtChatSummary, DoubtMessageItem } from "@workspace/api-zod";

function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const elements: JSX.Element[] = [];
  let listItems: JSX.Element[] = [];

  const processInline = (str: string, key: string) =>
    str.split(/(\*\*.*?\*\*)/g).map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={`${key}-${i}`} className="font-semibold text-slate-900 dark:text-slate-100">{part.slice(2, -2)}</strong>
      ) : (
        <span key={`${key}-${i}`}>{part}</span>
      ),
    );

  lines.forEach((line, i) => {
    if (line.trim().startsWith("- ")) {
      listItems.push(
        <li key={i} className="flex items-start gap-2 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mt-2 shrink-0" />
          <span>{processInline(line.trim().slice(2), `li-${i}`)}</span>
        </li>,
      );
    } else {
      if (listItems.length) {
        elements.push(<ul key={`ul-${i}`} className="mb-3 space-y-1">{listItems}</ul>);
        listItems = [];
      }
      if (line.trim()) {
        elements.push(<p key={i} className="mb-3 leading-relaxed">{processInline(line, `p-${i}`)}</p>);
      }
    }
  });
  if (listItems.length) elements.push(<ul key="ul-end" className="mb-3 space-y-1">{listItems}</ul>);
  return <>{elements}</>;
}

export function AIDoubtSolver() {
  const [chats, setChats] = useState<DoubtChatSummary[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<DoubtMessageItem[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    doubtSolverApi.chats().then(setChats).catch(() => setChats([]));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const openChat = async (chatId: string) => {
    setActiveChatId(chatId);
    const detail = await doubtSolverApi.chat(chatId);
    setMessages(detail.messages);
  };

  const newChat = () => {
    setActiveChatId(null);
    setMessages([]);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setSending(true);
    setMessages((m) => [...m, { id: `temp-${Date.now()}`, role: "user", content: text }]);

    try {
      const res = await doubtSolverApi.send(activeChatId, text);
      setMessages((m) => [...m, { id: `temp-${Date.now()}-r`, role: "assistant", content: res.reply }]);
      if (!activeChatId) {
        setActiveChatId(res.chatId);
        doubtSolverApi.chats().then(setChats).catch(() => {});
      }
    } catch (e) {
      setMessages((m) => [
        ...m,
        { id: `temp-${Date.now()}-e`, role: "assistant", content: e instanceof Error ? e.message : "Something went wrong." },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <AppLayout pageTitle="AI Doubt Solver">
      <div className="h-full flex">
        <div className="w-64 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col shrink-0 hidden md:flex">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700">
            <button
              onClick={newChat}
              className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm"
            >
              <Plus className="w-4 h-4" /> New Chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {chats.map((c) => (
              <button
                key={c.id}
                onClick={() => openChat(c.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm mb-1 flex items-center gap-2 truncate ${
                  activeChatId === c.id ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span className="truncate">{c.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500 gap-3">
                <Sparkles className="w-10 h-10 text-blue-400 dark:text-blue-500" />
                <p className="text-lg font-medium text-slate-600 dark:text-slate-300">Ask me anything about your studies</p>
                <p className="text-sm max-w-sm">Explain a concept, get a mnemonic, or generate a quick MCQ quiz.</p>
              </div>
            )}
            <div className="max-w-3xl mx-auto flex flex-col gap-6">
              {messages.map((m) => (
                <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    m.role === "user" ? "bg-slate-900 dark:bg-slate-700 text-white" : "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
                  }`}>
                    {m.role === "user" ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                  </div>
                  <div className={`rounded-2xl px-4 py-3 max-w-[85%] text-[15px] ${
                    m.role === "user" ? "bg-slate-900 dark:bg-slate-700 text-white" : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                  }`}>
                    {m.role === "assistant" ? renderMarkdown(m.content) : m.content}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="rounded-2xl px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 text-sm">Thinking…</div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
            <div className="max-w-3xl mx-auto flex items-end gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask a medical question…"
                rows={1}
                className="flex-1 resize-none border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <button
                onClick={handleSend}
                disabled={sending || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white p-3 rounded-xl"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
                  }
