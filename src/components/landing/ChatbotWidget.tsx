import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface ChatbotWidgetProps {
  onNavigate?: (section: string) => void;
}

const ChatbotWidget = ({ onNavigate = () => {} }: ChatbotWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
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
            text: "Hi there! I'm Fintr's assistant. How can I help you today?",
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
      let section = "";

      // Simple routing logic based on keywords
      if (
        userMessage.includes("pricing") ||
        userMessage.includes("cost") ||
        userMessage.includes("price")
      ) {
        botResponse =
          "You can find our pricing information in the Pricing section. Would you like me to take you there?";
        section = "pricing";
      } else if (
        userMessage.includes("feature") ||
        userMessage.includes("what can you do")
      ) {
        botResponse =
          "Fintr offers various features like expense tracking, budgeting, and AI-powered insights. Check out our Core Features section for more details.";
        section = "core-features";
      } else if (
        userMessage.includes("coming") ||
        userMessage.includes("future") ||
        userMessage.includes("next")
      ) {
        botResponse =
          "We have exciting features coming soon! Visit our What's Next section to learn more.";
        section = "whats-next";
      } else if (
        userMessage.includes("how") ||
        userMessage.includes("tutorial") ||
        userMessage.includes("learn")
      ) {
        botResponse =
          "You can learn how to use Fintr in our Discover section with tutorials and FAQs.";
        section = "how-to-use";
      } else if (
        userMessage.includes("job") ||
        userMessage.includes("career") ||
        userMessage.includes("work")
      ) {
        botResponse =
          "We're hiring! Check out the Work with Fintr tab in our Discover section for open positions.";
        section = "how-to-use";
      } else if (
        userMessage.includes("waitlist") ||
        userMessage.includes("sign up") ||
        userMessage.includes("join")
      ) {
        botResponse =
          "You can join our waitlist by clicking the 'Join Waitlist' button in the hero section or pricing section.";
      } else {
        botResponse =
          "I'm here to help you navigate Fintr. You can ask about our features, pricing, or how to use the app. Is there something specific you'd like to know?";
      }

      setMessages((prev) => [...prev, { text: botResponse, isUser: false }]);
      setIsTyping(false);

      // If a section was identified and the response suggests navigation
      if (
        section &&
        botResponse.includes("Would you like me to take you there?")
      ) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              text: "I can navigate you there directly. Just click this button:",
              isUser: false,
            },
          ]);

          // Add a slight delay before adding the navigation button message
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                text: `<button class="bg-[#0A3D62] hover:bg-[#0A3D62]/80 text-white rounded-md px-4 py-2 mt-2" onclick="window.location.href='/#${section}';">Go to ${section
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}</button>`,
                isUser: false,
              },
            ]);
          }, 500);
        }, 1000);
      }
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
              <h3 className="font-medium">Fintr Assistant</h3>
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
              placeholder="Ask me anything..."
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
            <span className="font-medium">Fintr Assistant</span>
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
        id="chatbot-widget-button"
        onClick={toggleChatbot}
        className="bg-[#0A3D62] hover:bg-[#0A3D62]/80 text-white rounded-full p-3 shadow-lg transition-transform hover:scale-105"
      >
        <MessageSquare className="h-6 w-6" />
      </button>
    </div>
  );
};

export default ChatbotWidget;
