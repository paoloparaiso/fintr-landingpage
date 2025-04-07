import React, { useState } from "react";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock settings data
  const [settings, setSettings] = useState({
    theme: "light",
    currency: "PHP",
    language: "en",
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    weeklyReports: true,
    monthlyReports: true,
    budgetAlerts: true,
    goalReminders: true,
    transactionAlerts: true,
    marketUpdates: false,
    dataSharing: false,
  });

  const handleSwitchChange = (checked: boolean, name: string) => {
    setSettings((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Settings updated",
        description: "Your settings have been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description:
          "There was an error updating your settings. Please try again.",
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
            <h1 className="text-xl font-bold text-[#0A3D62]">Settings</h1>
            <div className="w-24"></div> {/* Empty div for balance */}
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8 max-w-3xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-[#0A3D62] mb-4">
              General Settings
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={settings.theme}
                    onValueChange={(value) =>
                      handleSelectChange(value, "theme")
                    }
                  >
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System Default</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={settings.currency}
                    onValueChange={(value) =>
                      handleSelectChange(value, "currency")
                    }
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PHP">Philippine Peso (₱)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                      <SelectItem value="GBP">British Pound (£)</SelectItem>
                      <SelectItem value="JPY">Japanese Yen (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) =>
                    handleSelectChange(value, "language")
                  }
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fil">Filipino</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-[#0A3D62] mb-4">
              Notification Settings
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div>
                  <h3 className="font-medium text-[#0A3D62]">
                    Email Notifications
                  </h3>
                  <p className="text-sm text-[#0A3D62]/70">
                    Receive updates via email
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) =>
                    handleSwitchChange(checked, "emailNotifications")
                  }
                />
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div>
                  <h3 className="font-medium text-[#0A3D62]">
                    Push Notifications
                  </h3>
                  <p className="text-sm text-[#0A3D62]/70">
                    Receive notifications in your browser
                  </p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) =>
                    handleSwitchChange(checked, "pushNotifications")
                  }
                />
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div>
                  <h3 className="font-medium text-[#0A3D62]">
                    SMS Notifications
                  </h3>
                  <p className="text-sm text-[#0A3D62]/70">
                    Receive text messages for important alerts
                  </p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) =>
                    handleSwitchChange(checked, "smsNotifications")
                  }
                />
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div>
                  <h3 className="font-medium text-[#0A3D62]">Weekly Reports</h3>
                  <p className="text-sm text-[#0A3D62]/70">
                    Receive weekly financial summaries
                  </p>
                </div>
                <Switch
                  checked={settings.weeklyReports}
                  onCheckedChange={(checked) =>
                    handleSwitchChange(checked, "weeklyReports")
                  }
                />
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div>
                  <h3 className="font-medium text-[#0A3D62]">
                    Monthly Reports
                  </h3>
                  <p className="text-sm text-[#0A3D62]/70">
                    Receive monthly financial summaries
                  </p>
                </div>
                <Switch
                  checked={settings.monthlyReports}
                  onCheckedChange={(checked) =>
                    handleSwitchChange(checked, "monthlyReports")
                  }
                />
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div>
                  <h3 className="font-medium text-[#0A3D62]">Budget Alerts</h3>
                  <p className="text-sm text-[#0A3D62]/70">
                    Get notified when approaching budget limits
                  </p>
                </div>
                <Switch
                  checked={settings.budgetAlerts}
                  onCheckedChange={(checked) =>
                    handleSwitchChange(checked, "budgetAlerts")
                  }
                />
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div>
                  <h3 className="font-medium text-[#0A3D62]">Goal Reminders</h3>
                  <p className="text-sm text-[#0A3D62]/70">
                    Get reminders about your financial goals
                  </p>
                </div>
                <Switch
                  checked={settings.goalReminders}
                  onCheckedChange={(checked) =>
                    handleSwitchChange(checked, "goalReminders")
                  }
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="font-medium text-[#0A3D62]">
                    Transaction Alerts
                  </h3>
                  <p className="text-sm text-[#0A3D62]/70">
                    Get notified about new transactions
                  </p>
                </div>
                <Switch
                  checked={settings.transactionAlerts}
                  onCheckedChange={(checked) =>
                    handleSwitchChange(checked, "transactionAlerts")
                  }
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-[#0A3D62] mb-4">
              Privacy Settings
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div>
                  <h3 className="font-medium text-[#0A3D62]">Data Sharing</h3>
                  <p className="text-sm text-[#0A3D62]/70">
                    Allow anonymous data sharing to improve our services
                  </p>
                </div>
                <Switch
                  checked={settings.dataSharing}
                  onCheckedChange={(checked) =>
                    handleSwitchChange(checked, "dataSharing")
                  }
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="font-medium text-[#0A3D62]">Market Updates</h3>
                  <p className="text-sm text-[#0A3D62]/70">
                    Receive updates about market trends and news
                  </p>
                </div>
                <Switch
                  checked={settings.marketUpdates}
                  onCheckedChange={(checked) =>
                    handleSwitchChange(checked, "marketUpdates")
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
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
                  <Save className="mr-2 h-4 w-4" /> Save Settings
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
