import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { ArrowLeft, Save, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/use-toast";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock user data
  const [userData, setUserData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Finance enthusiast looking to achieve financial freedom by 2030.",
    financialFreedomDefinition:
      "Having enough passive income to cover my expenses and being able to travel 3 months a year.",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description:
          "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <header className="bg-[#FAF9F6] sticky top-0 z-10 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center text-[#0A3D62] hover:text-[#0A3D62]/80"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </button>
            </div>
            <h1 className="text-xl font-bold text-[#0A3D62]">My Profile</h1>
            <div className="w-24"></div> {/* Empty div for balance */}
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8 max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="bg-[#0A3D62] text-white rounded-full p-8 flex items-center justify-center">
                <User className="h-16 w-16" />
              </div>
              <button className="absolute bottom-0 right-0 bg-[#0A3D62] text-white p-2 rounded-full hover:bg-[#0A3D62]/80">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                </svg>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={userData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={userData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={userData.bio}
                onChange={handleChange}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="financialFreedomDefinition">
                What's your own version of Financial Freedom?
              </Label>
              <Textarea
                id="financialFreedomDefinition"
                name="financialFreedomDefinition"
                value={userData.financialFreedomDefinition}
                onChange={handleChange}
                className="min-h-[100px]"
                placeholder="Describe what financial freedom means to you personally"
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#0A3D62] hover:bg-[#0A3D62]/80"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-[#0A3D62] mb-4">
            Account Settings
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <div>
                <h3 className="font-medium text-[#0A3D62]">Change Password</h3>
                <p className="text-sm text-[#0A3D62]/70">
                  Update your password regularly for security
                </p>
              </div>
              <Button
                variant="outline"
                className="border-[#0A3D62] text-[#0A3D62]"
              >
                Change
              </Button>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <div>
                <h3 className="font-medium text-[#0A3D62]">
                  Two-Factor Authentication
                </h3>
                <p className="text-sm text-[#0A3D62]/70">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Button
                variant="outline"
                className="border-[#0A3D62] text-[#0A3D62]"
              >
                Enable
              </Button>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <div>
                <h3 className="font-medium text-[#0A3D62]">
                  Notification Settings
                </h3>
                <p className="text-sm text-[#0A3D62]/70">
                  Manage how you receive notifications
                </p>
              </div>
              <Button
                variant="outline"
                className="border-[#0A3D62] text-[#0A3D62]"
              >
                Configure
              </Button>
            </div>

            <div className="flex justify-between items-center py-2">
              <div>
                <h3 className="font-medium text-red-600">Delete Account</h3>
                <p className="text-sm text-[#0A3D62]/70">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
