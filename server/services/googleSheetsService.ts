import { GoogleAuth } from "google-auth-library";
import { sheets_v4, google } from "googleapis";
import path from "path";
import fs from "fs";

interface GoogleSheetsConfig {
  spreadsheetId: string;
  serviceAccountPath: string;
  sheetNames: {
    contacts: string;
    jobApplications: string;
    getStartedRequests: string;
    resumeUploads: string;
    newsletter: string;
  };
}

// Google Sheets configuration
const config: GoogleSheetsConfig = {
  spreadsheetId: process.env.GOOGLE_SHEETS_ID || "",
  serviceAccountPath:
    process.env.GOOGLE_SERVICE_ACCOUNT_PATH ||
    path.join(
      process.cwd(),
      "config",
      process.env.GOOGLE_SERVICE_ACCOUNT_FILE ||
        "asocsemi-470107-fee3e878eb03.json",
    ),
  sheetNames: {
    contacts: "Contacts",
    jobApplications: "Job Applications",
    getStartedRequests: "Get Started Requests",
    resumeUploads: "Resume Uploads",
    newsletter: "Newsletter Subscribers",
  },
};

class ServerGoogleSheetsService {
  private auth: GoogleAuth | null = null;
  private sheets: sheets_v4.Sheets | null = null;
  private initialized = false;

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      console.log(
        "ℹ️ Google Sheets config:",
        JSON.stringify(
          {
            serviceAccountPath: config.serviceAccountPath,
            hasSpreadsheetId: Boolean(config.spreadsheetId),
          },
          null,
          2,
        ),
      );
      // Check if service account file exists
      if (!fs.existsSync(config.serviceAccountPath)) {
        console.warn(
          "📋 Google Sheets service account file not found. Google Sheets integration disabled.",
        );
        this.initialized = false;
        return;
      }

      if (!config.spreadsheetId) {
        console.warn(
          "📋 GOOGLE_SHEETS_ID environment variable not set. Google Sheets integration disabled.",
        );
        this.initialized = false;
        return;
      }

      // Initialize auth with service account
      this.auth = new GoogleAuth({
        keyFile: config.serviceAccountPath,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });

      // Initialize sheets API
      this.sheets = google.sheets({ version: "v4", auth: this.auth });
      this.initialized = true;

      console.log(
        "✅ Google Sheets service initialized with service account authentication",
      );

