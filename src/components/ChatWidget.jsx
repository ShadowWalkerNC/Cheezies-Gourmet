import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import ReactMarkdown from "react-markdown";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  // Create conversation on first open
  useEffect(() => {
    if (!open) return;
    if (conversation) return;
    (async () => {
      const conv = await base44.agents.createConversation({
        agent_name: "cheezies_assistant",
        metadata: { name: "Customer Chat" },
      });
      setConversation(conv);
      setMessages(conv.messages || []);
    })();
  }, [open]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!conversation) return;
    const unsub = base44.agents.subscribeToConversation(conversation.id, (data) => {
      setMessages(data.messages || []);
    });
    return unsub;
  }, [conversation?.id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !conversation || sending) return;
    const text = input.trim();
    setInput("");
    setSending(true);
    await base44.agents.addMessage(conversation, { role: "user", content: text });
    setSending(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isTyping = messages.length > 0 &&
    messages[messages.length - 1]?.role === "user" &&
    sending === false &&
    !messages.find(m => m.role === "assistant" && messages.indexOf(m) > messages.findIndex(m2 => m2.role === "user" && m2 === messages[messages.length - 1]));

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed z-50 select-none"
            style={{
              bottom: "calc(var(--tab-bar-h) + 16px)",
              right: "20px",
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#f5c518",
              boxShadow: "0 8px 32px rgba(245,197,24,0.4)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <MessageCircle size={24} color="#1c1008" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed z-50 flex flex-col"
            style={{
              bottom: "calc(var(--tab-bar-h) + 16px)",
              right: "16px",
              left: "16px",
              maxWidth: 420,
              marginLeft: "auto",
              height: "min(520px, calc(100dvh - var(--tab-bar-h) - 32px - var(--safe-top)))",
              borderRadius: 20,
              background: "#160c03",
              border: "1px solid rgba(245,197,24,0.2)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{ borderBottom: "1px solid rgba(245,197,24,0.12)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
                  style={{ background: "rgba(245,197,24,0.15)" }}
                >
                  🧀
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: "#fff8e8" }}>Cheezies Assistant</p>
                  <p className="text-xs" style={{ color: "rgba(245,197,24,0.6)" }}>● Online</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="select-none p-2 rounded-full transition-colors"
                style={{ color: "rgba(255,235,180,0.4)", WebkitTapHighlightColor: "transparent" }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ overscrollBehavior: "contain" }}>
              {messages.length === 0 && (
                <div className="text-center pt-6 space-y-2">
                  <div className="text-4xl">🧀</div>
                  <p className="text-sm font-semibold" style={{ color: "#fff8e8" }}>Hey there!</p>
                  <p className="text-xs leading-relaxed px-4" style={{ color: "rgba(255,235,180,0.5)" }}>
                    Ask me about our menu, catering packages, or where to find the truck!
                  </p>
                </div>
              )}
              {messages.map((msg, i) => {
                const isUser = msg.role === "user";
                return (
                  <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                    {!isUser && (
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2 mt-1 flex-shrink-0"
                        style={{ background: "rgba(245,197,24,0.15)" }}
                      >
                        🧀
                      </div>
                    )}
                    <div
                      className="max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
                      style={
                        isUser
                          ? { background: "#f5c518", color: "#1c1008", fontWeight: 600 }
                          : { background: "rgba(255,200,60,0.07)", border: "1px solid rgba(245,197,24,0.12)", color: "#fff8e8" }
                      }
                    >
                      {isUser ? (
                        msg.content
                      ) : (
                        <ReactMarkdown className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_a]:text-yellow-400 [&_strong]:text-yellow-300">
                          {msg.content}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                );
              })}
              {(sending) && (
                <div className="flex justify-start items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2 flex-shrink-0"
                    style={{ background: "rgba(245,197,24,0.15)" }}
                  >
                    🧀
                  </div>
                  <div
                    className="flex items-center gap-1.5 rounded-2xl px-4 py-3"
                    style={{ background: "rgba(255,200,60,0.07)", border: "1px solid rgba(245,197,24,0.12)" }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "#f5c518", animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "#f5c518", animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "#f5c518", animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div
              className="flex items-end gap-2 px-4 py-3 flex-shrink-0"
              style={{ borderTop: "1px solid rgba(245,197,24,0.1)" }}
            >
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about our menu..."
                rows={1}
                className="flex-1 resize-none text-sm leading-relaxed"
                style={{
                  background: "rgba(255,200,60,0.06)",
                  border: "1px solid rgba(245,197,24,0.15)",
                  borderRadius: 14,
                  color: "#fff8e8",
                  padding: "10px 14px",
                  outline: "none",
                  maxHeight: 100,
                  overflowY: "auto",
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || sending}
                className="select-none flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-40"
                style={{ background: "#f5c518", WebkitTapHighlightColor: "transparent" }}
              >
                {sending ? <Loader2 size={16} color="#1c1008" className="animate-spin" /> : <Send size={16} color="#1c1008" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}