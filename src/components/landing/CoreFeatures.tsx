import React, { useState } from "react";
import {
  ArrowRight,
  Check,
  Wallet,
  PieChart,
  MessageSquare,
  BarChart3,
} from "lucide-react";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface CoreFeatureItem {
  title: string;
  description: string;
  bulletPoints: string[];
  icon: React.ReactNode;
  imageSrc: string;
}

interface CoreFeaturesProps {
  title?: string;
  subtitle?: string;
  features?: CoreFeatureItem[];
}

const CoreFeatures = ({
  title = "Core Features",
  subtitle = "Everything you need to take control of your finances",
  features = [
    {
      title: "Income & Expense Tracker",
      description: "Track all your income sources and expenses in one place.",
      bulletPoints: [
        "Automatically categorize transactions",
        "Connect multiple bank accounts and credit cards",
        "View spending patterns over time",
        "Export reports for tax purposes",
      ],
      icon: <Wallet className="h-6 w-6" />,
      imageSrc:
        "https://images.unsplash.com/photo-1554224155-1696413565d3?w=800&q=80",
    },
    {
      title: "Budget Tracker",
      description: "Create and manage budgets for different categories.",
      bulletPoints: [
        "Set monthly budgets for different spending categories",
        "Get alerts when you're approaching budget limits",
        "Adjust budgets based on historical spending",
        "Compare actual spending to budgeted amounts",
      ],
      icon: <PieChart className="h-6 w-6" />,
      imageSrc:
        "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?w=800&q=80",
    },
    {
      title: "Insights",
      description: "Receive personalized insights about your spending habits.",
      bulletPoints: [
        "AI-powered analysis of your spending patterns",
        "Identify opportunities to save money",
        "Compare your finances to similar households",
        "Weekly and monthly financial health reports",
      ],
      icon: <BarChart3 className="h-6 w-6" />,
      imageSrc:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    },
  ],
}: CoreFeaturesProps) => {
  const [activeFeature, setActiveFeature] = useState<number | null>(0);

  const handleFeatureClick = (index: number) => {
    setActiveFeature(index);
  };

  return (
    <section className="py-8 md:py-12 bg-[#FAF9F6]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-3xl mb-12 md:mb-16 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#0A3D62]">
            {title
              .split(" ")
              .map((word) =>
                word.toLowerCase() === "to" ||
                word.toLowerCase() === "from" ||
                word.toLowerCase() === "at"
                  ? word.toLowerCase()
                  : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
              )
              .join(" ")}
          </h2>
          <p className="text-lg text-[#0A3D62] leading-relaxed">{subtitle}</p>
        </div>

        {/* Feature Navigation Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 overflow-x-auto pb-2">
          {features.map((feature, index) => (
            <button
              key={index}
              onClick={() => handleFeatureClick(index)}
              className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center whitespace-nowrap ${activeFeature === index ? "bg-[#0A3D62] text-white" : "bg-white text-[#0A3D62] border border-[#0A3D62] hover:bg-[#0A3D62]/10"}`}
            >
              <span className="mr-2">{feature.icon}</span>
              {feature.title}
            </button>
          ))}
        </div>

        {/* Feature Details */}
        <AnimatePresence mode="wait">
          {activeFeature !== null && (
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto"
            >
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                  <div className="flex items-center mb-4">
                    <div className="mr-3 text-[#0A3D62] bg-[#f9f7f5] p-3 rounded-full">
                      {features[activeFeature].icon}
                    </div>
                    <h3 className="text-2xl font-bold text-[#0A3D62]">
                      {features[activeFeature].title}
                    </h3>
                  </div>
                  <p className="text-[#0A3D62] mb-6">
                    {features[activeFeature].description}
                  </p>
                  <ul className="space-y-3 mb-6">
                    {features[activeFeature].bulletPoints.map((point, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-[#0A3D62] mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-[#0A3D62]">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="md:w-1/2">
                  <img
                    src={features[activeFeature].imageSrc}
                    alt={features[activeFeature].title}
                    className="rounded-lg w-full h-64 object-cover shadow-md"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CoreFeatures;
