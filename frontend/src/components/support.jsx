import React, { useState, useRef, useEffect } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  HelpCircle,
  BookOpen,
  Mic,
  Volume2,
} from "lucide-react";

export default function Support() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content:
        "مرحباً! أنا سيار، مساعدك الذكي لتعلم النطق العربي. كيف يمكنني مساعدتك اليوم؟",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    const el = messagesContainerRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:5000/api/gemma2-chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.slice(-10).map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const aiMessage = {
          id: Date.now() + 1,
          role: "assistant",
          content: data.response,
          timestamp: data.timestamp || new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        const errorMessage = {
          id: Date.now() + 1,
          role: "assistant",
          content:
            data.fallback_response ||
            "عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.",
          timestamp: new Date().toISOString(),
          isError: true,
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: "عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.",
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        content:
          "مرحباً! أنا سيار، مساعدك الذكي لتعلم النطق العربي. كيف يمكنني مساعدتك اليوم؟",
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const suggestedQuestions = [
    "كيف يمكنني تحسين نطق الحروف العربية؟",
    "ما هي أفضل الطرق لتعلم النطق الصحيح؟",
    "كيف يمكنني التغلب على صعوبات النطق؟",
    "ما هي التمارين المفيدة لتحسين النطق؟",
    "كيف يمكنني مساعدة طفلي في النطق؟",
  ];

  const handleSuggestedQuestion = (question) => {
    setInputMessage(question);
    inputRef.current?.focus();
  };

  return (
    <div className="relative bg-gradient-dark text-white min-h-screen">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 cyber-grid opacity-10 z-[-2]"></div>

      {/* Particle Effects */}
      <div className="fixed inset-0 particles z-[-1]"></div>

      <Navbar />

      <div className="pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-hologram text-neon-blue px-6 py-3 rounded-full text-sm font-medium mb-6 animate-fade-in-down border border-neon-blue/30 backdrop-blur-md">
              <Bot className="w-4 h-4 animate-pulse" />
              AI Support Assistant
            </div>
            <h1 className="text-responsive-xl font-bold text-white mb-6">
              الدعم{" "}
              <span className="gradient-text" data-text="الذكي">
                الذكي
              </span>
            </h1>
            <p className="text-lg text-cyber-300 max-w-2xl mx-auto">
              احصل على مساعدة فورية من سيار، مساعدك الذكي لتعلم النطق العربي
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Chat Interface */}
            <div className="lg:col-span-3">
              <div className="card-gradient h-[calc(100vh-14rem)] min-h-[500px] flex flex-col animate-fade-in-left">
                {/* Chat Header */}
                <div className="p-6 border-b border-cyber-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-neon-blue/20 rounded-full flex items-center justify-center">
                        <Bot className="w-5 h-5 text-neon-blue" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">
                          سيار - المساعد الذكي
                        </h3>
                        <p className="text-cyber-400 text-sm">
                          {isTyping ? "يكتب..." : "متصل"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={clearChat}
                      className="text-cyber-400 hover:text-neon-red transition-colors duration-300 cursor-pointer"
                      title="مسح المحادثة"
                    >
                      مسح المحادثة
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto p-6 space-y-4"
                >
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="w-8 h-8 bg-neon-blue/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-neon-blue" />
                        </div>
                      )}

                      <div
                        className={`max-w-[80%] p-4 rounded-2xl ${
                          message.role === "user"
                            ? "bg-neon-blue/20 text-white border border-neon-blue/30"
                            : message.isError
                            ? "bg-neon-red/20 text-white border border-neon-red/30"
                            : "bg-cyber-800/50 text-cyber-100 border border-cyber-600"
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                        <p className="text-xs text-cyber-400 mt-2">
                          {new Date(message.timestamp).toLocaleTimeString(
                            "ar-SA",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>

                      {message.role === "user" && (
                        <div className="w-8 h-8 bg-neon-green/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-neon-green" />
                        </div>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 bg-neon-blue/20 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-neon-blue" />
                      </div>
                      <div className="bg-cyber-800/50 text-cyber-100 border border-cyber-600 p-4 rounded-2xl">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-neon-blue" />
                          <span className="text-sm">جاري الكتابة...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-6 border-t border-cyber-600">
                  <form onSubmit={handleSendMessage} className="flex gap-3">
                    <div className="flex-1 relative">
                      <textarea
                        ref={inputRef}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="اكتب رسالتك هنا..."
                        className="input-enhanced resize-none h-12 py-3 pr-12"
                        rows="1"
                        disabled={isLoading}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!inputMessage.trim() || isLoading}
                      className="btn-primary px-6 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Actions */}
              <div className="card-gradient p-6 animate-fade-in-right">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-neon-purple" />
                  أسئلة سريعة
                </h3>
                <div className="space-y-3">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuestion(question)}
                      className="w-full text-right p-3 bg-cyber-800/50 hover:bg-cyber-700/50 border border-cyber-600 hover:border-neon-blue/50 rounded-lg transition-all duration-300 text-sm text-cyber-200 hover:text-white cursor-pointer"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div
                className="card-gradient p-6 animate-fade-in-right"
                style={{ animationDelay: "200ms" }}
              >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-neon-green" />
                  ميزات سيار
                </h3>
                <div className="space-y-3 text-sm text-cyber-300">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-neon-blue rounded-full"></div>
                    تحليل النطق بالذكاء الاصطناعي
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                    تمارين تفاعلية مخصصة
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-neon-purple rounded-full"></div>
                    تتبع التقدم في الوقت الفعلي
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-neon-pink rounded-full"></div>
                    دعم متعدد اللغات
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div
                className="card-gradient p-6 animate-fade-in-right"
                style={{ animationDelay: "400ms" }}
              >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-neon-pink" />
                  نصائح للاستخدام
                </h3>
                <div className="space-y-3 text-sm text-cyber-300">
                  <p>• اطرح أسئلة محددة للحصول على إجابات أفضل</p>
                  <p>• استخدم اللغة العربية للتواصل مع سيار</p>
                  <p>• يمكنك طلب تمارين مخصصة لنطقك</p>
                  <p>• استخدم الأسئلة السريعة للبدء</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
