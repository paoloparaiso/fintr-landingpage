import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useToast } from "../ui/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";

interface AuthPageProps {
  onBack?: () => void;
}

const AuthPage = ({ onBack = () => {} }: AuthPageProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [isLogin, setIsLogin] = useState(true);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock login
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast({
        title: "Login successful",
        description: "Welcome back to Fintr!",
      });
      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Mock registration
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast({
        title: "Registration successful",
        description: "Your account has been created. Welcome to Fintr!",
      });
      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      toast({
        title: "Registration failed",
        description:
          "There was an error creating your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    try {
      // Mock Google sign in
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast({
        title: "Google sign-in successful",
        description: "You've been signed in with your Google account.",
      });
      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      toast({
        title: "Google sign-in failed",
        description:
          "There was an error signing in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF9F6] p-6 rounded-lg shadow-md max-w-md mx-auto">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-[#0A3D62] hover:underline mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </button>
        <h2 className="text-2xl font-bold text-[#0A3D62] mb-2">
          Welcome to Fintr
        </h2>
        <p className="text-[#0A3D62]/80">
          Sign in or create an account to get started
        </p>
      </div>

      <div className="mb-6">
        <Button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 rounded-md py-2 px-4"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </Button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-[#FAF9F6] text-gray-500">
            Or continue with
          </span>
        </div>
      </div>

      {isLogin ? (
        <div>
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                name="email"
                type="email"
                value={loginData.email}
                onChange={handleLoginChange}
                placeholder="john.doe@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="login-password">Password</Label>
                <a href="#" className="text-xs text-[#0A3D62] hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input
                id="login-password"
                name="password"
                type="password"
                value={loginData.password}
                onChange={handleLoginChange}
                placeholder="••••••••"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0A3D62] hover:bg-[#0A3D62]/80"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>

            <p className="text-center text-sm text-[#0A3D62]/70 mt-4">
              Don't have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-[#0A3D62] font-medium hover:underline"
              >
                Sign Up
              </button>
            </p>
          </form>
        </div>
      ) : (
        <div>
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="register-first-name">First Name</Label>
                <Input
                  id="register-first-name"
                  name="firstName"
                  value={registerData.firstName}
                  onChange={handleRegisterChange}
                  placeholder="John"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-last-name">Last Name</Label>
                <Input
                  id="register-last-name"
                  name="lastName"
                  value={registerData.lastName}
                  onChange={handleRegisterChange}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-email">Email</Label>
              <Input
                id="register-email"
                name="email"
                type="email"
                value={registerData.email}
                onChange={handleRegisterChange}
                placeholder="john.doe@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-password">Password</Label>
              <Input
                id="register-password"
                name="password"
                type="password"
                value={registerData.password}
                onChange={handleRegisterChange}
                placeholder="••••••••"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-confirm-password">
                Confirm Password
              </Label>
              <Input
                id="register-confirm-password"
                name="confirmPassword"
                type="password"
                value={registerData.confirmPassword}
                onChange={handleRegisterChange}
                placeholder="••••••••"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0A3D62] hover:bg-[#0A3D62]/80"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Create Account"
              )}
            </Button>

            <p className="text-center text-sm text-[#0A3D62]/70 mt-4">
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-[#0A3D62] font-medium hover:underline"
              >
                Sign In
              </button>
            </p>
          </form>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
