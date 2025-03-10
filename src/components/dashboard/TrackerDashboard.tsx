import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  BarChart3,
  PieChart,
  LineChart,
  Plus,
  ArrowRight,
  Download,
  Filter,
  Search,
  MessageSquare,
  User,
  LogOut,
  Bell,
  Settings,
  Send,
  Target,
  Calendar,
} from "lucide-react";
import AddTransactionDialog from "./AddTransactionDialog";
import GoalSection from "./GoalSection";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const TrackerDashboard = () => {
  const [activeTab, setActiveTab] = useState("insights");
  const [viewMode, setViewMode] = useState("list");
  const [filterType, setFilterType] = useState("single");
  const [transactionFilterType, setTransactionFilterType] = useState("single");
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [newBudgetCategory, setNewBudgetCategory] = useState("");
  const [newBudgetAmount, setNewBudgetAmount] = useState("");
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState("");
  const [customCategoryColor, setCustomCategoryColor] = useState("#008080");

  // State for transaction filtering
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const currentMonth = new Date()
    .toLocaleString("default", { month: "long" })
    .toLowerCase();
  const currentYear = new Date().getFullYear().toString();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [startMonth, setStartMonth] = useState(currentMonth);
  const [startYear, setStartYear] = useState(currentYear);
  const [endMonth, setEndMonth] = useState(currentMonth);
  const [endYear, setEndYear] = useState(currentYear);
  const [budgetMonth, setBudgetMonth] = useState(currentMonth);
  const [budgetYear, setBudgetYear] = useState(currentYear);
  const [budgetFilterType, setBudgetFilterType] = useState("single");
  const [budgetStartMonth, setBudgetStartMonth] = useState(currentMonth);
  const [budgetStartYear, setBudgetStartYear] = useState(currentYear);
  const [budgetEndMonth, setBudgetEndMonth] = useState(currentMonth);
  const [budgetEndYear, setBudgetEndYear] = useState(currentYear);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [categories, setCategories] = useState([
    { name: "Food", spent: 8500, budget: 10000, color: "#008080" },
    { name: "Transportation", spent: 3200, budget: 5000, color: "#D6A3A1" },
    { name: "Entertainment", spent: 2800, budget: 3000, color: "#FF6F61" },
    { name: "Utilities", spent: 4500, budget: 6000, color: "#800020" },
    { name: "Shopping", spent: 6200, budget: 5000, color: "#CC5500" },
    { name: "House", spent: 7500, budget: 8000, color: "#3D8D7F" },
  ]);

  // Helper functions for calendar view
  const getMonthNumber = (monthName: string) => {
    const monthMap: { [key: string]: number } = {
      january: 1,
      february: 2,
      march: 3,
      april: 4,
      may: 5,
      june: 6,
      july: 7,
      august: 8,
      september: 9,
      october: 10,
      november: 11,
      december: 12,
    };
    return monthMap[monthName.toLowerCase()];
  };

  const addMonths = (date: Date, months: number) => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  };

  const getMonthDifference = (
    startMonth: string,
    startYear: string,
    endMonth: string,
    endYear: string,
  ) => {
    const start = new Date(
      parseInt(startYear),
      getMonthNumber(startMonth) - 1,
      1,
    );
    const end = new Date(parseInt(endYear), getMonthNumber(endMonth) - 1, 1);
    return (
      (end.getFullYear() - start.getFullYear()) * 12 +
      end.getMonth() -
      start.getMonth()
    );
  };

  // Load mock transactions on component mount
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        // First try to get transactions from Supabase
        const { data, error } = await supabase
          .from("transactions")
          .select("*")
          .order("date", { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setAllTransactions(data);
          setFilteredTransactions(data.slice(0, 10)); // Show most recent 10 by default
        } else {
          // If no data in Supabase, use mock data
          const { generateMockTransactions } = await import(
            "../../lib/mockData"
          );
          const mockData = generateMockTransactions();
          setAllTransactions(mockData);
          setFilteredTransactions(mockData.slice(0, 10)); // Show most recent 10 by default

          // Optionally save mock data to Supabase
          // This would be removed in production
          for (const transaction of mockData.slice(0, 50)) {
            // Only insert first 50 to avoid rate limits
            await supabase.from("transactions").insert([transaction]);
          }
        }
      } catch (error) {
        console.error("Error loading transactions:", error);
        // Fallback to local mock data if Supabase fails
        const { generateMockTransactions } = await import("../../lib/mockData");
        const mockData = generateMockTransactions();
        setAllTransactions(mockData);
        setFilteredTransactions(mockData.slice(0, 10));
      }
    };

    loadTransactions();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Function to apply filters
  const applyFilters = () => {
    let filtered = [...allTransactions];

    // Filter by category if not 'all'
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (t) =>
          t.category?.toLowerCase() === selectedCategory.toLowerCase() ||
          t.subcategory?.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }

    // Apply date filters
    if (transactionFilterType === "single") {
      // Convert month name to number
      const monthMap: { [key: string]: number } = {
        january: 1,
        february: 2,
        march: 3,
        april: 4,
        may: 5,
        june: 6,
        july: 7,
        august: 8,
        september: 9,
        october: 10,
        november: 11,
        december: 12,
      };

      const monthNum = monthMap[selectedMonth];
      const yearNum = parseInt(selectedYear);

      filtered = filtered.filter((t) => {
        const date = new Date(t.date);
        return (
          date.getMonth() + 1 === monthNum && date.getFullYear() === yearNum
        );
      });
    } else if (transactionFilterType === "range") {
      // Convert month names to numbers for range
      const monthMap: { [key: string]: number } = {
        january: 1,
        february: 2,
        march: 3,
        april: 4,
        may: 5,
        june: 6,
        july: 7,
        august: 8,
        september: 9,
        october: 10,
        november: 11,
        december: 12,
      };

      const startMonthNum = monthMap[startMonth];
      const startYearNum = parseInt(startYear);
      const endMonthNum = monthMap[endMonth];
      const endYearNum = parseInt(endYear);

      const startDate = new Date(startYearNum, startMonthNum - 1, 1);
      const endDate = new Date(endYearNum, endMonthNum, 0); // Last day of end month

      filtered = filtered.filter((t) => {
        const date = new Date(t.date);
        return date >= startDate && date <= endDate;
      });
    }

    // Sort by date (newest first)
    filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    setFilteredTransactions(filtered);
  };

  // Function to save custom category to Supabase
  const saveCustomCategory = async (name: string, color: string) => {
    try {
      const { data, error } = await supabase.from("categories").insert([
        { name, color, user_id: "current-user-id" }, // Replace with actual user ID from auth
      ]);

      if (error) throw error;
      console.log("Category saved successfully:", data);

      // Add the new category to the local categories array
      const newCategory = {
        name: name,
        spent: 0,
        budget: parseFloat(newBudgetAmount) || 0,
        color: color,
      };

      // Update categories state
      setCategories([...categories, newCategory]);
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Chatbot widget removed */}
      {/* Top Navigation Bar */}
      <header className="bg-[#FAF9F6] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <img
                src="https://raw.githubusercontent.com/paoloparaiso/Fintr/c273332c59168c59539d499b2ee119186af8f88a/Fintr_Logo.png"
                alt="Fintr Logo"
                className="h-8 w-auto"
              />
            </div>

            {/* Chatbot in the center */}
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-md">
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
                >
                  <input
                    type="text"
                    placeholder="Ask Fintr anything..."
                    className="bg-transparent border-none outline-none flex-grow text-sm text-gray-700"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    className="text-[#0A3D62] hover:text-[#0A3D62]/80 bg-gray-100 rounded-full p-1.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* User profile and notifications */}
            <div className="flex items-center space-x-4">
              <button className="text-[#0A3D62] hover:text-[#0A3D62]/80 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center text-[#0A3D62] hover:text-[#0A3D62]/80">
                    <div className="bg-[#0A3D62] text-white rounded-full p-1 mr-2">
                      <User className="h-5 w-5" />
                    </div>
                    <span className="font-medium">John Doe</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="h-4 w-4 mr-2" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="h-4 w-4 mr-2" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600"
                    onClick={() => (window.location.href = "/")}
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#0A3D62]">
                Dashboard
              </h1>
              <p className="text-[#0A3D62]/70">
                Track, analyze, and optimize your finances
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <AddTransactionDialog />
              <Button
                variant="outline"
                className="border-[#0A3D62] text-[#0A3D62]"
              >
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
            </div>
          </div>

          <Tabs
            defaultValue="insights"
            className="w-full"
            onValueChange={setActiveTab}
            value={activeTab}
          >
            <TabsList className="grid grid-cols-4 md:w-[800px] mb-8">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="budgets">Budgets</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>All Transactions</CardTitle>
                    <CardDescription>
                      Manage and filter your transaction history
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-gray-100 rounded-lg p-1 flex">
                      <button
                        onClick={() => setViewMode("list")}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${viewMode === "list" ? "bg-[#0A3D62] text-white" : "text-[#0A3D62]"}`}
                      >
                        List
                      </button>
                      <button
                        onClick={() => setViewMode("calendar")}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${viewMode === "calendar" ? "bg-[#0A3D62] text-white" : "text-[#0A3D62]"}`}
                      >
                        Calendar
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Transaction Filters</CardTitle>
                      <CardDescription>
                        Customize your transaction view
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="space-y-2 md:w-1/4">
                          <Label>View Type</Label>
                          <Select
                            defaultValue="single"
                            onValueChange={(value) =>
                              setTransactionFilterType(value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select view type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="single">
                                Single Month
                              </SelectItem>
                              <SelectItem value="range">Month Range</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {transactionFilterType === "single" ? (
                          <>
                            <div className="space-y-2 md:w-1/4">
                              <Label>Month</Label>
                              <Select
                                defaultValue={selectedMonth}
                                value={selectedMonth}
                                onValueChange={setSelectedMonth}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select month" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="january">
                                    January
                                  </SelectItem>
                                  <SelectItem value="february">
                                    February
                                  </SelectItem>
                                  <SelectItem value="march">March</SelectItem>
                                  <SelectItem value="april">April</SelectItem>
                                  <SelectItem value="may">May</SelectItem>
                                  <SelectItem value="june">June</SelectItem>
                                  <SelectItem value="july">July</SelectItem>
                                  <SelectItem value="august">August</SelectItem>
                                  <SelectItem value="september">
                                    September
                                  </SelectItem>
                                  <SelectItem value="october">
                                    October
                                  </SelectItem>
                                  <SelectItem value="november">
                                    November
                                  </SelectItem>
                                  <SelectItem value="december">
                                    December
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2 md:w-1/4">
                              <Label>Year</Label>
                              <Select
                                defaultValue={selectedYear}
                                value={selectedYear}
                                onValueChange={setSelectedYear}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="2025">2025</SelectItem>
                                  <SelectItem value="2024">2024</SelectItem>
                                  <SelectItem value="2023">2023</SelectItem>
                                  <SelectItem value="2022">2022</SelectItem>
                                  <SelectItem value="2021">2021</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="space-y-2 md:w-1/4">
                              <Label>Start Month & Year</Label>
                              <div className="flex space-x-2">
                                <Select
                                  defaultValue={startMonth}
                                  value={startMonth}
                                  onValueChange={setStartMonth}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Start Month" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="january">
                                      January
                                    </SelectItem>
                                    <SelectItem value="february">
                                      February
                                    </SelectItem>
                                    <SelectItem value="march">March</SelectItem>
                                    <SelectItem value="april">April</SelectItem>
                                    <SelectItem value="may">May</SelectItem>
                                    <SelectItem value="june">June</SelectItem>
                                    <SelectItem value="july">July</SelectItem>
                                    <SelectItem value="august">
                                      August
                                    </SelectItem>
                                    <SelectItem value="september">
                                      September
                                    </SelectItem>
                                    <SelectItem value="october">
                                      October
                                    </SelectItem>
                                    <SelectItem value="november">
                                      November
                                    </SelectItem>
                                    <SelectItem value="december">
                                      December
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <Select
                                  defaultValue={startYear}
                                  value={startYear}
                                  onValueChange={setStartYear}
                                >
                                  <SelectTrigger className="w-24">
                                    <SelectValue placeholder="Year" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="2025">2025</SelectItem>
                                    <SelectItem value="2024">2024</SelectItem>
                                    <SelectItem value="2023">2023</SelectItem>
                                    <SelectItem value="2022">2022</SelectItem>
                                    <SelectItem value="2021">2021</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="space-y-2 md:w-1/4">
                              <Label>End Month & Year</Label>
                              <div className="flex space-x-2">
                                <Select
                                  defaultValue={endMonth}
                                  value={endMonth}
                                  onValueChange={setEndMonth}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="End Month" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="january">
                                      January
                                    </SelectItem>
                                    <SelectItem value="february">
                                      February
                                    </SelectItem>
                                    <SelectItem value="march">March</SelectItem>
                                    <SelectItem value="april">April</SelectItem>
                                    <SelectItem value="may">May</SelectItem>
                                    <SelectItem value="june">June</SelectItem>
                                    <SelectItem value="july">July</SelectItem>
                                    <SelectItem value="august">
                                      August
                                    </SelectItem>
                                    <SelectItem value="september">
                                      September
                                    </SelectItem>
                                    <SelectItem value="october">
                                      October
                                    </SelectItem>
                                    <SelectItem value="november">
                                      November
                                    </SelectItem>
                                    <SelectItem value="december">
                                      December
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <Select
                                  defaultValue={endYear}
                                  value={endYear}
                                  onValueChange={setEndYear}
                                >
                                  <SelectTrigger className="w-24">
                                    <SelectValue placeholder="Year" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="2025">2025</SelectItem>
                                    <SelectItem value="2024">2024</SelectItem>
                                    <SelectItem value="2023">2023</SelectItem>
                                    <SelectItem value="2022">2022</SelectItem>
                                    <SelectItem value="2021">2021</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </>
                        )}

                        <div className="space-y-2 md:w-1/4">
                          <Label>Category</Label>
                          <Select
                            defaultValue="all"
                            value={selectedCategory}
                            onValueChange={setSelectedCategory}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">
                                All Categories
                              </SelectItem>
                              <SelectItem value="food">Food</SelectItem>
                              <SelectItem value="transportation">
                                Transportation
                              </SelectItem>
                              <SelectItem value="utilities">
                                Utilities
                              </SelectItem>
                              <SelectItem value="entertainment">
                                Entertainment
                              </SelectItem>
                              <SelectItem value="shopping">Shopping</SelectItem>
                              <SelectItem value="house">House</SelectItem>
                              <SelectItem value="income">Income</SelectItem>
                              <SelectItem value="expense">Expense</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="md:self-end">
                          <Button
                            className="bg-[#0A3D62] hover:bg-[#0A3D62]/80 w-full"
                            onClick={applyFilters}
                          >
                            Apply Filters
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-grow">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search transactions..."
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {viewMode === "list" ? (
                    <div className="space-y-4">
                      {filteredTransactions.length > 0 ? (
                        (() => {
                          // Group transactions by month if in range mode
                          if (transactionFilterType === "range") {
                            const groupedTransactions = {};

                            filteredTransactions.forEach((transaction) => {
                              const date = new Date(transaction.date);
                              const monthYear = `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`;

                              if (!groupedTransactions[monthYear]) {
                                groupedTransactions[monthYear] = [];
                              }

                              groupedTransactions[monthYear].push(transaction);
                            });

                            return Object.entries(groupedTransactions).map(
                              ([monthYear, transactions]) => (
                                <div key={monthYear} className="space-y-2">
                                  <h3 className="font-bold text-[#0A3D62] bg-[#f9f7f5] p-2 rounded-md">
                                    {monthYear}
                                  </h3>
                                  {transactions.map((transaction) => (
                                    <div
                                      key={transaction.id}
                                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                      <div>
                                        <p className="font-medium text-[#0A3D62]">
                                          {transaction.description}
                                        </p>
                                        <p className="text-sm text-[#0A3D62]/70">
                                          {new Date(
                                            transaction.date,
                                          ).toLocaleDateString()}{" "}
                                          •{" "}
                                          {transaction.subcategory ||
                                            transaction.category}
                                        </p>
                                      </div>
                                      <span
                                        className={`font-medium ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}
                                      >
                                        {transaction.amount > 0 ? "+" : ""}
                                        {formatCurrency(transaction.amount)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ),
                            );
                          } else {
                            // Single month view - no grouping needed
                            return filteredTransactions.map((transaction) => (
                              <div
                                key={transaction.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                <div>
                                  <p className="font-medium text-[#0A3D62]">
                                    {transaction.description}
                                  </p>
                                  <p className="text-sm text-[#0A3D62]/70">
                                    {new Date(
                                      transaction.date,
                                    ).toLocaleDateString()}{" "}
                                    •{" "}
                                    {transaction.subcategory ||
                                      transaction.category}
                                  </p>
                                </div>
                                <span
                                  className={`font-medium ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}
                                >
                                  {transaction.amount > 0 ? "+" : ""}
                                  {formatCurrency(transaction.amount)}
                                </span>
                              </div>
                            ));
                          }
                        })()
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No transactions found matching your filters.
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mt-4">
                      <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                          (day) => (
                            <div
                              key={day}
                              className="text-sm font-medium text-[#0A3D62]"
                            >
                              {day}
                            </div>
                          ),
                        )}
                      </div>
                      {transactionFilterType === "single" ? (
                        <div>
                          <h3 className="font-bold text-[#0A3D62] bg-[#f9f7f5] p-2 rounded-md mb-2 text-center">
                            {selectedMonth.charAt(0).toUpperCase() +
                              selectedMonth.slice(1)}{" "}
                            {selectedYear}
                          </h3>
                          <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: 35 }).map((_, index) => {
                              const day = index + 1;
                              const hasTransaction = filteredTransactions.some(
                                (t) => {
                                  const tDate = new Date(t.date);
                                  return tDate.getDate() === day;
                                },
                              );

                              const dayTransactions =
                                filteredTransactions.filter((t) => {
                                  const tDate = new Date(t.date);
                                  return tDate.getDate() === day;
                                });

                              const income = dayTransactions
                                .filter((t) => t.amount > 0)
                                .reduce((sum, t) => sum + t.amount, 0);

                              const expense = dayTransactions
                                .filter((t) => t.amount < 0)
                                .reduce((sum, t) => sum + t.amount, 0);

                              return (
                                <div
                                  key={index}
                                  className={`p-2 rounded-md border ${hasTransaction ? "border-[#0A3D62]/20 bg-[#0A3D62]/5" : "border-gray-200"} min-h-[80px] text-center`}
                                >
                                  <div className="font-medium text-[#0A3D62]">
                                    {day}
                                  </div>
                                  {hasTransaction && (
                                    <div className="mt-1 text-xs">
                                      {income > 0 && (
                                        <div className="text-green-600">
                                          +{formatCurrency(income)}
                                        </div>
                                      )}
                                      {expense < 0 && (
                                        <div className="text-red-600">
                                          {formatCurrency(expense)}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        // Month range view with separate calendars per month
                        <div className="space-y-8">
                          {Array.from({
                            length:
                              getMonthDifference(
                                startMonth,
                                startYear,
                                endMonth,
                                endYear,
                              ) + 1,
                          }).map((_, monthIndex) => {
                            // Calculate the current month and year in the range
                            const currentDate = addMonths(
                              new Date(
                                parseInt(startYear),
                                getMonthNumber(startMonth) - 1,
                                1,
                              ),
                              monthIndex,
                            );
                            const currentMonthName = currentDate.toLocaleString(
                              "default",
                              { month: "long" },
                            );
                            const currentYear = currentDate
                              .getFullYear()
                              .toString();

                            return (
                              <div
                                key={`${currentMonthName}-${currentYear}`}
                                className="mb-6"
                              >
                                <h3 className="font-bold text-[#0A3D62] bg-[#f9f7f5] p-2 rounded-md mb-2 text-center">
                                  {currentMonthName} {currentYear}
                                </h3>
                                <div className="grid grid-cols-7 gap-1">
                                  {Array.from({ length: 35 }).map(
                                    (_, dayIndex) => {
                                      const day = dayIndex + 1;

                                      const hasTransaction =
                                        filteredTransactions.some((t) => {
                                          const tDate = new Date(t.date);
                                          return (
                                            tDate.getDate() === day &&
                                            tDate.getMonth() ===
                                              currentDate.getMonth() &&
                                            tDate.getFullYear() ===
                                              currentDate.getFullYear()
                                          );
                                        });

                                      const dayTransactions =
                                        filteredTransactions.filter((t) => {
                                          const tDate = new Date(t.date);
                                          return (
                                            tDate.getDate() === day &&
                                            tDate.getMonth() ===
                                              currentDate.getMonth() &&
                                            tDate.getFullYear() ===
                                              currentDate.getFullYear()
                                          );
                                        });

                                      const income = dayTransactions
                                        .filter((t) => t.amount > 0)
                                        .reduce((sum, t) => sum + t.amount, 0);

                                      const expense = dayTransactions
                                        .filter((t) => t.amount < 0)
                                        .reduce((sum, t) => sum + t.amount, 0);

                                      return (
                                        <div
                                          key={`${currentMonthName}-${currentYear}-${day}`}
                                          className={`p-2 rounded-md border ${hasTransaction ? "border-[#0A3D62]/20 bg-[#0A3D62]/5" : "border-gray-200"} min-h-[80px] text-center`}
                                        >
                                          <div className="font-medium text-[#0A3D62]">
                                            {day}
                                          </div>
                                          {hasTransaction && (
                                            <div className="mt-1 text-xs">
                                              {income > 0 && (
                                                <div className="text-green-600">
                                                  +{formatCurrency(income)}
                                                </div>
                                              )}
                                              {expense < 0 && (
                                                <div className="text-red-600">
                                                  {formatCurrency(expense)}
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    },
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Goals Tab */}
            <TabsContent value="goals" className="space-y-6">
              <GoalSection formatCurrency={formatCurrency} />
            </TabsContent>

            {/* Budgets Tab */}
            <TabsContent value="budgets" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Monthly Budgets</CardTitle>
                    <CardDescription>
                      Track your spending against budget limits
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      className="bg-[#0A3D62] hover:bg-[#0A3D62]/80"
                      onClick={() => setShowBudgetForm(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Create Budget
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Budget Summary */}
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Budget Summary</CardTitle>
                      <CardDescription>
                        Overview of your budget status
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-[#f9f7f5] p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-[#0A3D62]/70 mb-1">
                            Total Budget
                          </h4>
                          <div className="text-2xl font-bold text-[#0A3D62]">
                            {formatCurrency(
                              categories.reduce(
                                (sum, cat) => sum + cat.budget,
                                0,
                              ),
                            )}
                          </div>
                        </div>
                        <div className="bg-[#f9f7f5] p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-[#0A3D62]/70 mb-1">
                            Total Spent
                          </h4>
                          <div className="text-2xl font-bold text-[#0A3D62]">
                            {formatCurrency(
                              categories.reduce(
                                (sum, cat) => sum + cat.spent,
                                0,
                              ),
                            )}
                          </div>
                        </div>
                        <div className="bg-[#f9f7f5] p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-[#0A3D62]/70 mb-1">
                            Remaining
                          </h4>
                          <div className="text-2xl font-bold text-[#0A3D62]">
                            {formatCurrency(
                              categories.reduce(
                                (sum, cat) => sum + (cat.budget - cat.spent),
                                0,
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Budget Filters */}
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Budget Filters</CardTitle>
                      <CardDescription>
                        Customize your budget view
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="space-y-2 md:w-1/4">
                          <Label>View Type</Label>
                          <Select
                            defaultValue="single"
                            value={budgetFilterType}
                            onValueChange={(value) =>
                              setBudgetFilterType(value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select view type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="single">
                                Single Month
                              </SelectItem>
                              <SelectItem value="range">Month Range</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {budgetFilterType === "single" ? (
                          <>
                            <div className="space-y-2 md:w-1/4">
                              <Label>Month</Label>
                              <Select
                                defaultValue={budgetMonth}
                                value={budgetMonth}
                                onValueChange={setBudgetMonth}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select month" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="january">
                                    January
                                  </SelectItem>
                                  <SelectItem value="february">
                                    February
                                  </SelectItem>
                                  <SelectItem value="march">March</SelectItem>
                                  <SelectItem value="april">April</SelectItem>
                                  <SelectItem value="may">May</SelectItem>
                                  <SelectItem value="june">June</SelectItem>
                                  <SelectItem value="july">July</SelectItem>
                                  <SelectItem value="august">August</SelectItem>
                                  <SelectItem value="september">
                                    September
                                  </SelectItem>
                                  <SelectItem value="october">
                                    October
                                  </SelectItem>
                                  <SelectItem value="november">
                                    November
                                  </SelectItem>
                                  <SelectItem value="december">
                                    December
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2 md:w-1/4">
                              <Label>Year</Label>
                              <Select
                                defaultValue={budgetYear}
                                value={budgetYear}
                                onValueChange={setBudgetYear}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="2025">2025</SelectItem>
                                  <SelectItem value="2024">2024</SelectItem>
                                  <SelectItem value="2023">2023</SelectItem>
                                  <SelectItem value="2022">2022</SelectItem>
                                  <SelectItem value="2021">2021</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="space-y-2 md:w-1/4">
                              <Label>Start Month & Year</Label>
                              <div className="flex space-x-2">
                                <Select
                                  defaultValue={budgetStartMonth}
                                  value={budgetStartMonth}
                                  onValueChange={setBudgetStartMonth}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Start Month" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="january">
                                      January
                                    </SelectItem>
                                    <SelectItem value="february">
                                      February
                                    </SelectItem>
                                    <SelectItem value="march">March</SelectItem>
                                    <SelectItem value="april">April</SelectItem>
                                    <SelectItem value="may">May</SelectItem>
                                    <SelectItem value="june">June</SelectItem>
                                    <SelectItem value="july">July</SelectItem>
                                    <SelectItem value="august">
                                      August
                                    </SelectItem>
                                    <SelectItem value="september">
                                      September
                                    </SelectItem>
                                    <SelectItem value="october">
                                      October
                                    </SelectItem>
                                    <SelectItem value="november">
                                      November
                                    </SelectItem>
                                    <SelectItem value="december">
                                      December
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <Select
                                  defaultValue={budgetStartYear}
                                  value={budgetStartYear}
                                  onValueChange={setBudgetStartYear}
                                >
                                  <SelectTrigger className="w-24">
                                    <SelectValue placeholder="Year" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="2025">2025</SelectItem>
                                    <SelectItem value="2024">2024</SelectItem>
                                    <SelectItem value="2023">2023</SelectItem>
                                    <SelectItem value="2022">2022</SelectItem>
                                    <SelectItem value="2021">2021</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="space-y-2 md:w-1/4">
                              <Label>End Month & Year</Label>
                              <div className="flex space-x-2">
                                <Select
                                  defaultValue={budgetEndMonth}
                                  value={budgetEndMonth}
                                  onValueChange={setBudgetEndMonth}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="End Month" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="january">
                                      January
                                    </SelectItem>
                                    <SelectItem value="february">
                                      February
                                    </SelectItem>
                                    <SelectItem value="march">March</SelectItem>
                                    <SelectItem value="april">April</SelectItem>
                                    <SelectItem value="may">May</SelectItem>
                                    <SelectItem value="june">June</SelectItem>
                                    <SelectItem value="july">July</SelectItem>
                                    <SelectItem value="august">
                                      August
                                    </SelectItem>
                                    <SelectItem value="september">
                                      September
                                    </SelectItem>
                                    <SelectItem value="october">
                                      October
                                    </SelectItem>
                                    <SelectItem value="november">
                                      November
                                    </SelectItem>
                                    <SelectItem value="december">
                                      December
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <Select
                                  defaultValue={budgetEndYear}
                                  value={budgetEndYear}
                                  onValueChange={setBudgetEndYear}
                                >
                                  <SelectTrigger className="w-24">
                                    <SelectValue placeholder="Year" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="2025">2025</SelectItem>
                                    <SelectItem value="2024">2024</SelectItem>
                                    <SelectItem value="2023">2023</SelectItem>
                                    <SelectItem value="2022">2022</SelectItem>
                                    <SelectItem value="2021">2021</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </>
                        )}

                        <div className="md:self-end">
                          <Button className="bg-[#0A3D62] hover:bg-[#0A3D62]/80 w-full">
                            Apply Filters
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {showBudgetForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-xl font-bold text-[#0A3D62] mb-4">
                          Create New Budget
                        </h3>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="budget-category">Category</Label>
                            <Select
                              value={newBudgetCategory}
                              onValueChange={(value) => {
                                setNewBudgetCategory(value);
                                if (value === "custom") {
                                  setShowCustomCategoryInput(true);
                                } else {
                                  setShowCustomCategoryInput(false);
                                }
                              }}
                            >
                              <SelectTrigger id="budget-category">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="food">Food</SelectItem>
                                <SelectItem value="transportation">
                                  Transportation
                                </SelectItem>
                                <SelectItem value="utilities">
                                  Utilities
                                </SelectItem>
                                <SelectItem value="entertainment">
                                  Entertainment
                                </SelectItem>
                                <SelectItem value="shopping">
                                  Shopping
                                </SelectItem>
                                <SelectItem value="house">House</SelectItem>
                                <SelectItem value="health">Health</SelectItem>
                                <SelectItem value="education">
                                  Education
                                </SelectItem>
                                <SelectItem value="custom">
                                  Add Custom Category
                                </SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {showCustomCategoryInput && (
                            <div className="space-y-2 mt-4">
                              <Label htmlFor="custom-category">
                                Custom Category Name
                              </Label>
                              <Input
                                id="custom-category"
                                placeholder="Enter new category name"
                                value={customCategoryName}
                                onChange={(e) =>
                                  setCustomCategoryName(e.target.value)
                                }
                              />
                              <div className="space-y-2 mt-4">
                                <Label htmlFor="custom-category-color">
                                  Category Color
                                </Label>
                                <div className="flex space-x-2">
                                  {[
                                    "#008080",
                                    "#FF6F61",
                                    "#D6A3A1",
                                    "#800020",
                                    "#CC5500",
                                    "#3D8D7F",
                                    "#5EB99D",
                                  ].map((color) => (
                                    <div
                                      key={color}
                                      className={`w-8 h-8 rounded-full cursor-pointer ${customCategoryColor === color ? "ring-2 ring-[#0A3D62]" : ""}`}
                                      style={{ backgroundColor: color }}
                                      onClick={() =>
                                        setCustomCategoryColor(color)
                                      }
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="space-y-2">
                            <Label htmlFor="budget-amount">Budget Amount</Label>
                            <Input
                              id="budget-amount"
                              type="number"
                              placeholder="0.00"
                              value={newBudgetAmount}
                              onChange={(e) =>
                                setNewBudgetAmount(e.target.value)
                              }
                            />
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2 mt-6">
                          <Button
                            variant="outline"
                            onClick={() => setShowBudgetForm(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="bg-[#0A3D62] hover:bg-[#0A3D62]/80"
                            onClick={() => {
                              // Add budget logic
                              const saveBudget = async () => {
                                try {
                                  let categoryId;

                                  // If custom category, save it first
                                  if (
                                    newBudgetCategory === "custom" &&
                                    customCategoryName
                                  ) {
                                    const {
                                      data: categoryData,
                                      error: categoryError,
                                    } = await supabase
                                      .from("categories")
                                      .insert([
                                        {
                                          name: customCategoryName,
                                          color: customCategoryColor,
                                          user_id: "current-user-id", // Replace with actual user ID
                                        },
                                      ])
                                      .select();

                                    if (categoryError) throw categoryError;
                                    categoryId = categoryData[0].id;
                                  } else {
                                    categoryId = newBudgetCategory;
                                  }

                                  // Save the budget
                                  const {
                                    data: budgetData,
                                    error: budgetError,
                                  } = await supabase.from("budgets").insert([
                                    {
                                      user_id: "current-user-id", // Replace with actual user ID
                                      category_id: categoryId,
                                      amount: parseFloat(newBudgetAmount),
                                      period: "monthly",
                                      start_date: new Date()
                                        .toISOString()
                                        .split("T")[0],
                                      end_date: null,
                                    },
                                  ]);

                                  if (budgetError) throw budgetError;

                                  // Update local state with new budget
                                  const newBudget = {
                                    name:
                                      customCategoryName || newBudgetCategory,
                                    spent: 0,
                                    budget: parseFloat(newBudgetAmount),
                                    color: customCategoryColor || "#008080",
                                  };

                                  // Update categories state
                                  setCategories([...categories, newBudget]);

                                  console.log("Budget saved successfully");
                                } catch (error) {
                                  console.error("Error saving budget:", error);
                                }
                              };

                              if (editingBudgetIndex !== null) {
                                // Update existing budget
                                const updatedCategories = [...categories];
                                updatedCategories[editingBudgetIndex] = {
                                  ...updatedCategories[editingBudgetIndex],
                                  name: customCategoryName || newBudgetCategory,
                                  budget: parseFloat(newBudgetAmount),
                                  color:
                                    customCategoryColor ||
                                    updatedCategories[editingBudgetIndex].color,
                                };
                                setCategories(updatedCategories);
                                setEditingBudgetIndex(null);
                              } else {
                                // Check if category already exists
                                const existingCategoryIndex =
                                  categories.findIndex(
                                    (cat) =>
                                      cat.name.toLowerCase() ===
                                      (
                                        customCategoryName || newBudgetCategory
                                      ).toLowerCase(),
                                  );

                                if (existingCategoryIndex >= 0) {
                                  // Update existing category
                                  const updatedCategories = [...categories];
                                  updatedCategories[existingCategoryIndex] = {
                                    ...updatedCategories[existingCategoryIndex],
                                    budget: parseFloat(newBudgetAmount),
                                  };
                                  setCategories(updatedCategories);
                                } else {
                                  // Create new budget
                                  saveBudget();
                                }
                              }

                              setShowBudgetForm(false);
                              setNewBudgetCategory("");
                              setNewBudgetAmount("");
                              setShowCustomCategoryInput(false);
                              setCustomCategoryName("");
                            }}
                          >
                            {editingBudgetIndex !== null ? "Update" : "Create"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    {categories.map((category, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-[#0A3D62]">
                            {category.name}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <div className="text-sm font-medium">
                              <span
                                className={
                                  category.spent > category.budget
                                    ? "text-red-600"
                                    : "text-[#0A3D62]"
                                }
                              >
                                {formatCurrency(category.spent)}
                              </span>
                              <span className="text-[#0A3D62]/70">
                                {" "}
                                / {formatCurrency(category.budget)}
                              </span>
                            </div>
                            <div className="flex space-x-1">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2 text-[#0A3D62]"
                                onClick={() => {
                                  // Set editing state
                                  setEditingBudgetIndex(index);
                                  setNewBudgetCategory(
                                    category.name.toLowerCase(),
                                  );
                                  setNewBudgetAmount(
                                    category.budget.toString(),
                                  );
                                  setShowBudgetForm(true);
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => {
                                  // Remove category from the list
                                  const updatedCategories = [...categories];
                                  updatedCategories.splice(index, 1);
                                  setCategories(updatedCategories);
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${category.spent > category.budget ? "bg-red-500" : ""}`}
                            style={{
                              width: `${Math.min(100, (category.spent / category.budget) * 100)}%`,
                              backgroundColor:
                                category.spent > category.budget
                                  ? ""
                                  : category.color,
                            }}
                          ></div>
                        </div>
                        <div className="mt-2 text-sm text-[#0A3D62]/70">
                          {category.spent > category.budget
                            ? `${formatCurrency(category.spent - category.budget)} over budget`
                            : `${formatCurrency(category.budget - category.spent)} remaining`}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Insights Tab (with Overview merged in) */}
            <TabsContent value="insights" className="space-y-6">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Insights Filters</CardTitle>
                  <CardDescription>
                    Customize your financial insights view
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="space-y-2 md:w-1/4">
                      <Label>View Type</Label>
                      <Select
                        defaultValue="single"
                        onValueChange={(value) => setFilterType(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select view type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single Month</SelectItem>
                          <SelectItem value="range">Month Range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {filterType === "single" ? (
                      <>
                        <div className="space-y-2 md:w-1/4">
                          <Label>Month</Label>
                          <Select defaultValue={selectedMonth}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select month" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="january">January</SelectItem>
                              <SelectItem value="february">February</SelectItem>
                              <SelectItem value="march">March</SelectItem>
                              <SelectItem value="april">April</SelectItem>
                              <SelectItem value="may">May</SelectItem>
                              <SelectItem value="june">June</SelectItem>
                              <SelectItem value="july">July</SelectItem>
                              <SelectItem value="august">August</SelectItem>
                              <SelectItem value="september">
                                September
                              </SelectItem>
                              <SelectItem value="october">October</SelectItem>
                              <SelectItem value="november">November</SelectItem>
                              <SelectItem value="december">December</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2 md:w-1/4">
                          <Label>Year</Label>
                          <Select defaultValue={selectedYear}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2025">2025</SelectItem>
                              <SelectItem value="2024">2024</SelectItem>
                              <SelectItem value="2023">2023</SelectItem>
                              <SelectItem value="2022">2022</SelectItem>
                              <SelectItem value="2021">2021</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2 md:w-1/4">
                          <Label>Start Month & Year</Label>
                          <div className="flex space-x-2">
                            <Select defaultValue={startMonth}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Start Month" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="january">January</SelectItem>
                                <SelectItem value="february">
                                  February
                                </SelectItem>
                                <SelectItem value="march">March</SelectItem>
                                <SelectItem value="april">April</SelectItem>
                                <SelectItem value="may">May</SelectItem>
                                <SelectItem value="june">June</SelectItem>
                                <SelectItem value="july">July</SelectItem>
                                <SelectItem value="august">August</SelectItem>
                                <SelectItem value="september">
                                  September
                                </SelectItem>
                                <SelectItem value="october">October</SelectItem>
                                <SelectItem value="november">
                                  November
                                </SelectItem>
                                <SelectItem value="december">
                                  December
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <Select defaultValue={startYear}>
                              <SelectTrigger className="w-24">
                                <SelectValue placeholder="Year" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="2025">2025</SelectItem>
                                <SelectItem value="2024">2024</SelectItem>
                                <SelectItem value="2023">2023</SelectItem>
                                <SelectItem value="2022">2022</SelectItem>
                                <SelectItem value="2021">2021</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2 md:w-1/4">
                          <Label>End Month & Year</Label>
                          <div className="flex space-x-2">
                            <Select defaultValue={endMonth}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="End Month" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="january">January</SelectItem>
                                <SelectItem value="february">
                                  February
                                </SelectItem>
                                <SelectItem value="march">March</SelectItem>
                                <SelectItem value="april">April</SelectItem>
                                <SelectItem value="may">May</SelectItem>
                                <SelectItem value="june">June</SelectItem>
                                <SelectItem value="july">July</SelectItem>
                                <SelectItem value="august">August</SelectItem>
                                <SelectItem value="september">
                                  September
                                </SelectItem>
                                <SelectItem value="october">October</SelectItem>
                                <SelectItem value="november">
                                  November
                                </SelectItem>
                                <SelectItem value="december">
                                  December
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <Select defaultValue={endYear}>
                              <SelectTrigger className="w-24">
                                <SelectValue placeholder="Year" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="2025">2025</SelectItem>
                                <SelectItem value="2024">2024</SelectItem>
                                <SelectItem value="2023">2023</SelectItem>
                                <SelectItem value="2022">2022</SelectItem>
                                <SelectItem value="2021">2021</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="md:self-end">
                      <Button
                        className="bg-[#0A3D62] hover:bg-[#0A3D62]/80 w-full"
                        onClick={applyFilters}
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Summary Cards from Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-[#0A3D62]/70">
                      Total Balance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-[#0A3D62]">
                      {formatCurrency(42500)}
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                      +5.2% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-[#0A3D62]/70">
                      Total Income
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-[#0A3D62]">
                      {formatCurrency(43000)}
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                      +2.1% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-[#0A3D62]/70">
                      Total Expense
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-[#0A3D62]">
                      {formatCurrency(25200)}
                    </div>
                    <p className="text-xs text-red-600 mt-1">
                      +8.4% from last month
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Income vs. Expenses vs. Loan Pie Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Income vs. Expenses vs. Loan</CardTitle>
                    <CardDescription>Monthly comparison</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-center justify-center">
                      <div className="w-full flex flex-col items-center">
                        {/* Pie Chart */}
                        <div className="relative w-48 h-48 mb-6">
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            {/* Income Slice - 45% */}
                            <path
                              d="M 50 50 L 50 5 A 45 45 0 0 1 95 50 Z"
                              fill="#008080"
                            />
                            {/* Expenses Slice - 35% */}
                            <path
                              d="M 50 50 L 95 50 A 45 45 0 0 1 50 95 Z"
                              fill="#FF6F61"
                            />
                            {/* Loan Slice - 20% */}
                            <path
                              d="M 50 50 L 50 95 A 45 45 0 0 1 5 50 A 45 45 0 0 1 50 5 Z"
                              fill="#D6A3A1"
                            />
                          </svg>
                        </div>

                        {/* Legend */}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-[#008080] rounded-full mr-2"></div>
                            <div className="flex flex-col">
                              <span className="text-xs text-[#0A3D62] font-medium">
                                Income
                              </span>
                              <span className="text-xs text-[#0A3D62]/70">
                                {formatCurrency(43000)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-[#FF6F61] rounded-full mr-2"></div>
                            <div className="flex flex-col">
                              <span className="text-xs text-[#0A3D62] font-medium">
                                Expenses
                              </span>
                              <span className="text-xs text-[#0A3D62]/70">
                                {formatCurrency(25200)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-[#D6A3A1] rounded-full mr-2"></div>
                            <div className="flex flex-col">
                              <span className="text-xs text-[#0A3D62] font-medium">
                                Loan
                              </span>
                              <span className="text-xs text-[#0A3D62]/70">
                                {formatCurrency(12000)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Loan Status Pie Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Loan Status</CardTitle>
                    <CardDescription>Current loan breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-center justify-center">
                      <div className="w-full flex flex-col items-center">
                        {/* Pie Chart */}
                        <div className="relative w-48 h-48 mb-6">
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            {/* Money Borrowed (To Be Paid) - 30% */}
                            <path
                              d="M 50 50 L 50 5 A 45 45 0 0 1 88.5 31.5 Z"
                              fill="#800020"
                            />
                            {/* Money Lent (To Be Paid) - 25% */}
                            <path
                              d="M 50 50 L 88.5 31.5 A 45 45 0 0 1 88.5 68.5 Z"
                              fill="#CC5500"
                            />
                            {/* Borrowed Money Paid - 20% */}
                            <path
                              d="M 50 50 L 88.5 68.5 A 45 45 0 0 1 50 95 Z"
                              fill="#D6EAF8"
                            />
                            {/* Lent Money Paid - 25% */}
                            <path
                              d="M 50 50 L 50 95 A 45 45 0 0 1 11.5 68.5 A 45 45 0 0 1 11.5 31.5 A 45 45 0 0 1 50 5 Z"
                              fill="#D6A3A1"
                            />
                          </svg>
                        </div>

                        {/* Legend */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-[#800020] rounded-full mr-2"></div>
                            <div className="flex flex-col">
                              <span className="text-xs text-[#0A3D62] font-medium">
                                Money Borrowed (To Be Paid)
                              </span>
                              <span className="text-xs text-[#0A3D62]/70">
                                {formatCurrency(15000)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-[#CC5500] rounded-full mr-2"></div>
                            <div className="flex flex-col">
                              <span className="text-xs text-[#0A3D62] font-medium">
                                Money Lent (To Be Paid)
                              </span>
                              <span className="text-xs text-[#0A3D62]/70">
                                {formatCurrency(12500)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-[#D6EAF8] rounded-full mr-2"></div>
                            <div className="flex flex-col">
                              <span className="text-xs text-[#0A3D62] font-medium">
                                Borrowed Money Paid
                              </span>
                              <span className="text-xs text-[#0A3D62]/70">
                                {formatCurrency(10000)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-[#D6A3A1] rounded-full mr-2"></div>
                            <div className="flex flex-col">
                              <span className="text-xs text-[#0A3D62] font-medium">
                                Lent Money Paid
                              </span>
                              <span className="text-xs text-[#0A3D62]/70">
                                {formatCurrency(12500)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Expense Breakdown Chart with Pie Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Expense Breakdown</CardTitle>
                    <CardDescription>
                      Your spending by category this month
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex flex-col items-center justify-center">
                      {/* Mock Pie Chart */}
                      <div className="relative w-48 h-48 mb-6">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          {categories.map((category, index) => {
                            // Calculate the percentage of total spending
                            const totalSpent = categories.reduce(
                              (sum, cat) => sum + cat.spent,
                              0,
                            );
                            const percentage =
                              (category.spent / totalSpent) * 100;

                            // Calculate the SVG parameters for the pie slice
                            let cumulativePercentage = 0;
                            for (let i = 0; i < index; i++) {
                              cumulativePercentage +=
                                (categories[i].spent / totalSpent) * 100;
                            }

                            const startAngle =
                              (cumulativePercentage / 100) * 360;
                            const endAngle =
                              ((cumulativePercentage + percentage) / 100) * 360;

                            // Convert angles to radians and calculate coordinates
                            const startRad =
                              (startAngle - 90) * (Math.PI / 180);
                            const endRad = (endAngle - 90) * (Math.PI / 180);

                            const x1 = 50 + 40 * Math.cos(startRad);
                            const y1 = 50 + 40 * Math.sin(startRad);
                            const x2 = 50 + 40 * Math.cos(endRad);
                            const y2 = 50 + 40 * Math.sin(endRad);

                            // Determine if the arc should be drawn as a large arc
                            const largeArcFlag = percentage > 50 ? 1 : 0;

                            return (
                              <path
                                key={index}
                                d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                                fill={category.color}
                              />
                            );
                          })}
                        </svg>
                      </div>

                      {/* Legend */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {categories.map((category, index) => {
                          const totalSpent = categories.reduce(
                            (sum, cat) => sum + cat.spent,
                            0,
                          );
                          const percentage = (
                            (category.spent / totalSpent) *
                            100
                          ).toFixed(1);

                          return (
                            <div key={index} className="flex items-center">
                              <div
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: category.color }}
                              />
                              <span className="text-xs text-[#0A3D62]">
                                {category.name} ({percentage}%)
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Financial Insights box removed */}
              </div>

              {/* Budget Progress Gauge Charts */}
              <Card>
                <CardHeader>
                  <CardTitle>Budget Progress</CardTitle>
                  <CardDescription>Current month budget status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {categories.slice(0, 4).map((category, index) => {
                      const percentage = Math.min(
                        100,
                        (category.spent / category.budget) * 100,
                      );
                      let statusColor = "#008080"; // Green
                      if (percentage > 90)
                        statusColor = "#FF6F61"; // Red
                      else if (percentage > 75) statusColor = "#CC5500"; // Yellow

                      return (
                        <div key={index} className="text-center">
                          <div className="relative inline-block w-32 h-32">
                            {/* Background circle */}
                            <svg
                              className="w-full h-full"
                              viewBox="0 0 100 100"
                            >
                              <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="#e5e7eb"
                                strokeWidth="10"
                              />

                              {/* Progress circle */}
                              <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke={statusColor}
                                strokeWidth="10"
                                strokeDasharray={`${(2 * Math.PI * 45 * percentage) / 100} ${2 * Math.PI * 45}`}
                                strokeDashoffset="0"
                                transform="rotate(-90 50 50)"
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-2xl font-bold text-[#0A3D62]">
                                {Math.round(percentage)}%
                              </span>
                              <span className="text-xs text-[#0A3D62]/70">
                                {category.name}
                              </span>
                            </div>
                          </div>
                          <p className="mt-2 text-sm font-medium text-[#0A3D62]">
                            {formatCurrency(category.spent)} /{" "}
                            {formatCurrency(category.budget)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Transactions box removed */}

              {/* AI Assistant */}
              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Ask AI Assistant</CardTitle>
                    <CardDescription>
                      Get personalized financial advice and insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ask a question about your finances..."
                        className="flex-grow"
                      />
                      <Button className="bg-[#0A3D62] hover:bg-[#0A3D62]/80">
                        Ask
                      </Button>
                    </div>
                    <div className="mt-2 text-xs text-[#0A3D62]/70">
                      Try: "How much did I spend on food last month?" or "What's
                      my biggest expense category?"
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TrackerDashboard;
