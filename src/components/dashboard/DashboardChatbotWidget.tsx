import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { sendChatMessage, ChatMessage } from "../../lib/openai";

interface DashboardChatbotWidgetProps {
  onNavigate?: (section: string) => void;
  initialMessage?: string;
}

const DashboardChatbotWidget = ({
  onNavigate = () => {},
  initialMessage = "",
}: DashboardChatbotWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>(
    [],
  );
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChatbot = (initialMessage?: string) => {
    const wasOpen = isOpen;
    setIsOpen(!isOpen);
    setIsMinimized(false);
    setError(null);

    if (!wasOpen) {
      if (messages.length === 0) {
        // Add welcome message when opening for the first time
        setTimeout(() => {
          setMessages([
            {
              text: "Hi there! I'm Fintr's dashboard assistant. How can I help you today?",
              isUser: false,
            },
          ]);
        }, 300);
      }

      // If an initial message is provided, set it in the input field
      if (initialMessage) {
        setMessage(initialMessage);
      }
    }
  };

  const minimizeChatbot = () => {
    setIsMinimized(true);
  };

  const maximizeChatbot = () => {
    setIsMinimized(false);
  };

  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    // Add user message
    const userMsg = message.trim();
    setMessages([...messages, { text: userMsg, isUser: true }]);
    setIsTyping(true);
    setError(null);
    setMessage("");

    try {
      // Convert messages to OpenAI format
      const chatHistory: ChatMessage[] = [
        {
          role: "system",
          content:
            "You are Fintr's financial assistant. You help users understand their finances, provide insights about their spending habits, and guide them through the Fintr dashboard. Be concise, helpful, and focus on financial advice and dashboard navigation. The dashboard has tabs for Transactions, Budgets, Insights, and Settings.",
        },
        ...messages.map((msg) => ({
          role: msg.isUser ? "user" : "assistant",
          content: msg.text,
        })),
        {
          role: "user",
          content: userMsg,
        },
      ];

      // Call OpenAI API via our Edge Function
      const response = await sendChatMessage(chatHistory);
      const botResponse = response.choices[0].message.content;

      // Add bot response to messages
      setMessages((prev) => [...prev, { text: botResponse, isUser: false }]);
    } catch (err) {
      console.error("Error getting response from OpenAI:", err);
      setError(
        "Sorry, I'm having trouble connecting right now. Please try again later.",
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all duration-300">
      {isOpen && !isMinimized && (
        <div className="bg-white rounded-lg shadow-xl w-80 sm:w-96 mb-4 overflow-hidden border border-gray-200 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#0A3D62]">
          <div className="bg-[#0A3D62] text-white p-3 flex justify-between items-center">
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              <h3 className="font-medium">Dashboard Assistant</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={minimizeChatbot}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 12H6" />
                </svg>
              </button>
              <button
                onClick={toggleChatbot}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="h-80 overflow-y-auto p-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-3 ${msg.isUser ? "text-right" : "text-left"}`}
              >
                <div
                  className={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${msg.isUser ? "bg-[#0A3D62] text-white" : "bg-white border border-gray-200 text-[#0A3D62]"}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="text-left mb-3">
                <div className="inline-block rounded-lg px-4 py-2 bg-white border border-gray-200 text-[#0A3D62]">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="text-left mb-3">
                <div className="inline-block rounded-lg px-4 py-2 bg-red-50 border border-red-200 text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {error}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-gray-200 flex">
            <Input
              type="text"
              placeholder="Ask me anything about your finances..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-grow mr-2"
            />
            <Button
              onClick={handleSendMessage}
              className="bg-[#0A3D62] hover:bg-[#0A3D62]/80"
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {isOpen && isMinimized && (
        <div className="bg-[#0A3D62] text-white rounded-lg shadow-lg mb-4 p-3 flex items-center justify-between">
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            <span className="font-medium">Dashboard Assistant</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={maximizeChatbot}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
              </svg>
            </button>
            <button
              onClick={toggleChatbot}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <button
        id="dashboard-chatbot-widget-button"
        onClick={() => toggleChatbot()}
        className="bg-[#0A3D62] hover:bg-[#0A3D62]/80 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl relative"
        aria-label="Open AI assistant"
      >
        <MessageSquare className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
          AI
        </span>
      </button>
    </div>
  );
};

export default DashboardChatbotWidget;
