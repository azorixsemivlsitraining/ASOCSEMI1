import { RequestHandler } from "express";
import path from "path";
import fs from "fs";

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), "uploads", "resumes");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Handle resume file downloads
export const downloadResume: RequestHandler = (req, res) => {
  try {
    const { filename } = req.params;

    if (!filename) {
      return res.status(400).json({
        success: false,
        error: "Filename is required",
      });
    }

    const filePath = path.join(uploadsDir, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: "File not found",
      });
    }

    // Set headers for file download
    const stat = fs.statSync(filePath);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", stat.size);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on("error", (error) => {
      console.error("Error streaming file:", error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: "Error reading file",
        });
      }
    });
  } catch (error) {
    console.error("Error downloading resume:", error);
    res.status(500).json({
      success: false,
      error: "Failed to download resume",
    });
  }
};

// Generate resume download URL
export const generateResumeUrl = (filename: string): string => {
  return `/api/files/resume/${filename}`;
};

// Save resume file from upload
export const saveResumeFile = async (
  file: Express.Multer.File,
  applicantName: string,
): Promise<string> => {
  try {
    const fileExt = path.extname(file.originalname) || ".pdf";
    const sanitizedName = applicantName.replace(/[^a-zA-Z0-9]/g, "_");
    const timestamp = Date.now();
    const filename = `${sanitizedName}_${timestamp}${fileExt}`;
    const filePath = path.join(uploadsDir, filename);

    // Copy uploaded file to resumes directory
    await fs.promises.copyFile(file.path, filePath);

    // Clean up temp file
    try {
      await fs.promises.unlink(file.path);
    } catch (cleanupError) {
      console.warn("Failed to cleanup temp file:", cleanupError);
    }

    console.log(`✅ Resume saved: ${filename}`);
    return generateResumeUrl(filename);
  } catch (error) {
    console.error("Error saving resume file:", error);
    throw new Error("Failed to save resume file");
  }
};
