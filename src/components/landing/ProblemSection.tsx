import React from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  DollarSign,
  LineChart,
  HelpCircle,
  TrendingDown,
} from "lucide-react";

interface ProblemItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ProblemSectionProps {
  title?: string;
  subtitle?: string;
  problems?: ProblemItem[];
}

const ProblemSection = ({
  title = "Managing Money Feels So Hard?",
  subtitle = "Have you ever experienced any (or all) of these?",
  problems = [
    {
      title: "I don't know where my money goes",
      description:
        "You want to track your money but don't know where to begin, or it just feels too hard to input every expense.",
      icon: <HelpCircle className="h-12 w-12 text-[#0A3D62]" />,
    },
    {
      title: "Financial advice is too expensive or confusing",
      description:
        "You've asked friends or searched online, but nothing feels right for your situation. Hiring a financial expert? It just feels out of reach.",
      icon: <span className="text-5xl font-bold text-[#0A3D62]">₱</span>,
    },
    {
      title: "I'm not sure if I can afford what I want",
      description:
        "You've made a purchase or plan without fully understanding your financial health, and it caused you problems later on.",
      icon: <TrendingDown className="h-12 w-12 text-[#0A3D62]" />,
    },
  ],
}: ProblemSectionProps) => {
  return (
    <section className="py-8 md:py-12 bg-[#FAF9F6]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-3xl mb-12 md:mb-16 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#0A3D62]">
            {title}
          </h2>
          <p className="text-lg text-[#0A3D62] leading-relaxed">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`${index === 0 ? "bg-[#E9A48C]" : index === 1 ? "bg-[#EACCCD]" : "bg-[#E5DBC9]"} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">{problem.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-[#0A3D62]">
                  {problem.title}
                </h3>
                <p className="text-[#0A3D62]/80">{problem.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Horizontal Divider */}
      <div className="flex justify-center px-4 sm:px-6 lg:px-8 pt-16">
        <div className="w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-[#0A3D62] to-transparent opacity-30"></div>
      </div>
    </section>
  );
};

export default ProblemSection;
