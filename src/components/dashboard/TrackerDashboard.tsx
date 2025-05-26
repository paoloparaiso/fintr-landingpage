import React, { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  CreditCard,
  DollarSign,
  Home,
  PiggyBank,
  Settings,
  User,
} from "lucide-react";
import DashboardChatbotWidget from "./DashboardChatbotWidget";
import AddTransactionDialog from "./AddTransactionDialog";
import GoalSection from "./GoalSection";
import ProfilePage from "./ProfilePage";
import SettingsPage from "./SettingsPage";

const TrackerDashboard = () => {
  const [activeTab, setActiveTab] = useState("transactions");
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [navbarInput, setNavbarInput] = useState("");
  const chatbotRef = useRef<HTMLButtonElement | null>(null);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <a href="/" className="flex items-center">
                <img
                  src="https://raw.githubusercontent.com/paoloparaiso/Fintr/c273332c59168c59539d499b2ee119186af8f88a/Fintr_Logo.png"
                  alt="Logo"
                  className="h-8 w-auto"
                />
              </a>
            </div>

            <div className="flex items-center justify-center relative w-full max-w-md mx-4">
              <div className="w-full relative">
                <div
                  className="bg-white border border-gray-200 hover:border-[#0A3D62] rounded-full py-2 px-4 shadow-sm transition-all flex items-center w-full cursor-pointer"
                  onClick={() => {
                    // Trigger the floating chatbot widget
                    const chatbotWidget = document.getElementById(
                      "dashboard-chatbot-widget-button",
                    );
                    if (chatbotWidget) {
                      chatbotWidget.click();
                    }
                  }}
                  aria-label="Open AI assistant"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      const chatbotWidget = document.getElementById(
                        "dashboard-chatbot-widget-button",
                      );
                      if (chatbotWidget) {
                        chatbotWidget.click();
                      }
                    }
                  }}
                >
                  <input
                    type="text"
                    placeholder="Ask Fintr anything..."
                    className="bg-transparent border-none outline-none flex-grow text-sm text-gray-700"
                    value={navbarInput}
                    onChange={(e) => setNavbarInput(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && navbarInput.trim()) {
                        e.preventDefault();
                        e.stopPropagation();
                        const chatbotWidget = document.getElementById(
                          "dashboard-chatbot-widget-button",
                        ) as HTMLButtonElement;
                        if (chatbotWidget) {
                          // Store the reference to the chatbot button
                          chatbotRef.current = chatbotWidget;
                          // Store the message to be sent
                          const messageToSend = navbarInput;
                          // Clear the navbar input immediately
                          setNavbarInput("");
                          // Click the button to open the chatbot
                          chatbotWidget.click();
                          // Wait for the chatbot to open and then set the message
                          setTimeout(() => {
                            // Find the chatbot input and set its value
                            const chatbotInput = document.querySelector(
                              ".fixed.bottom-6.right-6 input",
                            ) as HTMLInputElement;
                            if (chatbotInput) {
                              // Set the value and dispatch an input event
                              chatbotInput.value = messageToSend;
                              chatbotInput.dispatchEvent(
                                new Event("input", { bubbles: true }),
                              );
                              // Find and click the send button
                              const sendButton = document.querySelector(
                                '.fixed.bottom-6.right-6 button[size="icon"]',
                              ) as HTMLButtonElement;
                              if (sendButton) {
                                setTimeout(() => sendButton.click(), 100);
                              }
                            }
                          }, 300);
                        }
                      }
                    }}
                    aria-label="AI assistant search input"
                  />
                  <button
                    className="text-[#0A3D62] hover:text-[#0A3D62]/80 bg-gray-100 rounded-full p-1.5 flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (navbarInput.trim()) {
                        const chatbotWidget = document.getElementById(
                          "dashboard-chatbot-widget-button",
                        ) as HTMLButtonElement;
                        if (chatbotWidget) {
                          // Store the reference to the chatbot button
                          chatbotRef.current = chatbotWidget;
                          // Store the message to be sent
                          const messageToSend = navbarInput;
                          // Clear the navbar input immediately
                          setNavbarInput("");
                          // Click the button to open the chatbot
                          chatbotWidget.click();
                          // Wait for the chatbot to open and then set the message
                          setTimeout(() => {
                            // Find the chatbot input and set its value
                            const chatbotInput = document.querySelector(
                              ".fixed.bottom-6.right-6 input",
                            ) as HTMLInputElement;
                            if (chatbotInput) {
                              // Set the value and dispatch an input event
                              chatbotInput.value = messageToSend;
                              chatbotInput.dispatchEvent(
                                new Event("input", { bubbles: true }),
                              );
                              // Find and click the send button
                              const sendButton = document.querySelector(
                                '.fixed.bottom-6.right-6 button[size="icon"]',
                              ) as HTMLButtonElement;
                              if (sendButton) {
                                setTimeout(() => sendButton.click(), 100);
                              }
                            }
                          }, 300);
                        }
                      } else {
                        const chatbotWidget = document.getElementById(
                          "dashboard-chatbot-widget-button",
                        );
                        if (chatbotWidget) {
                          chatbotWidget.click();
                        }
                      }
                    }}
                    aria-label="Send message to AI assistant"
                  >
                    <ArrowRight className="h-4 w-4" />
                    <span className="sr-only">
                      Send message to AI assistant
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <Button
                className="bg-[#0A3D62] hover:bg-[#0A3D62]/80 text-white rounded-md px-6 py-2"
                onClick={() => {
                  window.location.href = "/waitlist";
                }}
              >
                Join Waitlist
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="space-y-1">
                <Button
                  variant={activeTab === "transactions" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleTabChange("transactions")}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Transactions
                </Button>
                <Button
                  variant={activeTab === "budgets" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleTabChange("budgets")}
                >
                  <PiggyBank className="mr-2 h-4 w-4" />
                  Budgets
                </Button>
                <Button
                  variant={activeTab === "insights" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleTabChange("insights")}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Insights
                </Button>
                <Button
                  variant={activeTab === "profile" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleTabChange("profile")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button
                  variant={activeTab === "settings" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleTabChange("settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-4 mt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setIsAddTransactionOpen(true)}
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Add Transaction
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Payment
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Home className="mr-2 h-4 w-4" />
                  View Properties
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsContent value="transactions" className="mt-0">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-[#0A3D62]">
                      Recent Transactions
                    </h2>
                    <Button
                      onClick={() => setIsAddTransactionOpen(true)}
                      className="bg-[#0A3D62] hover:bg-[#0A3D62]/80"
                    >
                      Add Transaction
                    </Button>
                  </div>

                  {/* Transactions List */}
                  <div className="space-y-4">
                    {/* Sample transactions - replace with actual data */}
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-full mr-4">
                            <CreditCard className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">Grocery Shopping</p>
                            <p className="text-sm text-gray-500">
                              June 15, 2023
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-red-500">-$78.52</p>
                          <p className="text-xs text-gray-500">
                            Whole Foods Market
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="budgets" className="mt-0">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-[#0A3D62] mb-6">
                    Budget Tracking
                  </h2>
                  <GoalSection />
                </div>
              </TabsContent>

              <TabsContent value="insights" className="mt-0">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-[#0A3D62] mb-6">
                    Financial Insights
                  </h2>
                  <p>Your financial insights and analytics will appear here.</p>
                </div>
              </TabsContent>

              <TabsContent value="profile" className="mt-0">
                <ProfilePage />
              </TabsContent>

              <TabsContent value="settings" className="mt-0">
                <SettingsPage />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Add Transaction Dialog */}
      <AddTransactionDialog
        isOpen={isAddTransactionOpen}
        onClose={() => setIsAddTransactionOpen(false)}
      />

      {/* Chatbot Widget */}
      <DashboardChatbotWidget onNavigate={handleTabChange} />
    </div>
  );
};

export default TrackerDashboard;
