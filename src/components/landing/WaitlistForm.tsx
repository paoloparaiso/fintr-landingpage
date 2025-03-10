import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";
import { Mail, ArrowRight, Loader2 } from "lucide-react";
import WaitlistSurvey from "./WaitlistSurvey";

interface WaitlistFormProps {
  onSubmit?: (email: string) => Promise<boolean>;
  buttonText?: string;
  placeholderText?: string;
  className?: string;
}

const WaitlistForm = ({
  onSubmit = async (email) => {
    // Mock successful submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return true;
  },
  buttonText = "Join Waitlist",
  placeholderText = "Enter your email",
  className = "",
}: WaitlistFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Redirect to waitlist page directly
      window.location.href = "/waitlist";
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`w-full max-w-md ${className}`}>
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full h-12 px-6 bg-[#0A3D62] hover:bg-[#0A3D62]/80 text-white font-medium transition-colors rounded-md"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>{buttonText}</>
        )}
      </Button>
    </div>
  );
};

export default WaitlistForm;
