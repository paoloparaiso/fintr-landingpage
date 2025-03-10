import React from "react";
import { Check } from "lucide-react";

interface DashboardFeaturesProps {
  title?: string;
  subtitle?: string;
}

const DashboardFeatures = ({
  title = "Get In-depth Reports via",
  subtitle = "The UTAK Dashboard",
}: DashboardFeaturesProps) => {
  const tabs = ["Sales", "Inventory", "Reports", "Attendance"];
  const features = [
    "Hourly, Daily, Monthly & Custom Time-frame Reports",
    "Viewable Anytime & Anywhere on a Laptop, Desktop, or Mobile Device",
  ];

  return (
    <section className="py-16 md:py-24 bg-[#f9f7f5]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-[#5EB99D]">
            {title}
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-8 text-[#5EB99D]">
            {subtitle}
          </h3>
        </div>

        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-gray-100 rounded-full p-1">
            {tabs.map((tab, index) => (
              <button
                key={index}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${index === 0 ? "bg-[#5EB99D] text-white" : "text-gray-700 hover:text-gray-900"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-8 text-[#5EB99D]">
              Sales Tracking
            </h3>
            <ul className="space-y-6">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 mr-3 mt-1">
                    <Check className="h-5 w-5 text-[#5EB99D]" />
                  </div>
                  <p className="text-[#0A3D62] text-lg">{feature}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
              alt="Dashboard on laptop"
              className="rounded-lg shadow-xl w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardFeatures;
