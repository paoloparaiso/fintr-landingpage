import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";
import { Mail, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import WaitlistSurvey from "./WaitlistSurvey";

interface WaitlistFormProps {
  onSubmit?: (email: string) => Promise<boolean>;
  buttonText?: string;
  placeholderText?: string;
  className?: string;
  redirectTo?: string;
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
  redirectTo = "/waitlist",
}: WaitlistFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Use React Router navigation instead of window.location
      navigate(redirectTo);
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
        className="bg-[#0A3D62] hover:bg-[#0A3D62]/80 text-white rounded-md px-6 py-2"
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
