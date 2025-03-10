import React from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Shield,
  Zap,
  Brain,
  TrendingUp,
  Wallet,
} from "lucide-react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature = ({ icon, title, description }: FeatureProps) => {
  return (
    <div className="flex flex-col p-6 rounded-xl transition-all duration-300 hover:bg-white hover:shadow-lg">
      <div className="mb-5 text-[#0A3D62] p-3 bg-white rounded-full inline-block shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-[#0A3D62] capitalize">
        {title
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}
      </h3>
      <p className="text-[#0A3D62] text-sm">{description}</p>
    </div>
  );
};

interface FeaturesGridProps {
  features?: FeatureProps[];
  title?: string;
  subtitle?: string;
}

const FeaturesGrid = ({
  features = [
    {
      icon: <BarChart3 size={20} strokeWidth={1.5} />,
      title: "Smart Tracking",
      description:
        "Automatically categorize and track your expenses with AI-powered insights.",
    },
    {
      icon: <Shield size={20} strokeWidth={1.5} />,
      title: "Secure & Private",
      description:
        "Your financial data is encrypted and never shared with third parties.",
    },
    {
      icon: <Zap size={20} strokeWidth={1.5} />,
      title: "Real-time Updates",
      description:
        "Get instant notifications and updates on your financial status.",
    },
    {
      icon: <Brain size={20} strokeWidth={1.5} />,
      title: "AI Financial Advisor",
      description:
        "Receive personalized recommendations to optimize your spending and saving habits.",
    },
    {
      icon: <TrendingUp size={20} strokeWidth={1.5} />,
      title: "Goal Setting",
      description:
        "Set financial goals and track your progress with visual dashboards.",
    },
    {
      icon: <Wallet size={20} strokeWidth={1.5} />,
      title: "Multi-account Support",
      description:
        "Connect and manage all your financial accounts in one place.",
    },
  ],
  title = "AI-powered financial tools",
  subtitle = "Fintr puts your financial safety at the frontier with intelligent features that help you make better decisions.",
}: FeaturesGridProps) => {
  return (
    <section id="features" className="py-16 md:py-24 lg:py-32 bg-[#F7F2E7]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-3xl mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#0A3D62] capitalize">
            {title
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </h2>
          <p className="text-lg text-[#0A3D62] leading-relaxed">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
