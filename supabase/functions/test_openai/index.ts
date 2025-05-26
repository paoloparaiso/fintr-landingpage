// Test OpenAI API Connection Edge Function

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const PICA_SECRET_KEY = Deno.env.get("PICA_SECRET_KEY");
    const PICA_OPENAI_CONNECTION_KEY = Deno.env.get(
      "PICA_OPENAI_CONNECTION_KEY",
    );

    if (!PICA_SECRET_KEY || !PICA_OPENAI_CONNECTION_KEY) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Server configuration error: Missing API keys",
          details: {
            PICA_SECRET_KEY: PICA_SECRET_KEY ? "Present" : "Missing",
            PICA_OPENAI_CONNECTION_KEY: PICA_OPENAI_CONNECTION_KEY
              ? "Present"
              : "Missing",
          },
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Call OpenAI API via Pica Passthrough with a simple test message
    const response = await fetch(
      "https://api.picaos.com/v1/passthrough/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-pica-secret": PICA_SECRET_KEY,
          "x-pica-connection-key": PICA_OPENAI_CONNECTION_KEY,
          "x-pica-action-id":
            "conn_mod_def::GDzgi1QfvM4::4OjsWvZhRxmAVuLAuWgfVA",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "user", content: "Hello, is my OpenAI API key working?" },
          ],
          temperature: 0.7,
          n: 1,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({
          success: false,
          error: `OpenAI API error: ${response.status} ${response.statusText}`,
          details: errorText,
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const data = await response.json();

    return new Response(
      JSON.stringify({
        success: true,
        message: "OpenAI API connection successful",
        response: data,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal server error",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
