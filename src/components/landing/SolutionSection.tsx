import React from "react";
import { motion } from "framer-motion";
import { LineChart, MessageSquare, BarChart3 } from "lucide-react";

interface SolutionItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface SolutionSectionProps {
  title?: string;
  subtitle?: string;
  solutions?: SolutionItem[];
}

const SolutionSection = ({
  title = "Your Own Personal Finance Development Assistant",
  subtitle = "How Fintr helps you take control of your finances",
  solutions = [
    {
      title: "Track Your Money",
      description:
        "Easily track your money to understand your financial health",
      icon: <LineChart className="h-8 w-8" />,
    },
    {
      title: "Get Personalized Answers",
      description: "Answer your money questions based on your own data",
      icon: <MessageSquare className="h-8 w-8" />,
    },
    {
      title: "Compare Financial Options",
      description: "Compare financial options and choose what's best for you",
      icon: <BarChart3 className="h-8 w-8" />,
    },
  ],
}: SolutionSectionProps) => {
  return (
    <section className="py-8 md:py-12 bg-[#FAF9F6] text-[#0A3D62]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-3xl mb-12 md:mb-16 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-lg leading-relaxed text-[#0A3D62]/80">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`${index === 0 ? "bg-[#E7EEF7]" : index === 1 ? "bg-[#CAC8DA]" : "bg-[#BFD3CD]"} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-white/80 p-4 rounded-full mb-4">
                  {solution.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{solution.title}</h3>
                <p className="text-[#0A3D62]/70">{solution.description}</p>
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

export default SolutionSection;
