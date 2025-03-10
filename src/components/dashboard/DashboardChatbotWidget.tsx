import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface DashboardChatbotWidgetProps {
  onNavigate?: (section: string) => void;
}

const DashboardChatbotWidget = ({
  onNavigate = () => {},
}: DashboardChatbotWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>(
    [],
  );
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
    if (!isOpen && messages.length === 0) {
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
  };

  const minimizeChatbot = () => {
    setIsMinimized(true);
  };

  const maximizeChatbot = () => {
    setIsMinimized(false);
  };

  const handleSendMessage = () => {
    if (message.trim() === "") return;

    // Add user message
    setMessages([...messages, { text: message, isUser: true }]);
    setIsTyping(true);

    // Process the message
    const userMessage = message.toLowerCase();
    setMessage("");

    // Simulate typing delay
    setTimeout(() => {
      let botResponse = "";

      // Simple routing logic based on keywords
      if (
        userMessage.includes("transaction") ||
        userMessage.includes("expense") ||
        userMessage.includes("income")
      ) {
        botResponse =
          "You can view and manage all your transactions in the Transactions tab. Would you like me to navigate you there?";
      } else if (
        userMessage.includes("budget") ||
        userMessage.includes("spending limit")
      ) {
        botResponse =
          "You can set and track your budgets in the Budgets tab. Would you like me to show you how?";
      } else if (
        userMessage.includes("goal") ||
        userMessage.includes("target")
      ) {
        botResponse =
          "You can create financial goals in the Goals tab. I can help you set up a new goal if you'd like.";
      } else if (
        userMessage.includes("insight") ||
        userMessage.includes("analysis") ||
        userMessage.includes("report")
      ) {
        botResponse =
          "Check out the Insights tab for detailed analysis of your finances. I can explain any chart or metric you're curious about.";
      } else {
        botResponse =
          "I'm here to help you navigate your financial dashboard. You can ask about transactions, budgets, goals, or insights. What would you like to know more about?";
      }

      setMessages((prev) => [...prev, { text: botResponse, isUser: false }]);
      setIsTyping(false);
    }, 1000);
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
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && !isMinimized && (
        <div className="bg-white rounded-lg shadow-xl w-80 sm:w-96 mb-4 overflow-hidden border border-gray-200">
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
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                ></div>
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
        onClick={toggleChatbot}
        className="bg-[#0A3D62] hover:bg-[#0A3D62]/80 text-white rounded-full p-3 shadow-lg transition-transform hover:scale-105"
      >
        <MessageSquare className="h-6 w-6" />
      </button>
    </div>
  );
};

export default DashboardChatbotWidget;
