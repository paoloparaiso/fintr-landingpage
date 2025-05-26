import React from "react";
import ApiKeyTester from "./ApiKeyTester";

const SettingsPage = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-[#0A3D62] mb-6">
        Account Settings
      </h2>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium text-[#0A3D62] mb-4">
            API Integrations
          </h3>
          <ApiKeyTester />
        </div>

        <div>
          <h3 className="text-lg font-medium text-[#0A3D62] mb-4">
            General Settings
          </h3>
          <p className="text-gray-500">
            Additional account settings will appear here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
