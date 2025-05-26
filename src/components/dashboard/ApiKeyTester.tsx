import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

const ApiKeyTester = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    error?: string;
    details?: any;
  } | null>(null);

  const testApiKey = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-test_openai",
        {},
      );

      if (error) {
        setResult({
          success: false,
          error: `Edge function error: ${error.message}`,
        });
        return;
      }

      setResult(data);
    } catch (err: any) {
      setResult({
        success: false,
        error: "Error testing API key",
        details: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>OpenAI API Key Test</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Test if your OpenAI API key is working correctly by sending a test
            request.
          </p>

          <Button
            onClick={testApiKey}
            disabled={isLoading}
            className="bg-[#0A3D62] hover:bg-[#0A3D62]/80"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              "Test API Key"
            )}
          </Button>

          {result && (
            <div
              className={`mt-4 p-4 rounded-md ${result.success ? "bg-green-50" : "bg-red-50"}`}
            >
              <div className="flex items-start">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                )}
                <div>
                  <h3
                    className={`text-sm font-medium ${result.success ? "text-green-800" : "text-red-800"}`}
                  >
                    {result.success ? "Success" : "Error"}
                  </h3>
                  <div className="mt-2 text-sm">
                    <p
                      className={
                        result.success ? "text-green-700" : "text-red-700"
                      }
                    >
                      {result.message || result.error}
                    </p>
                    {result.details && (
                      <pre className="mt-2 whitespace-pre-wrap text-xs bg-gray-100 p-2 rounded">
                        {typeof result.details === "string"
                          ? result.details
                          : JSON.stringify(result.details, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyTester;
