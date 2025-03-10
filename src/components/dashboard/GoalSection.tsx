import React, { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus, Target, ArrowRight } from "lucide-react";

interface GoalSectionProps {
  formatCurrency: (amount: number) => string;
}

const GoalSection = ({ formatCurrency }: GoalSectionProps) => {
  const [open, setOpen] = useState(false);
  const [goalType, setGoalType] = useState("short-term");
  const [targetDate, setTargetDate] = useState<Date | undefined>(new Date());
  const [editingGoalIndex, setEditingGoalIndex] = useState<number | null>(null);
  const [goalName, setGoalName] = useState("");
  const [goalTargetAmount, setGoalTargetAmount] = useState("");
  const [goalCurrentAmount, setGoalCurrentAmount] = useState("");
  const [goalMonthlyContribution, setGoalMonthlyContribution] = useState("");
  const [goalPriority, setGoalPriority] = useState("medium");
  const [goalNotes, setGoalNotes] = useState("");

  // Mock goals data with state
  const [goals, setGoals] = useState([
    {
      id: 1,
      name: "Emergency Fund",
      targetAmount: 100000,
      currentAmount: 45000,
      targetDate: "2023-12-31",
      category: "short-term",
      priority: "high",
      monthlyContribution: 5000,
      notes: "3 months of living expenses",
    },
    {
      id: 2,
      name: "Car Down Payment",
      targetAmount: 200000,
      currentAmount: 80000,
      targetDate: "2024-06-30",
      category: "medium-term",
      priority: "medium",
      monthlyContribution: 10000,
      notes: "For a new sedan",
    },
    {
      id: 3,
      name: "Retirement Fund",
      targetAmount: 5000000,
      currentAmount: 500000,
      targetDate: "2045-01-01",
      category: "long-term",
      priority: "medium",
      monthlyContribution: 15000,
      notes: "For comfortable retirement",
    },
  ]);

  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-amber-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Financial Goals</CardTitle>
            <CardDescription>
              Track and manage your financial goals
            </CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#0A3D62] hover:bg-[#0A3D62]/80">
                <Plus className="h-4 w-4 mr-2" /> Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Financial Goal</DialogTitle>
                <DialogDescription>
                  Set up a new financial goal to track your progress
                </DialogDescription>
              </DialogHeader>

              <Tabs
                defaultValue="short-term"
                value={goalType}
                onValueChange={setGoalType}
                className="w-full mt-4"
              >
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="short-term">Short-term</TabsTrigger>
                  <TabsTrigger value="medium-term">Medium-term</TabsTrigger>
                  <TabsTrigger value="long-term">Long-term</TabsTrigger>
                </TabsList>

                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="goal-name">Goal Name</Label>
                      <Input
                        id="goal-name"
                        placeholder="e.g., Emergency Fund"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="goal-category">Category</Label>
                      <Select defaultValue="emergency">
                        <SelectTrigger id="goal-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="emergency">
                            Emergency Fund
                          </SelectItem>
                          <SelectItem value="debt">Debt Payoff</SelectItem>
                          <SelectItem value="retirement">Retirement</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="travel">Travel</SelectItem>
                          <SelectItem value="home">Home Purchase</SelectItem>
                          <SelectItem value="vehicle">Vehicle</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="target-amount">Target Amount</Label>
                      <Input
                        id="target-amount"
                        type="number"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="current-amount">Current Amount</Label>
                      <Input
                        id="current-amount"
                        type="number"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="monthly-contribution">
                        Monthly Contribution
                      </Label>
                      <Input
                        id="monthly-contribution"
                        type="number"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Target Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            {targetDate ? (
                              format(targetDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={targetDate}
                            onSelect={setTargetDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goal-priority">Priority</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger id="goal-priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goal-notes">Notes</Label>
                    <Input
                      id="goal-notes"
                      placeholder="Additional details about your goal"
                    />
                  </div>
                </div>
              </Tabs>

              <DialogFooter className="mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpen(false);
                    setEditingGoalIndex(null);
                    setGoalName("");
                    setGoalTargetAmount("");
                    setGoalCurrentAmount("");
                    setGoalMonthlyContribution("");
                    setGoalPriority("medium");
                    setGoalNotes("");
                  }}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#0A3D62] hover:bg-[#0A3D62]/80"
                  onClick={() => {
                    // Create a new goal object
                    const newGoal = {
                      id:
                        editingGoalIndex !== null
                          ? goals[editingGoalIndex].id
                          : goals.length + 1,
                      name: goalName || "New Goal",
                      targetAmount: parseFloat(goalTargetAmount) || 100000,
                      currentAmount: parseFloat(goalCurrentAmount) || 0,
                      targetDate: targetDate
                        ? targetDate.toISOString().split("T")[0]
                        : new Date().toISOString().split("T")[0],
                      category: goalType,
                      priority: goalPriority,
                      monthlyContribution:
                        parseFloat(goalMonthlyContribution) || 5000,
                      notes: goalNotes,
                    };

                    if (editingGoalIndex !== null) {
                      // Update existing goal
                      const updatedGoals = [...goals];
                      updatedGoals[editingGoalIndex] = newGoal;
                      setGoals(updatedGoals);
                    } else {
                      // Check if goal with same name exists
                      const existingGoalIndex = goals.findIndex(
                        (g) =>
                          g.name.toLowerCase() === newGoal.name.toLowerCase(),
                      );

                      if (existingGoalIndex >= 0) {
                        // Update existing goal
                        const updatedGoals = [...goals];
                        updatedGoals[existingGoalIndex] = {
                          ...updatedGoals[existingGoalIndex],
                          ...newGoal,
                          id: updatedGoals[existingGoalIndex].id, // Keep original ID
                        };
                        setGoals(updatedGoals);
                      } else {
                        // Add new goal
                        setGoals([...goals, newGoal]);
                      }
                    }

                    // Reset form and close dialog
                    setOpen(false);
                    setEditingGoalIndex(null);
                    setGoalName("");
                    setGoalTargetAmount("");
                    setGoalCurrentAmount("");
                    setGoalMonthlyContribution("");
                    setGoalPriority("medium");
                    setGoalNotes("");
                  }}
                >
                  {editingGoalIndex !== null ? "Update Goal" : "Create Goal"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {/* Goal Summary */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Goals Summary</CardTitle>
              <CardDescription>
                Overview of your financial goals progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#f9f7f5] p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-[#0A3D62]/70 mb-1">
                    Total Goal Amount
                  </h4>
                  <div className="text-2xl font-bold text-[#0A3D62]">
                    {formatCurrency(
                      goals.reduce((sum, goal) => sum + goal.targetAmount, 0),
                    )}
                  </div>
                </div>
                <div className="bg-[#f9f7f5] p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-[#0A3D62]/70 mb-1">
                    Current Progress
                  </h4>
                  <div className="text-2xl font-bold text-[#0A3D62]">
                    {formatCurrency(
                      goals.reduce((sum, goal) => sum + goal.currentAmount, 0),
                    )}
                  </div>
                </div>
                <div className="bg-[#f9f7f5] p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-[#0A3D62]/70 mb-1">
                    Remaining
                  </h4>
                  <div className="text-2xl font-bold text-[#0A3D62]">
                    {formatCurrency(
                      goals.reduce(
                        (sum, goal) =>
                          sum + (goal.targetAmount - goal.currentAmount),
                        0,
                      ),
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {goals.map((goal, index) => (
              <div key={goal.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-[#0A3D62] flex items-center">
                      <Target className="h-4 w-4 mr-2 text-[#0A3D62]" />
                      {goal.name}
                    </h3>
                    <p className="text-sm text-[#0A3D62]/70">
                      Target: {formatCurrency(goal.targetAmount)} by{" "}
                      {new Date(goal.targetDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor(goal.priority)} bg-opacity-10`}
                    >
                      {goal.priority.charAt(0).toUpperCase() +
                        goal.priority.slice(1)}
                    </span>
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 text-[#0A3D62]"
                        onClick={() => {
                          // Set editing state
                          setEditingGoalIndex(index);
                          setGoalType(goal.category);
                          setGoalName(goal.name);
                          setGoalTargetAmount(goal.targetAmount.toString());
                          setGoalCurrentAmount(goal.currentAmount.toString());
                          setGoalMonthlyContribution(
                            goal.monthlyContribution.toString(),
                          );
                          setGoalPriority(goal.priority);
                          setGoalNotes(goal.notes || "");
                          setTargetDate(new Date(goal.targetDate));
                          setOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => {
                          // Remove goal from the list
                          const updatedGoals = [...goals];
                          updatedGoals.splice(index, 1);
                          setGoals(updatedGoals);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>
                      {formatCurrency(goal.currentAmount)} of{" "}
                      {formatCurrency(goal.targetAmount)}
                    </span>
                    <span>
                      {calculateProgress(goal.currentAmount, goal.targetAmount)}
                      %
                    </span>
                  </div>
                  <Progress
                    value={calculateProgress(
                      goal.currentAmount,
                      goal.targetAmount,
                    )}
                    className="h-2"
                  />
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-[#0A3D62]/70">
                    Monthly contribution:{" "}
                    {formatCurrency(goal.monthlyContribution)}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#0A3D62] hover:text-[#0A3D62]/80"
                  >
                    Details <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financial Freedom Calculator</CardTitle>
          <CardDescription>
            Calculate when you can achieve financial freedom
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-net-worth">Current Net Worth</Label>
                <Input
                  id="current-net-worth"
                  type="number"
                  placeholder="0.00"
                  defaultValue="2500000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly-income">Monthly Income</Label>
                <Input
                  id="monthly-income"
                  type="number"
                  placeholder="0.00"
                  defaultValue="50000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly-expenses">Monthly Expenses</Label>
                <Input
                  id="monthly-expenses"
                  type="number"
                  placeholder="0.00"
                  defaultValue="30000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="investment-return-rate">
                  Expected Investment Return Rate (%)
                </Label>
                <Input
                  id="investment-return-rate"
                  type="number"
                  placeholder="0.00"
                  defaultValue="8"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inflation-rate">Expected Inflation (%)</Label>
                <Input
                  id="inflation-rate"
                  type="number"
                  placeholder="0.00"
                  defaultValue="4"
                />
              </div>
              <Button
                className="w-full bg-[#0A3D62] hover:bg-[#0A3D62]/80"
                onClick={() => {
                  // This would normally calculate based on actual input values
                  // For now, we'll just update the UI with new values
                  const targetNetWorthElement =
                    document.getElementById("target-net-worth");
                  const yearsToFreedomElement =
                    document.getElementById("years-to-freedom");
                  const freedomDateElement =
                    document.getElementById("freedom-date");
                  const progressElement =
                    document.getElementById("freedom-progress");
                  const progressTextElement = document.getElementById(
                    "freedom-progress-text",
                  );

                  if (targetNetWorthElement)
                    targetNetWorthElement.textContent =
                      formatCurrency(18000000);
                  if (yearsToFreedomElement)
                    yearsToFreedomElement.textContent = "16.8 years";
                  if (freedomDateElement)
                    freedomDateElement.textContent = "February 2040";
                  if (progressElement)
                    progressElement.setAttribute("value", "14");
                  if (progressTextElement)
                    progressTextElement.textContent = "14% Complete";
                }}
              >
                Calculate
              </Button>
            </div>

            <div className="bg-[#f9f7f5] p-6 rounded-lg">
              <h3 className="text-xl font-bold text-[#0A3D62] mb-6">
                Your Financial Freedom Summary
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-[#0A3D62]/70 mb-1">
                    Target Net Worth
                  </p>
                  <div
                    id="target-net-worth"
                    className="text-2xl font-bold text-[#0A3D62]"
                  >
                    {formatCurrency(15000000)}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-[#0A3D62]/70 mb-1">
                    Years to Financial Freedom
                  </p>
                  <p
                    id="years-to-freedom"
                    className="text-xl font-bold text-[#0A3D62]"
                  >
                    18.5 years
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#0A3D62]/70 mb-1">
                    Estimated Freedom Date
                  </p>
                  <p
                    id="freedom-date"
                    className="text-xl font-bold text-[#0A3D62]"
                  >
                    June 2042
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#0A3D62]/70 mb-1">
                    Progress to Financial Freedom
                  </p>
                  <div className="space-y-1">
                    <Progress
                      id="freedom-progress"
                      value={17}
                      className="h-2"
                    />
                    <p
                      id="freedom-progress-text"
                      className="text-xs text-right text-[#0A3D62]/70"
                    >
                      17% Complete
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalSection;
