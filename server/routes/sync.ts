import { RequestHandler } from "express";
import { serverGoogleSheetsService } from "../services/googleSheetsService";

// Sync contact form submission to Google Sheets
export const syncContact: RequestHandler = async (req, res) => {
  try {
    const { name, email, phone, company, message, created_at } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: name, email, message",
      });
    }

    const success = await serverGoogleSheetsService.syncContact({
      name,
      email,
      phone,
      company,
      message,
      created_at: created_at || new Date().toISOString(),
    });

    res.json({
      success: true,
      synced: success,
      message: success
        ? "Contact synced to Google Sheets"
        : "Sync attempted but may have failed",
    });
  } catch (error) {
    console.error("Error syncing contact:", error);
    res.status(500).json({
      success: false,
      error: "Failed to sync contact",
    });
  }
};

// Sync job application to Google Sheets
export const syncJobApplication: RequestHandler = async (req, res) => {
  try {
    const {
      full_name,
      email,
      phone,
      position,
      experience,
      cover_letter,
      resume_url,
      status,
      created_at,
    } = req.body;

    if (!full_name || !email || !position) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: full_name, email, position",
      });
    }

    const success = await serverGoogleSheetsService.syncJobApplication({
      full_name,
      email,
      phone,
      position,
      experience,
      cover_letter,
      resume_url,
      status: status || "pending",
      created_at: created_at || new Date().toISOString(),
    });

    res.json({
      success: true,
      synced: success,
      message: success
        ? "Job application synced to Google Sheets"
        : "Sync attempted but may have failed",
    });
  } catch (error) {
    console.error("Error syncing job application:", error);
    res.status(500).json({
      success: false,
      error: "Failed to sync job application",
    });
  }
};

// Sync get started request to Google Sheets
export const syncGetStartedRequest: RequestHandler = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      company,
      phone,
      job_title,
      message,
      created_at,
    } = req.body;

    if (!first_name || !last_name || !email) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: first_name, last_name, email",
      });
    }

    const success = await serverGoogleSheetsService.syncGetStartedRequest({
      first_name,
      last_name,
      email,
      company,
      phone,
      job_title,
      message,
      created_at: created_at || new Date().toISOString(),
    });

    res.json({
      success: true,
      synced: success,
      message: success
        ? "Get started request synced to Google Sheets"
        : "Sync attempted but may have failed",
    });
  } catch (error) {
    console.error("Error syncing get started request:", error);
    res.status(500).json({
      success: false,
      error: "Failed to sync get started request",
    });
  }
};

// Sync resume upload to Google Sheets
export const syncResumeUpload: RequestHandler = async (req, res) => {
  try {
    const {
      full_name,
      email,
      phone,
      location,
      position_interested,
      experience_level,
      skills,
      cover_letter,
      linkedin_url,
      portfolio_url,
      resume_url,
      created_at,
    } = req.body;

    if (!full_name || !email) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: full_name, email",
      });
    }

    const success = await serverGoogleSheetsService.syncResumeUpload({
      full_name,
      email,
      phone,
      location,
      position_interested,
      experience_level,
      skills,
      cover_letter,
      linkedin_url,
      portfolio_url,
      resume_url,
      created_at: created_at || new Date().toISOString(),
    });

    res.json({
      success: true,
      synced: success,
      message: success
        ? "Resume upload synced to Google Sheets"
        : "Sync attempted but may have failed",
    });
  } catch (error) {
    console.error("Error syncing resume upload:", error);
    res.status(500).json({
      success: false,
      error: "Failed to sync resume upload",
    });
  }
};

// Sync newsletter subscription to Google Sheets
export const syncNewsletterSubscription: RequestHandler = async (req, res) => {
  try {
    const { email, subscribed_at } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Missing required field: email",
      });
    }

    const success = await serverGoogleSheetsService.syncNewsletterSubscription({
      email,
      subscribed_at: subscribed_at || new Date().toISOString(),
    });

    res.json({
      success: true,
      synced: success,
      message: success
        ? "Newsletter subscription synced to Google Sheets"
        : "Sync attempted but may have failed",
    });
  } catch (error) {
    console.error("Error syncing newsletter subscription:", error);
    res.status(500).json({
      success: false,
      error: "Failed to sync newsletter subscription",
    });
  }
};

// Get sync status
export const getSyncStatus: RequestHandler = async (req, res) => {
  try {
    const isConfigured = serverGoogleSheetsService.isConfigured();

    res.json({
      success: true,
      data: {
        configured: isConfigured,
        message: isConfigured
          ? "Google Sheets integration is configured and ready"
          : "Google Sheets integration is not configured. Check service account file and spreadsheet ID.",
      },
    });
  } catch (error) {
    console.error("Error getting sync status:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get sync status",
    });
  }
};
