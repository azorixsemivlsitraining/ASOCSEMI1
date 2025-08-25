import { RequestHandler } from "express";

export const testSupabaseConnection: RequestHandler = async (req, res) => {
  try {
    // Test Supabase connection by checking environment variables
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    const isConfigured =
      supabaseUrl &&
      supabaseKey &&
      supabaseUrl !== "https://demo.supabase.co" &&
      supabaseKey !==
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";

    res.json({
      success: true,
      message: "Supabase configuration test",
      data: {
        configured: isConfigured,
        supabaseUrl: supabaseUrl || "Not configured",
        hasAnonKey: !!supabaseKey,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Supabase test error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to test Supabase connection",
    });
  }
};
