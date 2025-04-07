import React from "react";
import { Linkedin, Mail } from "lucide-react";

interface FooterProps {
  companyName?: string;
  email?: string;
  socialLinks?: {
    linkedin?: string;
  };
}

const Footer = ({
  companyName = "Fintr",
  email = "hello@fintr.ai",
  socialLinks = {
    linkedin: "https://linkedin.com/company/fintrai",
  },
}: FooterProps) => {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Core Features", href: "/#core-features" },
    { name: "What's Next", href: "/whats-next" },
  ];

  const secondNavLinks = [
    { name: "Pricing", href: "/#pricing" },
    { name: "Discover", href: "/discover" },
  ];

  // Reordered navigation links
  const orderedNavLinks = [
    { name: "Core Features", href: "/#core-features" },
    { name: "Pricing", href: "/#pricing" },
    { name: "What's Next", href: "/whats-next" },
    { name: "Discover", href: "/discover" },
  ];

  return (
    <footer className="bg-[#FAF9F6] py-12 md:py-16">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <img
                src="https://raw.githubusercontent.com/paoloparaiso/Fintr/c273332c59168c59539d499b2ee119186af8f88a/Fintr_Logo.png"
                alt="Fintr Logo"
                className="w-14 h-14 object-contain"
              />
            </div>
            <p className="text-[#0A3D62] text-sm max-w-xs mt-4">
              Easily track your income, expenses, loans, budget, and investments
              while getting personalized insights from our AI agent to make
              informed financial decisions.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <h3 className="font-medium text-sm text-[#0A3D62] mb-4 uppercase tracking-wider">
              Navigation
            </h3>
            <div>
              <ul className="space-y-2">
                {orderedNavLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-[#0A3D62] hover:text-[#0A3D62] transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-sm text-[#0A3D62] mb-4 uppercase tracking-wider">
              Connect
            </h3>
            <div className="grid grid-cols-1 gap-y-3 mb-4">
              <a
                href="https://www.facebook.com/people/Fintr/61573370577403/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0A3D62] hover:text-[#0A3D62] transition-colors flex items-center"
                aria-label="Meta (Facebook)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                <span>Meta (Facebook)</span>
              </a>
              <a
                href="https://www.youtube.com/@fintrai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0A3D62] hover:text-[#0A3D62] transition-colors flex items-center"
                aria-label="YouTube"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
                <span>YouTube</span>
              </a>
              <a
                href="https://www.linkedin.com/company/fintrai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0A3D62] hover:text-[#0A3D62] transition-colors flex items-center"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} className="mr-2" />
                <span>LinkedIn</span>
              </a>
            </div>
            {/* Email moved to bottom for better layout balance */}
            {email && (
              <a
                href={`mailto:${email}`}
                className="text-[#0A3D62] hover:text-[#0A3D62] transition-colors flex items-center mt-3"
                aria-label="Email"
              >
                <Mail size={18} className="mr-2" />
                {email}
              </a>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-[#0A3D62]">
            &copy; {currentYear} {companyName}. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="/privacy"
              className="text-xs text-[#0A3D62] hover:text-[#0A3D62] transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-xs text-[#0A3D62] hover:text-[#0A3D62] transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
