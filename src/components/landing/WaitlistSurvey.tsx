import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Checkbox } from "../ui/checkbox";
import { useToast } from "../ui/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Toaster } from "../ui/toaster";

import { Textarea } from "../ui/textarea";
import { submitWaitlistForm } from "../../lib/database";

interface WaitlistSurveyProps {
  onSubmit?: (data: WaitlistFormData) => Promise<boolean>;
  onBack?: () => void;
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface WaitlistFormData {
  firstName: string;
  lastName: string;
  email: string;
  finance_tracking_method: string[];
  custom_tracking_method?: string;
  finance_app_name?: string;
  money_frustration: string;
  desired_features: string;
  early_access_interest: string;
}

const WaitlistSurvey = ({
  onSubmit = async (data) => {
    try {
      await submitWaitlistForm(data);
      return true;
    } catch (error) {
      console.error("Error submitting waitlist form:", error);
      return false;
    }
  },
  onBack = () => {},
  email = "",
  firstName = "",
  lastName = "",
}: WaitlistSurveyProps) => {
  const [formData, setFormData] = useState<WaitlistFormData>({
    firstName: firstName,
    lastName: lastName,
    email: email,
    finance_tracking_method: [],
    custom_tracking_method: "",
    finance_app_name: "",
    money_frustration: "",
    desired_features: "",
    early_access_interest: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (name: string, value: string) => {
    if (name === "finance_tracking_method") {
      setFormData((prev) => ({ ...prev, [name]: [value] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (
    name: string,
    value: string,
    checked: boolean,
  ) => {
    setFormData((prev) => {
      if (checked) {
        return { ...prev, [name]: value };
      } else {
        return { ...prev, [name]: "" };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation - all fields are required
    if (!formData.firstName || !formData.lastName) {
      toast({
        title: "Missing information",
        description: "Please fill in your first and last name.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.email) {
      toast({
        title: "Missing information",
        description: "Please provide your email address.",
        variant: "destructive",
      });
      return;
    }

    if (
      !formData.finance_tracking_method ||
      formData.finance_tracking_method.length === 0
    ) {
      toast({
        title: "Missing information",
        description: "Please select how you currently track your finances.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.money_frustration.trim()) {
      toast({
        title: "Missing information",
        description:
          "Please tell us what frustrates you most about managing your finances.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.desired_features.trim()) {
      toast({
        title: "Missing information",
        description: "Please tell us what features you want in a finance app.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.early_access_interest) {
      toast({
        title: "Missing information",
        description:
          "Please indicate if you'd like early access to test the app.",
        variant: "destructive",
      });
      return;
    }

    // Additional validation for conditional fields
    if (
      formData.finance_tracking_method.includes("finance_app") &&
      !formData.finance_app_name
    ) {
      toast({
        title: "Missing information",
        description: "Please specify which finance app you use.",
        variant: "destructive",
      });
      return;
    }

    if (
      formData.finance_tracking_method.includes("other_tracking") &&
      !formData.custom_tracking_method
    ) {
      toast({
        title: "Missing information",
        description: "Please specify your tracking method.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare the form data
      const submissionData = {
        ...formData,
        custom_tracking_method: formData.custom_tracking_method || "",
        finance_app_name: formData.finance_app_name || "",
        money_frustration: formData.money_frustration || "",
        desired_features: formData.desired_features || "",
      };

      // Call the onSubmit prop
      const success = await onSubmit(submissionData);

      if (success) {
        setShowThankYou(true);
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

  if (showThankYou) {
    return (
      <div className="w-full min-h-screen overflow-x-hidden bg-[#FAF9F6]">
        <main className="py-10">
          <div className="max-w-2xl mx-auto text-center p-6 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-[#0A3D62] mb-4">
              Thank You for Joining the Waitlist!
            </h2>
            <p className="text-[#0A3D62]/80 mb-4">
              You're awesome! Your input will help us make Fintr better and more
              tailored for you.
            </p>
            <p className="text-[#0A3D62]/80 mb-4">
              We'll email you soon with your exclusive early access details.
              Stay tuned for updates and surprises as we get closer to launch.
            </p>
            <p className="text-[#0A3D62]/80 font-medium mb-8">Talk soon!</p>
            <Button
              onClick={() => (window.location.href = "/")}
              className="bg-[#0A3D62] hover:bg-[#0A3D62]/80 text-white font-medium transition-colors rounded-md px-6 py-2"
            >
              Return to Home
            </Button>
          </div>
        </main>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-[#FAF9F6]">
      <main className="py-10">
        <div className="max-w-2xl mx-auto p-6">
          <div className="mb-6">
            <button
              onClick={onBack}
              className="flex items-center text-[#0A3D62] hover:underline mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </button>
            <h2 className="text-2xl font-bold text-[#0A3D62] mb-2 text-center">
              Be Part of the First Users to Try Fintr
            </h2>
            <p className="text-[#0A3D62]/80 mb-4 text-center">
              Help us shape Fintr by answering a few quick questions.
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
              <Label>How do you currently track your finances?</Label>
              <RadioGroup
                value={formData.finance_tracking_method[0] || ""}
                onValueChange={(value) =>
                  handleRadioChange("finance_tracking_method", value)
                }
                className="space-y-2"
              >
                <div className="flex items-center space-x-2 p-3 border border-gray-200 rounded-md mb-2 hover:bg-gray-50 transition-colors">
                  <RadioGroupItem
                    id="dont_track"
                    value="dont_track"
                    className="h-5 w-5 border-2 border-[#0A3D62] text-[#0A3D62]"
                  />
                  <Label htmlFor="dont_track">I don't track</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border border-gray-200 rounded-md mb-2 hover:bg-gray-50 transition-colors">
                  <RadioGroupItem
                    id="spreadsheet"
                    value="spreadsheet"
                    className="h-5 w-5 border-2 border-[#0A3D62] text-[#0A3D62]"
                  />
                  <Label htmlFor="spreadsheet">
                    Spreadsheet (Excel/Google Sheets)
                  </Label>
                </div>
                <div className="p-3 border border-gray-200 rounded-md mb-2 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      id="finance_app"
                      value="finance_app"
                      className="h-5 w-5 border-2 border-[#0A3D62] text-[#0A3D62]"
                    />
                    <Label htmlFor="finance_app">Finance app</Label>
                  </div>
                  {formData.finance_tracking_method.includes("finance_app") && (
                    <Input
                      id="finance_app_name"
                      name="finance_app_name"
                      value={formData.finance_app_name}
                      onChange={handleChange}
                      placeholder="Which finance app do you use?"
                      className="border-gray-300 mt-2 ml-7 w-[calc(100%-1.75rem)]"
                    />
                  )}
                </div>
                <div className="flex items-center space-x-2 p-3 border border-gray-200 rounded-md mb-2 hover:bg-gray-50 transition-colors">
                  <RadioGroupItem
                    id="banking_app"
                    value="banking_app"
                    className="h-5 w-5 border-2 border-[#0A3D62] text-[#0A3D62]"
                  />
                  <Label htmlFor="banking_app">Banking app</Label>
                </div>
                <div className="p-3 border border-gray-200 rounded-md mb-2 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      id="other_tracking"
                      value="other_tracking"
                      className="h-5 w-5 border-2 border-[#0A3D62] text-[#0A3D62]"
                    />
                    <Label htmlFor="other_tracking">Other</Label>
                  </div>
                  {formData.finance_tracking_method.includes(
                    "other_tracking",
                  ) && (
                    <Input
                      id="custom_tracking_method"
                      name="custom_tracking_method"
                      value={formData.custom_tracking_method}
                      onChange={handleChange}
                      placeholder="Please specify"
                      className="border-gray-300 mt-2 ml-7 w-[calc(100%-1.75rem)]"
                    />
                  )}
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label htmlFor="money_frustration">
                What's your biggest frustration about your money?
              </Label>
              <Textarea
                id="money_frustration"
                name="money_frustration"
                value={formData.money_frustration}
                onChange={handleChange}
                placeholder="Tell us what frustrates you most about managing your finances..."
                className="border-gray-300 min-h-[100px]"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="desired_features">
                What features do you want in a finance development or tracker
                app?
              </Label>
              <Textarea
                id="desired_features"
                name="desired_features"
                value={formData.desired_features}
                onChange={handleChange}
                placeholder="What features would make your financial life easier?"
                className="border-gray-300 min-h-[100px]"
              />
            </div>

            <div className="space-y-3">
              <Label>
                Would you like early access to test the app and give feedback?
              </Label>
              <RadioGroup
                value={formData.early_access_interest}
                onValueChange={(value) =>
                  handleRadioChange("early_access_interest", value)
                }
                className="space-y-2"
              >
                <div className="flex items-center space-x-2 p-3 border border-gray-200 rounded-md mb-2 hover:bg-gray-50 transition-colors">
                  <RadioGroupItem
                    id="early_access_yes"
                    value="yes"
                    className="h-5 w-5 border-2 border-[#0A3D62] text-[#0A3D62]"
                  />
                  <Label htmlFor="early_access_yes">
                    Yes, I'd love to test it!
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border border-gray-200 rounded-md mb-2 hover:bg-gray-50 transition-colors">
                  <RadioGroupItem
                    id="early_access_no"
                    value="no"
                    className="h-5 w-5 border-2 border-[#0A3D62] text-[#0A3D62]"
                  />
                  <Label htmlFor="early_access_no">
                    No, I'll wait for the official launch
                  </Label>
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
      </main>
      <Toaster />
    </div>
  );
};

export default WaitlistSurvey;
