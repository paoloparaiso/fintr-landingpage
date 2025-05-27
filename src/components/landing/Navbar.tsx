import React from "react";
import { Button } from "../ui/button";

interface NavbarProps {
  logoSrc?: string;
  companyName?: string;
}

const Navbar = ({
  logoSrc = "/fintr-logo.png",
  companyName = "Fintr",
}: NavbarProps) => {
  const navLinks = [];

  // Navbar state and logic removed

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#FAF9F6] z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <img
                src="https://raw.githubusercontent.com/paoloparaiso/Fintr/c273332c59168c59539d499b2ee119186af8f88a/Fintr_Logo.png"
                alt="Logo"
                className="h-10 w-auto"
              />
            </a>
          </div>

          <div className="flex items-center">
            <nav className="hidden md:flex items-center space-x-4 mr-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm text-[#0A3D62] hover:text-[#0A3D62] transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>
            <Button
              className="bg-[#0A3D62] hover:bg-[#0A3D62]/80 text-white rounded-md px-6 py-2"
              onClick={() => {
                window.location.href = "/waitlist";
              }}
            >
              Join Waitlist
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
