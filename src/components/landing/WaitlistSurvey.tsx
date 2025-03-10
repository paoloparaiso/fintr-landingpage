import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useToast } from "../ui/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";

interface WaitlistSurveyProps {
  onSubmit?: (data: WaitlistFormData) => Promise<boolean>;
  onBack?: () => void;
  email?: string;
}

interface WaitlistFormData {
  firstName: string;
  lastName: string;
  email: string;
  expectations: string;
  usageFrequency: string;
  preferredFeatures: string;
  financialGoals: string;
  hearAboutUs: string;
}

const WaitlistSurvey = ({
  onSubmit = async (data) => {
    // Mock successful submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return true;
  },
  onBack = () => {},
  email = "",
}: WaitlistSurveyProps) => {
  const [formData, setFormData] = useState<WaitlistFormData>({
    firstName: "",
    lastName: "",
    email: email,
    expectations: "",
    usageFrequency: "",
    preferredFeatures: "",
    financialGoals: "",
    hearAboutUs: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.firstName || !formData.lastName) {
      toast({
        title: "Missing information",
        description: "Please fill in your first and last name.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await onSubmit(formData);

      if (success) {
        toast({
          title: "Thank you!",
          description:
            "Your responses have been recorded. We'll be in touch soon!",
        });
      } else {
        toast({
          title: "Something went wrong",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF9F6] p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-[#0A3D62] hover:underline mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </button>
        <h2 className="text-2xl font-bold text-[#0A3D62] mb-2">
          Join the Fintr Waitlist
        </h2>
        <p className="text-[#0A3D62]/80">
          Please tell us a bit about yourself and your expectations.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
              className="border-gray-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              className="border-gray-300"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john.doe@example.com"
            className="border-gray-300"
            disabled={!!email}
          />
        </div>

        <div className="space-y-3">
          <Label>What are your expectations from a finance tracker app?</Label>
          <RadioGroup
            value={formData.expectations}
            onValueChange={(value) => handleRadioChange("expectations", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="budget_tracking" id="budget_tracking" />
              <Label htmlFor="budget_tracking">
                Budget tracking and management
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="expense_insights" id="expense_insights" />
              <Label htmlFor="expense_insights">
                Insights into my spending habits
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="financial_goals" id="financial_goals" />
              <Label htmlFor="financial_goals">
                Help achieving financial goals
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="investment_tracking"
                id="investment_tracking"
              />
              <Label htmlFor="investment_tracking">
                Investment tracking and advice
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="debt_management" id="debt_management" />
              <Label htmlFor="debt_management">
                Debt management and reduction
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label>How often would you use a finance tracker app?</Label>
          <RadioGroup
            value={formData.usageFrequency}
            onValueChange={(value) =>
              handleRadioChange("usageFrequency", value)
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="daily" id="daily" />
              <Label htmlFor="daily">Daily</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="weekly" id="weekly" />
              <Label htmlFor="weekly">Weekly</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="monthly" id="monthly" />
              <Label htmlFor="monthly">Monthly</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="occasionally" id="occasionally" />
              <Label htmlFor="occasionally">Occasionally</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label>Which feature would be most important to you?</Label>
          <RadioGroup
            value={formData.preferredFeatures}
            onValueChange={(value) =>
              handleRadioChange("preferredFeatures", value)
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ai_chatbot" id="ai_chatbot" />
              <Label htmlFor="ai_chatbot">
                AI Chatbot for financial advice
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="receipt_scanner" id="receipt_scanner" />
              <Label htmlFor="receipt_scanner">
                Receipt scanner for automatic expense tracking
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="goal_tracking" id="goal_tracking" />
              <Label htmlFor="goal_tracking">Goal setting and tracking</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="budget_alerts" id="budget_alerts" />
              <Label htmlFor="budget_alerts">
                Budget alerts and notifications
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="reports_analytics"
                id="reports_analytics"
              />
              <Label htmlFor="reports_analytics">
                Detailed reports and analytics
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label>What are your primary financial goals?</Label>
          <RadioGroup
            value={formData.financialGoals}
            onValueChange={(value) =>
              handleRadioChange("financialGoals", value)
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="save_money" id="save_money" />
              <Label htmlFor="save_money">Save more money</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="reduce_debt" id="reduce_debt" />
              <Label htmlFor="reduce_debt">Reduce debt</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="invest" id="invest" />
              <Label htmlFor="invest">Start or improve investing</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="budget_better" id="budget_better" />
              <Label htmlFor="budget_better">Budget better</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="financial_freedom"
                id="financial_freedom"
              />
              <Label htmlFor="financial_freedom">
                Achieve financial freedom
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label>How did you hear about Fintr?</Label>
          <RadioGroup
            value={formData.hearAboutUs}
            onValueChange={(value) => handleRadioChange("hearAboutUs", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="social_media" id="social_media" />
              <Label htmlFor="social_media">Social Media</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="friend" id="friend" />
              <Label htmlFor="friend">Friend or colleague</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="search" id="search" />
              <Label htmlFor="search">Search engine</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="blog" id="blog" />
              <Label htmlFor="blog">Blog or article</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other">Other</Label>
            </div>
          </RadioGroup>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-[#0A3D62] hover:bg-[#0A3D62]/80 text-white font-medium transition-colors rounded-md"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </div>
  );
};

export default WaitlistSurvey;
