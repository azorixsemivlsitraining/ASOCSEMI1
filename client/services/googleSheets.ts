/**
 * Google Sheets Integration Service
 * Handles syncing form data to Google Sheets
 */

interface GoogleSheetsConfig {
  spreadsheetId: string;
  apiKey: string;
  sheetNames: {
    contacts: string;
    jobApplications: string;
    getStartedRequests: string;
    resumeUploads: string;
    newsletter: string;
  };
}

// Google Sheets configuration - can be set via environment variables
const config: GoogleSheetsConfig = {
  spreadsheetId: import.meta.env.VITE_GOOGLE_SHEETS_ID || "",
  apiKey: import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || "",
  sheetNames: {
    contacts: "Contacts",
    jobApplications: "Job Applications",
    getStartedRequests: "Get Started Requests",
    resumeUploads: "Resume Uploads",
    newsletter: "Newsletter Subscribers",
  },
};

class GoogleSheetsService {
  private baseUrl = "/api/sync";

  private async isConfigured(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/status`);
      if (response.ok) {
        const result = await response.json();
        return result.success && result.data.configured;
      }
      return false;
    } catch (error) {
      console.error("Error checking Google Sheets configuration:", error);
      return false;
    }
  }

  private async syncToServer(endpoint: string, data: any): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Sync failed: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        console.log(`✅ Successfully synced to Google Sheets: ${endpoint}`);
        return result.synced;
      } else {
        throw new Error(result.error || "Sync failed");
      }
    } catch (error) {
      console.error(`❌ Error syncing to Google Sheets (${endpoint}):`, error);
      return false;
    }
  }

  async syncContact(contactData: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    message: string;
    created_at: string;
  }): Promise<boolean> {
    return this.syncToServer("contact", contactData);
  }

  async syncJobApplication(applicationData: {
    full_name: string;
    email: string;
    phone: string;
    position: string;
    experience: string;
    cover_letter?: string;
    resume_url?: string;
    status: string;
    created_at: string;
  }): Promise<boolean> {
    return this.syncToServer("job-application", applicationData);
  }

  async syncGetStartedRequest(requestData: {
    first_name: string;
    last_name: string;
    email: string;
    company?: string;
    phone?: string;
    job_title?: string;
    message?: string;
    created_at: string;
  }): Promise<boolean> {
    return this.syncToServer("get-started", requestData);
  }

  async syncResumeUpload(resumeData: {
    full_name: string;
    email: string;
    phone?: string;
    location?: string;
    position_interested?: string;
    experience_level?: string;
    skills?: string;
    cover_letter?: string;
    linkedin_url?: string;
    portfolio_url?: string;
    resume_url?: string;
    created_at: string;
  }): Promise<boolean> {
    return this.syncToServer("resume-upload", resumeData);
  }

  async syncNewsletterSubscription(subscriptionData: {
    email: string;
    subscribed_at: string;
  }): Promise<boolean> {
    return this.syncToServer("newsletter", subscriptionData);
  }

  async initializeSheets(): Promise<void> {
    if (!this.isConfigured()) {
      console.warn("Google Sheets not configured. Skipping initialization.");
      return;
    }

    console.log("Google Sheets service initialized");

    // You can add logic here to create header rows if needed
    // This would require the Google Sheets API with write permissions
  }
}

export const googleSheetsService = new GoogleSheetsService();

// Helper function to add Google Sheets sync to existing Supabase operations
export async function withGoogleSheetsSync<T>(
  supabaseOperation: () => Promise<T>,
  syncOperation: () => Promise<boolean>,
): Promise<T> {
  const result = await supabaseOperation();

  // Sync to Google Sheets in the background (don't block the main operation)
  syncOperation().catch((error) => {
    console.error("Background Google Sheets sync failed:", error);
  });

  return result;
}
