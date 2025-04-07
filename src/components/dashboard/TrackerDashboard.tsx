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
  const [editingBudgetIndex, setEditingBudgetIndex] = useState(null);
  const [addSubcategory, setAddSubcategory] = useState(false);
  const [parentCategory, setParentCategory] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [subcategoryBudget, setSubcategoryBudget] = useState("");

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
    {
      name: "Food",
      spent: 8500,
      budget: 10000,
      color: "#008080",
      subcategories: [
        { name: "Groceries", spent: 5000, budget: 6000 },
        { name: "Dining Out", spent: 3500, budget: 4000 },
      ],
    },
    {
      name: "Transportation",
      spent: 3200,
      budget: 5000,
      color: "#D6A3A1",
      subcategories: [
        { name: "Fuel", spent: 1800, budget: 3000 },
        { name: "Public Transit", spent: 1400, budget: 2000 },
      ],
    },
    {
      name: "Entertainment",
      spent: 2800,
      budget: 3000,
      color: "#FF6F61",
      subcategories: [
        { name: "Movies", spent: 800, budget: 1000 },
        { name: "Subscriptions", spent: 2000, budget: 2000 },
      ],
    },
    {
      name: "Utilities",
      spent: 4500,
      budget: 6000,
      color: "#800020",
      subcategories: [
        { name: "Electricity", spent: 2500, budget: 3000 },
        { name: "Water", spent: 800, budget: 1000 },
        { name: "Internet", spent: 1200, budget: 2000 },
      ],
    },
    {
      name: "Shopping",
      spent: 6200,
      budget: 5000,
      color: "#CC5500",
      subcategories: [
        { name: "Clothing", spent: 3500, budget: 2500 },
        { name: "Electronics", spent: 2700, budget: 2500 },
      ],
    },
    {
      name: "House",
      spent: 7500,
      budget: 8000,
      color: "#3D8D7F",
      subcategories: [
        { name: "Rent", spent: 6000, budget: 6000 },
        { name: "Maintenance", spent: 1500, budget: 2000 },
      ],
    },
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
        subcategories: [],
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
              <div>
                <AddTransactionDialog />
              </div>
              {/* Database button moved to tabs */}
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
                My Goal to Financial Freedom
              </h1>
              <p className="text-[#0A3D62]/70">
                Having enough passive income to cover my expenses and being able
                to travel 3 months a year.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              {/* Empty div to maintain layout */}
            </div>
          </div>

          <Tabs
            defaultValue="insights"
            className="w-full"
            onValueChange={setActiveTab}
            value={activeTab}
          >
            <TabsList className="grid grid-cols-6 md:w-[960px] mb-8">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="budgets">Budget</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
              <TabsTrigger value="investments">Investments</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="database">Database</TabsTrigger>
            </TabsList>

            {/* Transactions Tab */}
            <TabsContent
              value="transactions"
              className="space-y-6 grid grid-cols-1 gap-6"
            >
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
                                      <div className="flex items-center space-x-2">
                                        <span
                                          className={`font-medium ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}
                                        >
                                          {transaction.amount > 0 ? "+" : ""}
                                          {formatCurrency(transaction.amount)}
                                        </span>
                                        <div className="flex space-x-1">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 px-2 text-[#0A3D62]"
                                          >
                                            Edit
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50"
                                          >
                                            Delete
                                          </Button>
                                        </div>
                                      </div>
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
                                <div className="flex items-center space-x-2">
                                  <span
                                    className={`font-medium ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}
                                  >
                                    {transaction.amount > 0 ? "+" : ""}
                                    {formatCurrency(transaction.amount)}
                                  </span>
                                  <div className="flex space-x-1">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 px-2 text-[#0A3D62]"
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50"
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </div>
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
                                  className={`p-2 rounded-md border ${hasTransaction ? "border-[#0A3D62]/20 bg-[#0A3D62]/5" : "border-gray-200"} min-h-[80px] text-center cursor-pointer relative group`}
                                  onClick={() => {
                                    if (hasTransaction) {
                                      // Show popup with transaction details
                                      const popup = document.getElementById(
                                        `day-popup-${day}`,
                                      );
                                      if (popup) {
                                        popup.classList.toggle("hidden");
                                      }
                                    }
                                  }}
                                >
                                  <div className="font-medium text-[#0A3D62]">
                                    {day}
                                  </div>
                                  {hasTransaction && (
                                    <>
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
                                      <div
                                        id={`day-popup-${day}`}
                                        className="hidden absolute left-full top-0 z-50 w-64 p-3 bg-white shadow-lg rounded-lg border border-gray-200 text-left"
                                      >
                                        <h4 className="font-medium text-[#0A3D62] mb-2 text-sm">
                                          Transactions for {day}{" "}
                                          {selectedMonth
                                            .charAt(0)
                                            .toUpperCase() +
                                            selectedMonth.slice(1)}
                                        </h4>
                                        <div className="max-h-48 overflow-y-auto">
                                          {dayTransactions.map((t, idx) => (
                                            <div
                                              key={idx}
                                              className="mb-2 pb-2 border-b border-gray-100 last:border-0"
                                            >
                                              <div className="flex justify-between items-center">
                                                <span className="text-xs font-medium">
                                                  {t.description}
                                                </span>
                                                <span
                                                  className={`text-xs font-medium ${t.amount > 0 ? "text-green-600" : "text-red-600"}`}
                                                >
                                                  {t.amount > 0 ? "+" : ""}
                                                  {formatCurrency(t.amount)}
                                                </span>
                                              </div>
                                              <div className="text-xs text-gray-500">
                                                {t.category}
                                                {t.subcategory
                                                  ? ` > ${t.subcategory}`
                                                  : ""}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                        <div className="mt-2 pt-2 border-t border-gray-200">
                                          <div className="flex justify-between items-center">
                                            <span className="text-xs font-medium">
                                              Total:
                                            </span>
                                            <span
                                              className={`text-xs font-medium ${income + expense > 0 ? "text-green-600" : "text-red-600"}`}
                                            >
                                              {formatCurrency(income + expense)}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </>
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
                                          className={`p-2 rounded-md border ${hasTransaction ? "border-[#0A3D62]/20 bg-[#0A3D62]/5" : "border-gray-200"} min-h-[80px] text-center cursor-pointer relative group`}
                                          onClick={() => {
                                            if (hasTransaction) {
                                              // Show popup with transaction details
                                              const popup =
                                                document.getElementById(
                                                  `range-day-popup-${currentMonthName}-${currentYear}-${day}`,
                                                );
                                              if (popup) {
                                                popup.classList.toggle(
                                                  "hidden",
                                                );
                                              }
                                            }
                                          }}
                                        >
                                          <div className="font-medium text-[#0A3D62]">
                                            {day}
                                          </div>
                                          {hasTransaction && (
                                            <>
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
                                              <div
                                                id={`range-day-popup-${currentMonthName}-${currentYear}-${day}`}
                                                className="hidden absolute left-full top-0 z-50 w-64 p-3 bg-white shadow-lg rounded-lg border border-gray-200 text-left"
                                              >
                                                <h4 className="font-medium text-[#0A3D62] mb-2 text-sm">
                                                  Transactions for {day}{" "}
                                                  {currentMonthName}{" "}
                                                  {currentYear}
                                                </h4>
                                                <div className="max-h-48 overflow-y-auto">
                                                  {dayTransactions.map(
                                                    (t, idx) => (
                                                      <div
                                                        key={idx}
                                                        className="mb-2 pb-2 border-b border-gray-100 last:border-0"
                                                      >
                                                        <div className="flex justify-between items-center">
                                                          <span className="text-xs font-medium">
                                                            {t.description}
                                                          </span>
                                                          <span
                                                            className={`text-xs font-medium ${t.amount > 0 ? "text-green-600" : "text-red-600"}`}
                                                          >
                                                            {t.amount > 0
                                                              ? "+"
                                                              : ""}
                                                            {formatCurrency(
                                                              t.amount,
                                                            )}
                                                          </span>
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                          {t.category}
                                                          {t.subcategory
                                                            ? ` > ${t.subcategory}`
                                                            : ""}
                                                        </div>
                                                      </div>
                                                    ),
                                                  )}
                                                </div>
                                                <div className="mt-2 pt-2 border-t border-gray-200">
                                                  <div className="flex justify-between items-center">
                                                    <span className="text-xs font-medium">
                                                      Total:
                                                    </span>
                                                    <span
                                                      className={`text-xs font-medium ${income + expense > 0 ? "text-green-600" : "text-red-600"}`}
                                                    >
                                                      {formatCurrency(
                                                        income + expense,
                                                      )}
                                                    </span>
                                                  </div>
                                                </div>
                                              </div>
                                            </>
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
            <TabsContent
              value="goals"
              className="space-y-6 grid grid-cols-1 gap-6"
            >
              <GoalSection formatCurrency={formatCurrency} />
            </TabsContent>

            {/* Budgets Tab */}
            <TabsContent
              value="budgets"
              className="space-y-6 grid grid-cols-1 gap-6"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Monthly Budget</CardTitle>
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

                  {showBudgetForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-xl font-bold text-[#0A3D62] mb-4">
                          Create New Budget
                        </h3>

                        <div className="space-y-4">
                          <div className="flex flex-col space-y-3 mb-4">
                            <h4 className="text-sm font-medium text-[#0A3D62]">
                              Budget Type
                            </h4>
                            <div className="bg-gray-100 rounded-lg p-1 flex w-full max-w-xs">
                              <button
                                onClick={() => setAddSubcategory(false)}
                                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${!addSubcategory ? "bg-[#0A3D62] text-white" : "text-[#0A3D62]"}`}
                              >
                                Category
                              </button>
                              <button
                                onClick={() => setAddSubcategory(true)}
                                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${addSubcategory ? "bg-[#0A3D62] text-white" : "text-[#0A3D62]"}`}
                              >
                                Subcategory
                              </button>
                            </div>
                          </div>

                          {addSubcategory ? (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="parent-category">
                                  Parent Category
                                </Label>
                                <Select
                                  value={parentCategory}
                                  onValueChange={setParentCategory}
                                >
                                  <SelectTrigger id="parent-category">
                                    <SelectValue placeholder="Select parent category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {categories.map((cat) => (
                                      <SelectItem
                                        key={cat.name}
                                        value={cat.name.toLowerCase()}
                                      >
                                        {cat.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="subcategory-name">
                                  Subcategory Name
                                </Label>
                                <Input
                                  id="subcategory-name"
                                  placeholder="Enter subcategory name"
                                  value={subcategoryName}
                                  onChange={(e) =>
                                    setSubcategoryName(e.target.value)
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="subcategory-budget">
                                  Budget Amount
                                </Label>
                                <Input
                                  id="subcategory-budget"
                                  type="number"
                                  placeholder="0.00"
                                  value={subcategoryBudget}
                                  onChange={(e) =>
                                    setSubcategoryBudget(e.target.value)
                                  }
                                />
                              </div>
                            </div>
                          ) : (
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
                          )}

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

                          {!addSubcategory && (
                            <div className="space-y-2">
                              <Label htmlFor="budget-amount">
                                Budget Amount
                              </Label>
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
                          )}
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
                              if (addSubcategory) {
                                // Add subcategory logic
                                if (
                                  parentCategory &&
                                  subcategoryName &&
                                  subcategoryBudget
                                ) {
                                  const updatedCategories = [...categories];
                                  const parentCategoryIndex =
                                    updatedCategories.findIndex(
                                      (cat) =>
                                        cat.name.toLowerCase() ===
                                        parentCategory.toLowerCase(),
                                    );

                                  if (parentCategoryIndex >= 0) {
                                    // Create subcategories array if it doesn't exist
                                    if (
                                      !updatedCategories[parentCategoryIndex]
                                        .subcategories
                                    ) {
                                      updatedCategories[
                                        parentCategoryIndex
                                      ].subcategories = [];
                                    }

                                    // Add new subcategory
                                    updatedCategories[
                                      parentCategoryIndex
                                    ].subcategories.push({
                                      name: subcategoryName,
                                      spent: 0,
                                      budget: parseFloat(subcategoryBudget),
                                    });

                                    setCategories(updatedCategories);
                                  }

                                  // Reset form
                                  setParentCategory("");
                                  setSubcategoryName("");
                                  setSubcategoryBudget("");
                                  setAddSubcategory(false);
                                  setShowBudgetForm(false);
                                }
                              } else {
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
                                      subcategories: [],
                                    };

                                    // Update categories state
                                    setCategories([...categories, newBudget]);

                                    console.log("Budget saved successfully");
                                  } catch (error) {
                                    console.error(
                                      "Error saving budget:",
                                      error,
                                    );
                                  }
                                };

                                if (editingBudgetIndex !== null) {
                                  // Update existing budget
                                  const updatedCategories = [...categories];
                                  updatedCategories[editingBudgetIndex] = {
                                    ...updatedCategories[editingBudgetIndex],
                                    name:
                                      customCategoryName || newBudgetCategory,
                                    budget: parseFloat(newBudgetAmount),
                                    color:
                                      customCategoryColor ||
                                      updatedCategories[editingBudgetIndex]
                                        .color,
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
                                          customCategoryName ||
                                          newBudgetCategory
                                        ).toLowerCase(),
                                    );

                                  if (existingCategoryIndex >= 0) {
                                    // Update existing category
                                    const updatedCategories = [...categories];
                                    updatedCategories[existingCategoryIndex] = {
                                      ...updatedCategories[
                                        existingCategoryIndex
                                      ],
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
                              }
                            }}
                          >
                            {editingBudgetIndex !== null
                              ? "Update"
                              : addSubcategory
                                ? "Add Subcategory"
                                : "Create"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    {categories.map((category, index) => (
                      <div
                        key={index}
                        className="p-4 border rounded-lg space-y-4"
                      >
                        <div>
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
                                    setEditingBudgetIndex(index);
                                    setNewBudgetCategory(
                                      category.name.toLowerCase(),
                                    );
                                    setNewBudgetAmount(
                                      category.budget.toString(),
                                    );
                                    setCustomCategoryColor(category.color);
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
                          <Progress
                            value={(category.spent / category.budget) * 100}
                            className="h-2 bg-gray-200"
                            indicatorClassName={`${category.spent > category.budget ? "bg-red-500" : "bg-[#0A3D62]"}`}
                          />
                        </div>

                        {/* Subcategories */}
                        <div className="pl-4 space-y-3 mt-3">
                          {category.subcategories &&
                            category.subcategories.map(
                              (subcategory, subIndex) => (
                                <div
                                  key={`${index}-${subIndex}`}
                                  className="border-l-2 pl-4"
                                  style={{ borderColor: category.color }}
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <h4 className="text-sm font-medium text-[#0A3D62]">
                                      {subcategory.name}
                                    </h4>
                                    <div className="text-xs font-medium">
                                      <span
                                        className={
                                          subcategory.spent > subcategory.budget
                                            ? "text-red-600"
                                            : "text-[#0A3D62]"
                                        }
                                      >
                                        {formatCurrency(subcategory.spent)}
                                      </span>
                                      <span className="text-[#0A3D62]/70">
                                        {" "}
                                        / {formatCurrency(subcategory.budget)}
                                      </span>
                                    </div>
                                  </div>
                                  <Progress
                                    value={
                                      (subcategory.spent / subcategory.budget) *
                                      100
                                    }
                                    className="h-1.5 bg-gray-200"
                                    indicatorClassName={`${subcategory.spent > subcategory.budget ? "bg-red-500" : "bg-[#0A3D62]/80"}`}
                                  />
                                </div>
                              ),
                            )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-7 text-[#0A3D62] mt-2"
                          >
                            <Plus className="h-3 w-3 mr-1" /> Add Subcategory
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Database Tab */}
            <TabsContent
              value="database"
              className="space-y-6 grid grid-cols-1 gap-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Database Management</CardTitle>
                  <CardDescription>
                    Manage your financial data and records
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Categories</CardTitle>
                          <CardDescription>
                            Manage your expense and income categories
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {categories.map((category, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="flex items-center">
                                  <div
                                    className="w-4 h-4 rounded-full mr-3"
                                    style={{ backgroundColor: category.color }}
                                  />
                                  <span className="font-medium text-[#0A3D62]">
                                    {category.name}
                                  </span>
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-2 text-[#0A3D62]"
                                    onClick={() => {
                                      setEditingBudgetIndex(index);
                                      setNewBudgetCategory(
                                        category.name.toLowerCase(),
                                      );
                                      setCustomCategoryColor(category.color);
                                      setShowBudgetForm(true);
                                    }}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50"
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                          <Button
                            className="bg-[#0A3D62] hover:bg-[#0A3D62]/80 mt-4 w-full"
                            onClick={() => {
                              setNewBudgetCategory("custom");
                              setShowCustomCategoryInput(true);
                              setShowBudgetForm(true);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" /> Add New Category
                          </Button>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Data Import/Export</CardTitle>
                          <CardDescription>
                            Manage your financial data
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="p-4 border rounded-lg">
                              <h3 className="font-medium text-[#0A3D62] mb-2">
                                Import Data
                              </h3>
                              <p className="text-sm text-[#0A3D62]/70 mb-3">
                                Upload CSV files from your bank or other
                                financial services
                              </p>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  className="text-[#0A3D62]"
                                >
                                  Choose File
                                </Button>
                                <Button className="bg-[#0A3D62] hover:bg-[#0A3D62]/80">
                                  Upload
                                </Button>
                              </div>
                            </div>

                            <div className="p-4 border rounded-lg">
                              <h3 className="font-medium text-[#0A3D62] mb-2">
                                Export Data
                              </h3>
                              <p className="text-sm text-[#0A3D62]/70 mb-3">
                                Download your financial data for backup or
                                analysis
                              </p>
                              <div className="flex items-center space-x-2">
                                <Button className="bg-[#0A3D62] hover:bg-[#0A3D62]/80">
                                  <Download className="h-4 w-4 mr-2" /> Export
                                  as CSV
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Data Management</CardTitle>
                        <CardDescription>
                          Clean up and organize your financial records
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 border rounded-lg">
                              <h3 className="font-medium text-[#0A3D62] mb-2">
                                Bulk Delete
                              </h3>
                              <p className="text-sm text-[#0A3D62]/70 mb-3">
                                Remove multiple transactions at once
                              </p>
                              <Button
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50 w-full"
                              >
                                Manage Bulk Delete
                              </Button>
                            </div>

                            <div className="p-4 border rounded-lg">
                              <h3 className="font-medium text-[#0A3D62] mb-2">
                                Recategorize
                              </h3>
                              <p className="text-sm text-[#0A3D62]/70 mb-3">
                                Change categories for multiple transactions
                              </p>
                              <Button
                                variant="outline"
                                className="text-[#0A3D62] w-full"
                              >
                                Batch Recategorize
                              </Button>
                            </div>

                            <div className="p-4 border rounded-lg">
                              <h3 className="font-medium text-[#0A3D62] mb-2">
                                Data Cleanup
                              </h3>
                              <p className="text-sm text-[#0A3D62]/70 mb-3">
                                Fix duplicates and errors in your data
                              </p>
                              <Button
                                variant="outline"
                                className="text-[#0A3D62] w-full"
                              >
                                Run Cleanup
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Investments Tab */}
            <TabsContent
              value="investments"
              className="space-y-6 grid grid-cols-1 gap-6"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Investment Portfolio</CardTitle>
                    <CardDescription>
                      Track and manage your investment assets
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      className="bg-[#0A3D62] hover:bg-[#0A3D62]/80"
                      onClick={() => setShowBudgetForm(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Investment
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-[#f9f7f5] p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-[#0A3D62]/70 mb-1">
                        Total Investments
                      </h4>
                      <div className="text-2xl font-bold text-[#0A3D62]">
                        {formatCurrency(2500000)}
                      </div>
                    </div>
                    <div className="bg-[#f9f7f5] p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-[#0A3D62]/70 mb-1">
                        Total Returns
                      </h4>
                      <div className="text-2xl font-bold text-green-600">
                        +{formatCurrency(320000)}
                      </div>
                    </div>
                    <div className="bg-[#f9f7f5] p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-[#0A3D62]/70 mb-1">
                        ROI
                      </h4>
                      <div className="text-2xl font-bold text-green-600">
                        +12.8%
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Real Estate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium text-[#0A3D62]">
                                Condominium Unit - Makati
                              </h3>
                              <div className="text-sm font-medium text-[#0A3D62]">
                                {formatCurrency(1800000)}
                              </div>
                            </div>
                            <div className="flex justify-between text-sm text-[#0A3D62]/70 mb-2">
                              <span>Purchase: {formatCurrency(1500000)}</span>
                              <span>Appreciation: +20%</span>
                            </div>
                            <div className="flex space-x-2 mt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2 text-[#0A3D62]"
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2 text-[#0A3D62]"
                              >
                                Details
                              </Button>
                            </div>
                          </div>

                          <div className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium text-[#0A3D62]">
                                Lot - Cavite
                              </h3>
                              <div className="text-sm font-medium text-[#0A3D62]">
                                {formatCurrency(500000)}
                              </div>
                            </div>
                            <div className="flex justify-between text-sm text-[#0A3D62]/70 mb-2">
                              <span>Purchase: {formatCurrency(350000)}</span>
                              <span>Appreciation: +42.8%</span>
                            </div>
                            <div className="flex space-x-2 mt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2 text-[#0A3D62]"
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2 text-[#0A3D62]"
                              >
                                Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Stocks</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium text-[#0A3D62]">
                                ACEN (AC Energy)
                              </h3>
                              <div className="text-sm font-medium text-green-600">
                                {formatCurrency(120000)}
                              </div>
                            </div>
                            <div className="flex justify-between text-sm text-[#0A3D62]/70 mb-2">
                              <span>Shares: 10,000</span>
                              <span>Current: ₱12.00</span>
                              <span>Avg. Cost: ₱10.50</span>
                              <span>Gain: +14.3%</span>
                            </div>
                            <div className="flex space-x-2 mt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2 text-[#0A3D62]"
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2 text-[#0A3D62]"
                              >
                                Details
                              </Button>
                            </div>
                          </div>

                          <div className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium text-[#0A3D62]">
                                SM (SM Investments)
                              </h3>
                              <div className="text-sm font-medium text-red-600">
                                {formatCurrency(80000)}
                              </div>
                            </div>
                            <div className="flex justify-between text-sm text-[#0A3D62]/70 mb-2">
                              <span>Shares: 800</span>
                              <span>Current: ₱100.00</span>
                              <span>Avg. Cost: ₱105.50</span>
                              <span>Loss: -5.2%</span>
                            </div>
                            <div className="flex space-x-2 mt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2 text-[#0A3D62]"
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2 text-[#0A3D62]"
                              >
                                Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Insights Tab */}
            <TabsContent
              value="insights"
              className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Monthly Overview</CardTitle>
                  <CardDescription>
                    Your financial activity for{" "}
                    {selectedMonth.charAt(0).toUpperCase() +
                      selectedMonth.slice(1)}{" "}
                    {selectedYear}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Insights Filters */}
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Insights Filters</CardTitle>
                      <CardDescription>
                        Customize your insights view
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
                              <SelectItem value="single">
                                Single Month
                              </SelectItem>
                              <SelectItem value="range">Month Range</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {filterType === "single" ? (
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-[#f9f7f5] p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-[#0A3D62]/70 mb-1">
                        Total Income
                      </h4>
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(
                          filteredTransactions
                            .filter((t) => t.amount > 0)
                            .reduce((sum, t) => sum + t.amount, 0),
                        )}
                      </div>
                    </div>
                    <div className="bg-[#f9f7f5] p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-[#0A3D62]/70 mb-1">
                        Total Expenses
                      </h4>
                      <div className="text-2xl font-bold text-red-600">
                        {formatCurrency(
                          filteredTransactions
                            .filter((t) => t.amount < 0)
                            .reduce((sum, t) => sum + t.amount, 0),
                        )}
                      </div>
                    </div>
                    <div className="bg-[#f9f7f5] p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-[#0A3D62]/70 mb-1">
                        Net Savings
                      </h4>
                      <div
                        className={`text-2xl font-bold ${filteredTransactions.reduce((sum, t) => sum + t.amount, 0) >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {formatCurrency(
                          filteredTransactions.reduce(
                            (sum, t) => sum + t.amount,
                            0,
                          ),
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-[#0A3D62] mb-4">
                        Spending by Category
                      </h3>
                      <div className="space-y-4">
                        {categories.map((category) => (
                          <div key={category.name} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div
                                  className="w-3 h-3 rounded-full mr-2"
                                  style={{ backgroundColor: category.color }}
                                />
                                <span className="text-sm font-medium">
                                  {category.name}
                                </span>
                              </div>
                              <span
                                className={
                                  category.spent > category.budget
                                    ? "text-red-600 text-sm font-medium"
                                    : "text-[#0A3D62] text-sm font-medium"
                                }
                              >
                                {formatCurrency(category.spent)}
                              </span>
                            </div>
                            <Progress
                              value={(category.spent / category.budget) * 100}
                              className="h-2 bg-gray-200"
                              indicatorClassName={`${category.spent > category.budget ? "bg-red-500" : "bg-[#0A3D62]"}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>
                    Your latest financial activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredTransactions.slice(0, 5).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-[#0A3D62]">
                            {transaction.description}
                          </p>
                          <p className="text-xs text-[#0A3D62]/70">
                            {new Date(transaction.date).toLocaleDateString()}
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Health Score</CardTitle>
                  <CardDescription>
                    Based on your spending habits and savings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="relative w-40 h-40 mb-4">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-4xl font-bold text-[#0A3D62]">
                          78
                        </div>
                      </div>
                      <svg
                        className="w-full h-full"
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#e2e8f0"
                          strokeWidth="10"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#0A3D62"
                          strokeWidth="10"
                          strokeDasharray="282.7"
                          strokeDashoffset="62.2"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-medium text-[#0A3D62]">
                        Good
                      </h3>
                      <p className="text-sm text-[#0A3D62]/70 mt-1">
                        You're on track to meet your financial goals
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Savings Rate</span>
                      <span className="text-sm font-medium text-green-600">
                        18%
                      </span>
                    </div>
                    <Progress
                      value={18}
                      className="h-2 bg-gray-200"
                      indicatorClassName="bg-green-600"
                    />

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Debt-to-Income
                      </span>
                      <span className="text-sm font-medium text-yellow-600">
                        32%
                      </span>
                    </div>
                    <Progress
                      value={32}
                      className="h-2 bg-gray-200"
                      indicatorClassName="bg-yellow-600"
                    />

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Budget Adherence
                      </span>
                      <span className="text-sm font-medium text-[#0A3D62]">
                        85%
                      </span>
                    </div>
                    <Progress
                      value={85}
                      className="h-2 bg-gray-200"
                      indicatorClassName="bg-[#0A3D62]"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>AI-Powered Insights</CardTitle>
                  <CardDescription>
                    Personalized financial recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-[#0A3D62]/5 rounded-lg border border-[#0A3D62]/10">
                      <div className="flex items-start">
                        <div className="bg-[#0A3D62] text-white p-2 rounded-full mr-3">
                          <MessageSquare className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-[#0A3D62] mb-1">
                            Spending Pattern Detected
                          </h4>
                          <p className="text-sm text-[#0A3D62]/70">
                            You've spent 24% more on dining out this month
                            compared to your 3-month average. Consider setting a
                            specific budget for restaurants to keep your
                            spending in check.
                          </p>
                          <div className="mt-3 flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs h-8 border-[#0A3D62] text-[#0A3D62]"
                            >
                              Create Budget
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs h-8 border-gray-200 text-gray-500"
                            >
                              Dismiss
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                      <div className="flex items-start">
                        <div className="bg-green-600 text-white p-2 rounded-full mr-3">
                          <Target className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-green-800 mb-1">
                            Savings Goal Progress
                          </h4>
                          <p className="text-sm text-green-700">
                            You're 65% of the way to your emergency fund goal.
                            At your current savings rate, you'll reach your
                            target in approximately 4 months.
                          </p>
                          <div className="mt-2">
                            <div className="flex justify-between items-center text-xs text-green-700 mb-1">
                              <span>₱65,000 saved</span>
                              <span>₱100,000 goal</span>
                            </div>
                            <Progress
                              value={65}
                              className="h-2 bg-green-100"
                              indicatorClassName="bg-green-600"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-start">
                        <div className="bg-blue-600 text-white p-2 rounded-full mr-3">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-blue-800 mb-1">
                            Upcoming Bill Reminder
                          </h4>
                          <p className="text-sm text-blue-700">
                            Your electricity bill (approximately ₱4,500 based on
                            previous months) is due in 5 days. Make sure you
                            have sufficient funds in your account.
                          </p>
                          <div className="mt-3 flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs h-8 border-blue-300 text-blue-700"
                            >
                              Schedule Payment
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs h-8 border-gray-200 text-gray-500"
                            >
                              Remind Me Later
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="relative">
                      <Input
                        placeholder="Ask Fintr about your finances..."
                        className="pr-12"
                      />
                      <Button
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-10 bg-[#0A3D62] hover:bg-[#0A3D62]/80"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TrackerDashboard;