      // Initialize sheets with headers if they don't exist
      await this.initializeSheets();
    } catch (error) {
      console.error("❌ Failed to initialize Google Sheets service:", error);
      this.initialized = false;
    }
  }

  private async initializeSheets() {
    if (!this.initialized || !this.sheets) return;

    try {
      // Initialize each sheet with headers if they don't exist
      const sheetsToInit = [
        {
          name: config.sheetNames.contacts,
          headers: ["Date", "Name", "Email", "Phone", "Company", "Message"],
        },
        {
          name: config.sheetNames.jobApplications,
          headers: [
            "Date",
            "Full Name",
            "Email",
            "Phone",
            "Position",
            "Experience",
            "Cover Letter",
            "Resume URL",
            "Status",
          ],
        },
        {
          name: config.sheetNames.getStartedRequests,
          headers: [
            "Date",
            "First Name",
            "Last Name",
            "Email",
            "Company",
            "Phone",
            "Job Title",
            "Message",
          ],
        },
        {
          name: config.sheetNames.resumeUploads,
          headers: [
            "Date",
            "Full Name",
            "Email",
            "Phone",
            "Location",
            "Position Interested",
            "Experience Level",
            "Skills",
            "Cover Letter",
            "LinkedIn URL",
            "Portfolio URL",
            "Resume URL",
          ],
        },
        {
          name: config.sheetNames.newsletter,
          headers: ["Date", "Email"],
        },
      ];

      for (const sheetInfo of sheetsToInit) {
        await this.ensureSheetExists(sheetInfo.name, sheetInfo.headers);
      }
    } catch (error) {
      console.error("❌ Error initializing sheets:", error);
    }
  }

  private async ensureSheetExists(sheetName: string, headers: string[]) {
    if (!this.sheets) return;

    try {
      // Check if sheet exists by trying to get its data
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: config.spreadsheetId,
        range: `${sheetName}!A1:Z1`,
      });

      // If the sheet exists but has no headers, add them
      if (!response.data.values || response.data.values.length === 0) {
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: config.spreadsheetId,
          range: `${sheetName}!A1`,
          valueInputOption: "RAW",
          requestBody: {
            values: [headers],
          },
        });
        console.log(`✅ Added headers to sheet: ${sheetName}`);
      }
    } catch (error: any) {
      // If sheet doesn't exist, create it
      if (
        error.code === 400 &&
        error.message.includes("Unable to parse range")
      ) {
        try {
          await this.sheets.spreadsheets.batchUpdate({
            spreadsheetId: config.spreadsheetId,
            requestBody: {
              requests: [
                {
                  addSheet: {
                    properties: {
                      title: sheetName,
                    },
                  },
                },
              ],
            },
          });

          // Add headers to the new sheet
          await this.sheets.spreadsheets.values.update({
            spreadsheetId: config.spreadsheetId,
            range: `${sheetName}!A1`,
            valueInputOption: "RAW",
            requestBody: {
              values: [headers],
            },
          });

          console.log(`✅ Created sheet with headers: ${sheetName}`);
        } catch (createError) {
          console.error(`❌ Error creating sheet ${sheetName}:`, createError);
        }
      } else {
        console.error(`❌ Error checking sheet ${sheetName}:`, error);
      }
    }
  }

  private async appendToSheet(
    sheetName: string,
    values: any[][],
  ): Promise<boolean> {
    if (!this.initialized || !this.sheets) {
      console.warn("📋 Google Sheets service not initialized. Skipping sync.");
      return false;
    }

    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: config.spreadsheetId,
        range: `${sheetName}!A:Z`,
        valueInputOption: "RAW",
        requestBody: {
          values: values,
        },
      });

      console.log(`✅ Successfully synced to Google Sheets: ${sheetName}`);
      return true;
    } catch (error) {
      console.error(`❌ Error syncing to Google Sheets (${sheetName}):`, error);
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
    if (!this.initialized) {
      console.warn("📋 Google Sheets not configured. Skipping contact sync.");
      return false;
    }

    const values = [
      [
        new Date(contactData.created_at).toLocaleString(),
        contactData.name,
        contactData.email,
        contactData.phone || "",
        contactData.company || "",
        contactData.message,
      ],
    ];

    return this.appendToSheet(config.sheetNames.contacts, values);
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
    if (!this.initialized) {
      console.warn(
        "📋 Google Sheets not configured. Skipping job application sync.",
      );
      return false;
    }

    const values = [
      [
        new Date(applicationData.created_at).toLocaleString(),
        applicationData.full_name,
        applicationData.email,
        applicationData.phone,
        applicationData.position,
        applicationData.experience,
        applicationData.cover_letter || "",
        applicationData.resume_url || "",
        applicationData.status,
      ],
    ];

    return this.appendToSheet(config.sheetNames.jobApplications, values);
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
    if (!this.initialized) {
      console.warn(
        "📋 Google Sheets not configured. Skipping get started request sync.",
      );
      return false;
    }

    const values = [
      [
        new Date(requestData.created_at).toLocaleString(),
        requestData.first_name,
        requestData.last_name,
        requestData.email,
        requestData.company || "",
        requestData.phone || "",
        requestData.job_title || "",
        requestData.message || "",
      ],
    ];

    return this.appendToSheet(config.sheetNames.getStartedRequests, values);
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
    if (!this.initialized) {
      console.warn(
        "📋 Google Sheets not configured. Skipping resume upload sync.",
      );
      return false;
    }

    const values = [
      [
        new Date(resumeData.created_at).toLocaleString(),
        resumeData.full_name,
        resumeData.email,
        resumeData.phone || "",
        resumeData.location || "",
        resumeData.position_interested || "",
        resumeData.experience_level || "",
        resumeData.skills || "",
        resumeData.cover_letter || "",
        resumeData.linkedin_url || "",
        resumeData.portfolio_url || "",
        resumeData.resume_url || "",
      ],
    ];

    return this.appendToSheet(config.sheetNames.resumeUploads, values);
  }

  async syncNewsletterSubscription(subscriptionData: {
    email: string;
    subscribed_at: string;
  }): Promise<boolean> {
    if (!this.initialized) {
      console.warn(
        "📋 Google Sheets not configured. Skipping newsletter subscription sync.",
      );
      return false;
    }

    const values = [
      [
        new Date(subscriptionData.subscribed_at).toLocaleString(),
        subscriptionData.email,
      ],
    ];

    return this.appendToSheet(config.sheetNames.newsletter, values);
  }

  isConfigured(): boolean {
    return this.initialized;
  }
}

export const serverGoogleSheetsService = new ServerGoogleSheetsService();
