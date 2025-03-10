import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
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
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus, Upload } from "lucide-react";

interface AddTransactionDialogProps {
  onAddTransaction?: (transaction: any) => void;
}

const AddTransactionDialog = ({
  onAddTransaction = () => {},
}: AddTransactionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState("expense");

  // Form states for each transaction type
  const [expenseForm, setExpenseForm] = useState({
    amount: "",
    description: "",
    category: "",
    paymentMethod: "",
    expenseType: "one-time",
    receipt: null as File | null,
  });

  const [incomeForm, setIncomeForm] = useState({
    amount: "",
    description: "",
    category: "",
    source: "",
    receipt: null as File | null,
  });

  const [loanForm, setLoanForm] = useState({
    amount: "",
    description: "",
    type: "borrowed", // borrowed or lent
    person: "",
    interestRate: "",
    dueDate: new Date(),
    receipt: null as File | null,
  });

  const [transferForm, setTransferForm] = useState({
    amount: "",
    fromAccount: "",
    toAccount: "",
    description: "",
    receipt: null as File | null,
  });

  const handleSubmit = () => {
    let transactionData;

    switch (activeTab) {
      case "expense":
        transactionData = {
          type: "expense",
          ...expenseForm,
          date: date,
          amount: -Math.abs(parseFloat(expenseForm.amount)),
        };
        break;
      case "income":
        transactionData = {
          type: "income",
          ...incomeForm,
          date: date,
          amount: Math.abs(parseFloat(incomeForm.amount)),
        };
        break;
      case "loan":
        transactionData = {
          type: "loan",
          ...loanForm,
          date: date,
          amount:
            loanForm.type === "borrowed"
              ? Math.abs(parseFloat(loanForm.amount))
              : -Math.abs(parseFloat(loanForm.amount)),
        };
        break;
      case "transfer":
        transactionData = {
          type: "transfer",
          ...transferForm,
          date: date,
          amount: Math.abs(parseFloat(transferForm.amount)),
        };
        break;
      default:
        return;
    }

    onAddTransaction(transactionData);
    setOpen(false);
    resetForms();
  };

  const resetForms = () => {
    setExpenseForm({
      amount: "",
      description: "",
      category: "",
      paymentMethod: "",
      expenseType: "one-time",
      receipt: null,
    });
    setIncomeForm({
      amount: "",
      description: "",
      category: "",
      source: "",
      receipt: null,
    });
    setLoanForm({
      amount: "",
      description: "",
      type: "borrowed",
      person: "",
      interestRate: "",
      dueDate: new Date(),
      receipt: null,
    });
    setTransferForm({
      amount: "",
      fromAccount: "",
      toAccount: "",
      description: "",
      receipt: null,
    });
    setDate(new Date());
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    formType: string,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      switch (formType) {
        case "expense":
          setExpenseForm({ ...expenseForm, receipt: file });
          break;
        case "income":
          setIncomeForm({ ...incomeForm, receipt: file });
          break;
        case "loan":
          setLoanForm({ ...loanForm, receipt: file });
          break;
        case "transfer":
          setTransferForm({ ...transferForm, receipt: file });
          break;
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#0A3D62] hover:bg-[#0A3D62]/80">
          <Plus className="h-4 w-4 mr-2" /> Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
          <DialogDescription>
            Enter the details of your transaction below.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="expense"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full mt-4"
        >
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="expense">Expense</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="loan">Loan</TabsTrigger>
            <TabsTrigger value="transfer">Transfer</TabsTrigger>
          </TabsList>

          {/* Date picker for all transaction types */}
          <div className="my-4">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-full justify-start text-left font-normal mt-1"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Expense Form */}
          <TabsContent value="expense" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expense-amount">Amount</Label>
                <Input
                  id="expense-amount"
                  type="number"
                  placeholder="0.00"
                  value={expenseForm.amount}
                  onChange={(e) =>
                    setExpenseForm({ ...expenseForm, amount: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expense-type">Expense Type</Label>
                <Select
                  value={expenseForm.expenseType}
                  onValueChange={(value) =>
                    setExpenseForm({ ...expenseForm, expenseType: value })
                  }
                >
                  <SelectTrigger id="expense-type">
                    <SelectValue placeholder="Select expense type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-time">One-time</SelectItem>
                    <SelectItem value="recurring">Recurring</SelectItem>
                    <SelectItem value="installment">Installment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expense-category">Category</Label>
                <Select
                  value={expenseForm.category}
                  onValueChange={(value) =>
                    setExpenseForm({ ...expenseForm, category: value })
                  }
                >
                  <SelectTrigger id="expense-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="transportation">
                      Transportation
                    </SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="custom">
                      + Add Custom Category
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expense-payment-method">Payment Method</Label>
                <Select
                  value={expenseForm.paymentMethod}
                  onValueChange={(value) =>
                    setExpenseForm({ ...expenseForm, paymentMethod: value })
                  }
                >
                  <SelectTrigger id="expense-payment-method">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="credit-card">Credit Card</SelectItem>
                    <SelectItem value="debit-card">Debit Card</SelectItem>
                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    <SelectItem value="e-wallet">E-Wallet</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expense-description">Description</Label>
              <Input
                id="expense-description"
                placeholder="What did you spend on?"
                value={expenseForm.description}
                onChange={(e) =>
                  setExpenseForm({
                    ...expenseForm,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Attach Receipt</Label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() =>
                  document.getElementById("expense-receipt-upload")?.click()
                }
              >
                <div className="flex flex-col items-center">
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    Drag & drop your receipt here or{" "}
                    <span className="text-[#0A3D62] font-medium">
                      browse files
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Supports: JPG, PNG, PDF (Max 5MB)
                  </p>
                  {expenseForm.receipt && (
                    <p className="text-sm text-green-600 mt-2">
                      File selected: {expenseForm.receipt.name}
                    </p>
                  )}
                </div>
                <input
                  id="expense-receipt-upload"
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={(e) => handleFileUpload(e, "expense")}
                />
              </div>
            </div>
          </TabsContent>

          {/* Income Form */}
          <TabsContent value="income" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="income-amount">Amount</Label>
                <Input
                  id="income-amount"
                  type="number"
                  placeholder="0.00"
                  value={incomeForm.amount}
                  onChange={(e) =>
                    setIncomeForm({ ...incomeForm, amount: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="income-category">Category</Label>
                <Select
                  value={incomeForm.category}
                  onValueChange={(value) =>
                    setIncomeForm({ ...incomeForm, category: value })
                  }
                >
                  <SelectTrigger id="income-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                    <SelectItem value="gift">Gift</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="custom">
                      + Add Custom Category
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="income-description">Description</Label>
              <Input
                id="income-description"
                placeholder="Source of income"
                value={incomeForm.description}
                onChange={(e) =>
                  setIncomeForm({ ...incomeForm, description: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="income-source">Source</Label>
              <Input
                id="income-source"
                placeholder="Who paid you?"
                value={incomeForm.source}
                onChange={(e) =>
                  setIncomeForm({ ...incomeForm, source: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Attach Document</Label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() =>
                  document.getElementById("income-receipt-upload")?.click()
                }
              >
                <div className="flex flex-col items-center">
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    Drag & drop your document here or{" "}
                    <span className="text-[#0A3D62] font-medium">
                      browse files
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Supports: JPG, PNG, PDF (Max 5MB)
                  </p>
                  {incomeForm.receipt && (
                    <p className="text-sm text-green-600 mt-2">
                      File selected: {incomeForm.receipt.name}
                    </p>
                  )}
                </div>
                <input
                  id="income-receipt-upload"
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={(e) => handleFileUpload(e, "income")}
                />
              </div>
            </div>
          </TabsContent>

          {/* Loan Form */}
          <TabsContent value="loan" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="loan-amount">Amount</Label>
                <Input
                  id="loan-amount"
                  type="number"
                  placeholder="0.00"
                  value={loanForm.amount}
                  onChange={(e) =>
                    setLoanForm({ ...loanForm, amount: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loan-type">Loan Type</Label>
                <Select
                  value={loanForm.type}
                  onValueChange={(value) =>
                    setLoanForm({ ...loanForm, type: value })
                  }
                >
                  <SelectTrigger id="loan-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="borrowed">Money Borrowed</SelectItem>
                    <SelectItem value="lent">Money Lent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="loan-description">Description</Label>
              <Input
                id="loan-description"
                placeholder="Purpose of loan"
                value={loanForm.description}
                onChange={(e) =>
                  setLoanForm({ ...loanForm, description: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="loan-person">
                {loanForm.type === "borrowed" ? "Lender" : "Borrower"}
              </Label>
              <Input
                id="loan-person"
                placeholder={
                  loanForm.type === "borrowed"
                    ? "Who lent you money?"
                    : "Who borrowed money from you?"
                }
                value={loanForm.person}
                onChange={(e) =>
                  setLoanForm({ ...loanForm, person: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="loan-interest">Interest Rate (%)</Label>
                <Input
                  id="loan-interest"
                  type="number"
                  placeholder="0.00"
                  value={loanForm.interestRate}
                  onChange={(e) =>
                    setLoanForm({ ...loanForm, interestRate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loan-due-date">Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal mt-1"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {loanForm.dueDate ? (
                        format(loanForm.dueDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={loanForm.dueDate}
                      onSelect={(date) =>
                        setLoanForm({
                          ...loanForm,
                          dueDate: date || new Date(),
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Attach Agreement Document</Label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() =>
                  document.getElementById("loan-receipt-upload")?.click()
                }
              >
                <div className="flex flex-col items-center">
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    Drag & drop your document here or{" "}
                    <span className="text-[#0A3D62] font-medium">
                      browse files
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Supports: JPG, PNG, PDF (Max 5MB)
                  </p>
                  {loanForm.receipt && (
                    <p className="text-sm text-green-600 mt-2">
                      File selected: {loanForm.receipt.name}
                    </p>
                  )}
                </div>
                <input
                  id="loan-receipt-upload"
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={(e) => handleFileUpload(e, "loan")}
                />
              </div>
            </div>
          </TabsContent>

          {/* Transfer Form */}
          <TabsContent value="transfer" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="transfer-amount">Amount</Label>
              <Input
                id="transfer-amount"
                type="number"
                placeholder="0.00"
                value={transferForm.amount}
                onChange={(e) =>
                  setTransferForm({ ...transferForm, amount: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transfer-from">From Account</Label>
                <Select
                  value={transferForm.fromAccount}
                  onValueChange={(value) =>
                    setTransferForm({ ...transferForm, fromAccount: value })
                  }
                >
                  <SelectTrigger id="transfer-from">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Checking Account</SelectItem>
                    <SelectItem value="savings">Savings Account</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="credit-card">Credit Card</SelectItem>
                    <SelectItem value="e-wallet">E-Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="transfer-to">To Account</Label>
                <Select
                  value={transferForm.toAccount}
                  onValueChange={(value) =>
                    setTransferForm({ ...transferForm, toAccount: value })
                  }
                >
                  <SelectTrigger id="transfer-to">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Checking Account</SelectItem>
                    <SelectItem value="savings">Savings Account</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="credit-card">Credit Card</SelectItem>
                    <SelectItem value="e-wallet">E-Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transfer-description">Description</Label>
              <Input
                id="transfer-description"
                placeholder="Purpose of transfer"
                value={transferForm.description}
                onChange={(e) =>
                  setTransferForm({
                    ...transferForm,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Attach Transfer Receipt</Label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() =>
                  document.getElementById("transfer-receipt-upload")?.click()
                }
              >
                <div className="flex flex-col items-center">
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    Drag & drop your receipt here or{" "}
                    <span className="text-[#0A3D62] font-medium">
                      browse files
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Supports: JPG, PNG, PDF (Max 5MB)
                  </p>
                  {transferForm.receipt && (
                    <p className="text-sm text-green-600 mt-2">
                      File selected: {transferForm.receipt.name}
                    </p>
                  )}
                </div>
                <input
                  id="transfer-receipt-upload"
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={(e) => handleFileUpload(e, "transfer")}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            className="bg-[#0A3D62] hover:bg-[#0A3D62]/80"
            onClick={handleSubmit}
          >
            Add Transaction
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;
