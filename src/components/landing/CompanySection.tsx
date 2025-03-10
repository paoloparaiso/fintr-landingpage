import React from "react";
import { Code, Zap, MessageSquare, BarChart3 } from "lucide-react";

interface CompanySectionProps {
  title?: string;
  subtitle?: string;
}

const CompanySection = ({
  title = "COMPANY",
  subtitle = "Join our team and help us build the future of finance",
}: CompanySectionProps) => {
  const jobOpenings = [
    {
      title: "AI Developer",
      description: "Build and optimize our AI-powered financial assistant",
      requirements: [
        "Experience with NLP and machine learning",
        "Strong Python skills",
        "Understanding of financial data analysis",
      ],
    },
    {
      title: "Software Developer",
      description: "Create beautiful, responsive interfaces for our platform",
      requirements: [
        "Experience with React and TypeScript",
        "Knowledge of modern frontend frameworks",
        "Understanding of UX/UI principles",
      ],
    },
  ];

  const workingPrinciples = [
    {
      title: "Be Honest & Transparent",
      description:
        "We believe in open communication and integrity in everything we do.",
      icon: <MessageSquare className="h-6 w-6" />,
    },
    {
      title: "Have Excellence & Speed",
      description:
        "We strive for high-quality work delivered efficiently and on time.",
      icon: <Zap className="h-6 w-6" />,
    },
    {
      title: "We Leverage AI on Our Daily Work",
      description:
        "We use AI tools to enhance productivity and innovation across all departments.",
      icon: <Code className="h-6 w-6" />,
    },
    {
      title: "We're Output-Based",
      description: "We focus on results and impact rather than hours worked.",
      icon: <BarChart3 className="h-6 w-6" />,
    },
  ];

  return (
    <section id="company" className="py-16 md:py-24 bg-[#F7F2E7]">
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

        {/* Section Navigation */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap justify-center gap-4 overflow-x-auto pb-2">
            <button
              className="px-4 py-2 rounded-full bg-[#0A3D62] text-white flex items-center whitespace-nowrap"
              onClick={() => {
                document.getElementById("ways-of-working").style.display =
                  "block";
                document.getElementById("work-with-fintr").style.display =
                  "none";
              }}
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Ways of Working
            </button>
            <button
              className="px-4 py-2 rounded-full bg-white text-[#0A3D62] border border-[#0A3D62] hover:bg-[#0A3D62]/10 flex items-center whitespace-nowrap"
              onClick={() => {
                document.getElementById("ways-of-working").style.display =
                  "none";
                document.getElementById("work-with-fintr").style.display =
                  "block";
              }}
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              Work with Fintr
            </button>
          </div>
        </div>

        {/* Ways of Working */}
        <div id="ways-of-working" className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {workingPrinciples.map((principle, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow flex items-start"
              >
                <div className="bg-[#0A3D62] p-3 rounded-full mr-4 text-white">
                  {principle.icon}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#0A3D62] mb-2">
                    {principle.title}
                  </h4>
                  <p className="text-[#0A3D62]">{principle.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Job Openings */}
        <div id="work-with-fintr" style={{ display: "none" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {jobOpenings.map((job, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow"
              >
                <h4 className="text-xl font-bold text-[#0A3D62] mb-4">
                  {job.title}
                </h4>
                <p className="text-[#0A3D62] mb-4">{job.description}</p>
                <div className="mb-4">
                  <h5 className="font-semibold text-[#0A3D62] mb-2">
                    Requirements:
                  </h5>
                  <ul className="space-y-2">
                    {job.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-[#0A3D62] mr-2">•</span>
                        <span className="text-[#0A3D62]">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button className="bg-[#0A3D62] hover:bg-[#0A3D62]/80 text-white rounded-md px-6 py-2 mt-4">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanySection;
