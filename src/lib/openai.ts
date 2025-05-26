// OpenAI integration using Supabase Edge Function
import { createClient } from "@supabase/supabase-js";

export interface ChatMessage {
  role: string;
  content: string;
  name?: string;
}

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");

export async function sendChatMessage(messages: ChatMessage[]) {
  try {
    // Call our Edge Function instead of directly calling OpenAI
    const { data, error } = await supabase.functions.invoke(
      "supabase-functions-openai_chat",
      {
        body: { messages },
      },
    );

    if (error) {
      console.error("Edge function error details:", error);
      throw new Error(`Edge function error: ${error.message}`);
    }

    if (!data || !data.choices || !data.choices[0]) {
      console.error("Unexpected response format:", data);
      throw new Error("Received invalid response from OpenAI");
    }

    return data;
  } catch (error) {
    console.error("Error calling OpenAI Edge Function:", error);
    throw error;
  }
}
