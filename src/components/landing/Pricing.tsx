import React from "react";
import { Check, X } from "lucide-react";
import { Button } from "../ui/button";

interface PricingProps {
  title?: string;
  subtitle?: string;
}

const Pricing = ({
  title = "Pricing",
  subtitle = "Simple, transparent pricing for everyone",
}: PricingProps) => {
  return (
    <section id="pricing" className="py-16 md:py-24 bg-[#FAF9F6]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-3xl mx-auto text-center mb-12">
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

        <div className="max-w-5xl mx-auto">
          <div className="bg-[#f9f7f5] rounded-2xl overflow-hidden shadow-lg">
            <div className="bg-[#0A3D62] text-white p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">Core Features</h3>
              <div className="flex items-center justify-center">
                <span className="text-4xl font-bold">₱250</span>
                <span className="ml-2 text-white/80">one-time payment</span>
              </div>
              <p className="mt-4 text-white/90">
                First 50 customers get FREE access for the core features
              </p>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-lg mb-4 text-[#0A3D62]">
                    What's included:
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-[#0A3D62] mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-[#0A3D62]">Goal Setting</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-[#0A3D62] mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-[#0A3D62]">
                        Expense & Income Tracker
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-[#0A3D62] mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-[#0A3D62]">Loan Tracker</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-[#0A3D62] mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-[#0A3D62]">Budget Tracker</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-[#0A3D62] mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-[#0A3D62]">
                        Basic Chatbot (Limited Prompts)
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-4 text-[#0A3D62]">
                    Coming soon (Premium):
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-[#3D8D7F] mr-2 mt-0.5 flex-shrink-0 font-bold">
                        +
                      </span>
                      <span className="text-[#0A3D62]">
                        Advanced Chatbot Features
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#3D8D7F] mr-2 mt-0.5 flex-shrink-0 font-bold">
                        +
                      </span>
                      <span className="text-[#0A3D62]">
                        AI Agent (Create Tasks Automatically)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#3D8D7F] mr-2 mt-0.5 flex-shrink-0 font-bold">
                        +
                      </span>
                      <span className="text-[#0A3D62]">
                        Receipt Scanner with Image Recognition
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#3D8D7F] mr-2 mt-0.5 flex-shrink-0 font-bold">
                        +
                      </span>
                      <span className="text-[#0A3D62]">
                        Advanced Analytics & Insights
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#3D8D7F] mr-2 mt-0.5 flex-shrink-0 font-bold">
                        +
                      </span>
                      <span className="text-[#0A3D62]">
                        Investment Tracking & Forecasting
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Button
                  className="bg-[#0A3D62] hover:bg-[#0A3D62]/80 text-white rounded-md px-8 py-3 text-lg"
                  onClick={() => (window.location.href = "/auth")}
                >
                  Try Fintr
                </Button>
                <p className="mt-4 text-sm text-[#0A3D62]/70">
                  No credit card required. Get notified when we launch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
