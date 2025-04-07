import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Play, HelpCircle, FileText, BarChart3, Newspaper } from "lucide-react";

interface HowToUseProps {
  title?: string;
  subtitle?: string;
}

const HowToUse = ({
  title = "Discover Fintr",
  subtitle = "Learn how to make the most of our finance tracking app",
}: HowToUseProps) => {
  const faqs = [
    {
      question: "How do I track my expenses in Fintr?",
      answer:
        "Fintr makes it easy to track expenses. You can manually add transactions, categorize them, and view your spending patterns over time through our intuitive dashboard interface.",
    },
    {
      question: "Is my financial data secure?",
      answer:
        "Yes, we take security very seriously. Fintr uses 256-bit encryption to protect your data. We implement strict security protocols and you can delete your data at any time.",
    },
    {
      question: "How does the AI chatbot work?",
      answer:
        "Our AI chatbot uses natural language processing to understand your financial questions. It can analyze your spending patterns, provide insights, and answer questions about your finances based on the data in your Fintr account.",
    },
    {
      question: "Can I use Fintr if I'm not in the Philippines?",
      answer:
        "Yes! Fintr is designed to work globally. The app supports multiple currencies and can be used by anyone looking to track their finances, regardless of location.",
    },
    {
      question: "How do I set up financial goals?",
      answer:
        "Setting up goals is simple. Navigate to the Goals section, click 'Add Goal', enter your target amount, target date, and other details. Fintr will track your progress and provide insights to help you reach your goals faster.",
    },
    {
      question: "Can I export my financial data?",
      answer:
        "Yes, you can export your financial data in CSV or PDF format from the Reports section. This is useful for tax purposes or if you want to analyze your data in other tools.",
    },
  ];

  const videos = [
    {
      title: "Getting Started with Fintr",
      description:
        "Learn the basics of setting up your account and connecting your financial institutions.",
      thumbnail:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      duration: "3:45",
    },
    {
      title: "Setting Financial Goals",
      description:
        "How to create and track your financial goals for better money management.",
      thumbnail:
        "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=800&q=80",
      duration: "4:20",
    },
    {
      title: "Using the AI Chatbot",
      description:
        "Get the most out of Fintr's AI assistant for personalized financial insights.",
      thumbnail:
        "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&q=80",
      duration: "5:15",
    },
    {
      title: "Scanning Receipts",
      description:
        "Learn how to use the receipt scanner to automatically track expenses.",
      thumbnail:
        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
      duration: "2:50",
    },
  ];

  const quizQuestions = [
    {
      question: "What's the best way to track daily expenses in Fintr?",
      options: [
        "Manually enter each transaction",
        "Use the receipt scanner",
        "Connect your bank accounts",
        "All of the above",
      ],
      correctAnswer: 3,
      explanation:
        "Fintr offers multiple ways to track expenses: manual entry, receipt scanning, and bank connections. The best method depends on your preferences and needs.",
    },
    {
      question: "How can the AI chatbot help with your finances?",
      options: [
        "It can predict lottery numbers",
        "It can analyze spending patterns and suggest savings opportunities",
        "It can automatically pay your bills",
        "It can apply for loans on your behalf",
      ],
      correctAnswer: 1,
      explanation:
        "The AI chatbot analyzes your financial data to identify patterns, suggest savings opportunities, and answer questions about your finances.",
    },
    {
      question: "What happens when you reach a financial goal in Fintr?",
      options: [
        "The app automatically creates a new goal",
        "You receive a notification and can mark it as complete or extend it",
        "Your account is credited with bonus points",
        "The goal disappears from your dashboard",
      ],
      correctAnswer: 1,
      explanation:
        "When you reach a goal, Fintr notifies you and gives you options to mark it complete, extend it, or create a new related goal.",
    },
  ];

  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<number[]>([
    -1, -1, -1,
  ]);
  const [showQuizResults, setShowQuizResults] = useState<boolean>(false);
  const [activeFeature, setActiveFeature] = useState<number>(0);

  const features = [
    {
      title: "Tutorial Videos",
      icon: <Play className="h-5 w-5" />,
      value: "videos",
    },
    {
      title: "FAQs",
      icon: <HelpCircle className="h-5 w-5" />,
      value: "faqs",
    },
    {
      title: "Quick Quiz",
      icon: <FileText className="h-5 w-5" />,
      value: "quiz",
    },
    {
      title: "News About Fintr",
      icon: <Newspaper className="h-5 w-5" />,
      value: "news",
    },
    {
      title: "Work with Fintr",
      icon: <BarChart3 className="h-5 w-5" />,
      value: "careers",
    },
  ];

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...selectedQuizAnswers];
    newAnswers[questionIndex] = answerIndex;
    setSelectedQuizAnswers(newAnswers);
  };

  const checkQuizResults = () => {
    setShowQuizResults(true);
  };

  return (
    <section id="how-to-use" className="py-16 md:py-24 bg-[#FAF9F6]">
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

        <div className="flex flex-wrap justify-center gap-2 mb-12 overflow-x-auto pb-2">
          {features.map((feature, index) => (
            <button
              key={index}
              onClick={() => setActiveFeature(index)}
              className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center whitespace-nowrap ${activeFeature === index ? "bg-[#0A3D62] text-white" : "bg-white text-[#0A3D62] border border-[#0A3D62] hover:bg-[#0A3D62]/10"}`}
            >
              <span className="mr-2">{feature.icon}</span>
              {feature.title}
            </button>
          ))}
        </div>

        <Tabs
          defaultValue="videos"
          value={features[activeFeature].value}
          className="max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TabsList className="hidden">
              <TabsTrigger value="videos">Tutorial Videos</TabsTrigger>
              <TabsTrigger value="faqs">FAQs</TabsTrigger>
              <TabsTrigger value="quiz">Quick Quiz</TabsTrigger>
              <TabsTrigger value="news">News About Fintr</TabsTrigger>
              <TabsTrigger value="careers">Work with Fintr</TabsTrigger>
            </TabsList>

            <TabsContent
              value="videos"
              className="bg-white rounded-lg p-6 shadow-md"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videos.map((video, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/2">
                        <div className="flex items-center mb-4">
                          <div className="mr-3 text-[#0A3D62] bg-[#f9f7f5] p-3 rounded-full">
                            <Play className="h-5 w-5" />
                          </div>
                          <h3 className="text-xl font-bold text-[#0A3D62]">
                            {video.title}
                          </h3>
                        </div>
                        <p className="text-[#0A3D62] mb-6">
                          {video.description}
                        </p>
                        <Button className="bg-[#0A3D62] hover:bg-[#0A3D62]/80 text-white rounded-md px-6 py-2 mt-4">
                          Watch Video <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                      <div className="md:w-1/2 relative">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="rounded-lg w-full h-48 object-cover shadow-md"
                        />
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 text-xs rounded">
                          {video.duration}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-[#0A3D62]/80 rounded-full p-3 cursor-pointer hover:bg-[#0A3D62] transition-colors">
                            <Play className="h-8 w-8 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent
              value="faqs"
              className="bg-white rounded-lg p-6 shadow-md"
            >
              <div className="max-w-4xl mx-auto">
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-[#0A3D62] font-medium text-left hover:bg-[#f9f7f5] px-4 py-2 rounded-lg transition-colors">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-[#0A3D62]/80 bg-[#f9f7f5] p-4 rounded-lg mt-1 mb-2">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </TabsContent>

            <TabsContent
              value="quiz"
              className="bg-white rounded-lg p-6 shadow-md"
            >
              <div className="space-y-8">
                {quizQuestions.map((quiz, qIndex) => (
                  <div
                    key={qIndex}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <h3 className="font-bold text-lg mb-4 text-[#0A3D62]">
                      {quiz.question}
                    </h3>
                    <div className="space-y-2">
                      {quiz.options.map((option, oIndex) => (
                        <div
                          key={oIndex}
                          onClick={() => handleQuizAnswer(qIndex, oIndex)}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedQuizAnswers[qIndex] === oIndex ? "bg-[#0A3D62] text-white" : "bg-gray-100 text-[#0A3D62] hover:bg-gray-200"} ${showQuizResults && oIndex === quiz.correctAnswer ? "ring-2 ring-green-500" : ""}`}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                    {showQuizResults && (
                      <div
                        className={`mt-4 p-3 rounded-lg ${selectedQuizAnswers[qIndex] === quiz.correctAnswer ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        {selectedQuizAnswers[qIndex] === quiz.correctAnswer
                          ? "✓ Correct!"
                          : "✗ Incorrect"}
                        <p className="mt-1 text-sm">{quiz.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}

                {!showQuizResults && (
                  <button
                    onClick={checkQuizResults}
                    className="mt-6 bg-[#0A3D62] hover:bg-[#0A3D62]/80 text-white rounded-md px-6 py-2 w-full"
                  >
                    Check Answers
                  </button>
                )}

                {showQuizResults && (
                  <button
                    onClick={() => {
                      setSelectedQuizAnswers([-1, -1, -1]);
                      setShowQuizResults(false);
                    }}
                    className="mt-6 bg-[#0A3D62] hover:bg-[#0A3D62]/80 text-white rounded-md px-6 py-2 w-full"
                  >
                    Try Again
                  </button>
                )}
              </div>
            </TabsContent>

            <TabsContent
              value="news"
              className="bg-white rounded-lg p-6 shadow-md"
            >
              <div className="space-y-6">
                {[
                  {
                    title: "Fintr Secures Seed Funding",
                    date: "June 15, 2023",
                    description:
                      "Fintr has secured $2.5 million in seed funding to accelerate development of its AI-powered financial management platform.",
                    image:
                      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80",
                  },
                  {
                    title: "New Partnership with Local Banks",
                    date: "August 3, 2023",
                    description:
                      "Fintr announces strategic partnerships with several Philippine banks to enhance financial data integration and user experience.",
                    image:
                      "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80",
                  },
                  {
                    title: "Fintr Named Top Fintech Startup to Watch",
                    date: "October 12, 2023",
                    description:
                      "Industry analysts have named Fintr as one of the top fintech startups to watch in Southeast Asia for 2024.",
                    image:
                      "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&q=80",
                  },
                ].map((news, index) => (
                  <div
                    key={index}
                    className="bg-[#f9f7f5] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <img
                          src={news.image}
                          alt={news.title}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                      <div className="p-6 md:w-2/3">
                        <div className="text-sm text-[#0A3D62]/70 mb-2">
                          {news.date}
                        </div>
                        <h3 className="text-xl font-bold text-[#0A3D62] mb-3">
                          {news.title}
                        </h3>
                        <p className="text-[#0A3D62]/80 mb-4">
                          {news.description}
                        </p>
                        <button className="text-[#0A3D62] font-medium hover:text-[#0A3D62]/80 flex items-center">
                          Read more <ArrowRight className="ml-1 h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent
              value="careers"
              className="bg-white rounded-lg p-6 shadow-md"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    title: "AI Developer",
                    description:
                      "Build and optimize our AI-powered financial assistant",
                    requirements: [
                      "Experience with NLP and machine learning",
                      "Strong Python skills",
                      "Understanding of financial data analysis",
                    ],
                  },
                  {
                    title: "Software Developer",
                    description:
                      "Create beautiful, responsive interfaces for our platform",
                    requirements: [
                      "Experience with React and TypeScript",
                      "Knowledge of modern frontend frameworks",
                      "Understanding of UX/UI principles",
                    ],
                  },
                ].map((job, index) => (
                  <div
                    key={index}
                    className="bg-[#f9f7f5] rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow"
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
            </TabsContent>
          </motion.div>
        </Tabs>
      </div>
    </section>
  );
};

export default HowToUse;
