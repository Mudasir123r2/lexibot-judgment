import { useState, useRef, useEffect } from "react";
import { FiSend, FiLoader } from "react-icons/fi";
import api from "../../../api/http";

export default function ChatTab() {
  const [messages, setMessages] = useState([
    { 
      role: "assistant", 
      content: "Hello! I'm LexiBot, your AI legal assistant. I can help you with:\n\n• Summarizing legal judgments\n• Searching for relevant cases\n• Analyzing case outcomes\n• Providing client guidance and checklists\n• Extracting key information from documents\n\nWhat would you like help with today?" 
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const send = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = input.trim();
    setMessages((m) => [...m, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await api.post("/ai/chat", { 
        message: userMessage,
        context: {}
      });
      
      setMessages((m) => [...m, { 
        role: "assistant", 
        content: data.response,
        timestamp: data.timestamp
      }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((m) => [...m, { 
        role: "assistant", 
        content: "Sorry, I encountered an error. Please try again." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Glass chat panel */}
      <div className="relative rounded-3xl ring-1 ring-white/10 bg-neutral-900/50 backdrop-blur-xl h-full flex flex-col shadow-xl">
        <div className="p-4 sm:p-6 flex-1 flex flex-col min-h-0">
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] md:max-w-[70%] lg:max-w-[65%] animate-fade-in ${
                  m.role === "user" ? "ml-auto" : ""
                }`}
              >
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed border whitespace-pre-wrap shadow-sm ${
                    m.role === "user"
                      ? "bg-gradient-to-br from-indigo-600/90 to-indigo-700/90 text-white border-indigo-500/30"
                      : "bg-neutral-800/80 text-slate-100 border-white/10 backdrop-blur-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input bar - Fixed at bottom */}
          <div className="shrink-0 flex items-center gap-2 pt-2 border-t border-white/10">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && send()}
              placeholder="Type your message..."
              disabled={loading}
              className="flex-1 rounded-xl border border-white/10 bg-neutral-900/60 text-slate-100 px-3 py-2.5 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent disabled:opacity-50"
            />
            <button
              onClick={send}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-semibold text-white shadow-[0_8px_30px_rgba(99,102,241,0.35)]
                         bg-[linear-gradient(135deg,#4338CA_0%,#6D28D9_30%,#7C3AED_55%,#DB2777_100%)] hover:shadow-[0_10px_40px_rgba(236,72,153,0.35)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <FiLoader className="animate-spin" /> : <FiSend />} Send
            </button>
          </div>
          {loading && (
            <div className="mt-2 text-xs text-slate-400 flex items-center gap-2">
              <FiLoader className="animate-spin" />
              <span>LexiBot is thinking...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

