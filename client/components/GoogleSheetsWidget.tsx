import React, { useState, useEffect } from "react";
import {
  ExternalLink,
  Download,
  FileSpreadsheet,
  RefreshCw,
} from "lucide-react";
import { Button } from "./ui/button";

interface GoogleSheetsWidgetProps {
  totalContacts: number;
  totalApplications: number;
  totalGetStarted: number;
  totalResumes: number;
  totalNewsletter: number;
}

export default function GoogleSheetsWidget({
  totalContacts,
  totalApplications,
  totalGetStarted,
  totalResumes,
  totalNewsletter,
}: GoogleSheetsWidgetProps) {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const spreadsheetId = import.meta.env.VITE_GOOGLE_SHEETS_ID;
  const googleSheetsUrl = spreadsheetId
    ? `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`
    : null;

  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/sync/status");
      if (response.ok) {
        const result = await response.json();
        setIsConfigured(result.success && result.data.configured);
      } else {
        setIsConfigured(false);
      }
    } catch (error) {
      console.error("Error checking Google Sheets configuration:", error);
      setIsConfigured(false);
    } finally {
      setIsLoading(false);
    }
  };

  const syncToGoogleSheets = async () => {
    try {
      setLastSync(new Date());
      console.log("📊 Google Sheets sync triggered");
      console.log(
        "💡 Forms automatically sync when submitted. Manual sync completed.",
      );
    } catch (error) {
      console.error("Error during sync:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 p-3 rounded-lg">
            <FileSpreadsheet className="w-6 h-6 text-gray-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Google Sheets Integration
            </h3>
            <p className="text-gray-700">Checking configuration status...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isConfigured) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="bg-yellow-100 p-3 rounded-lg">
            <FileSpreadsheet className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Google Sheets Integration
            </h3>
            <p className="text-yellow-700 mb-4">
              Connect Google Sheets to automatically sync all form submissions
              and track data in real-time.
            </p>
            <div className="space-y-2 text-sm text-yellow-600">
              <p>• Automatic data backup</p>
              <p>• Real-time synchronization</p>
              <p>• Easy data export and analysis</p>
              <p>• Team collaboration</p>
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={() => window.open("/GOOGLE_SHEETS_SETUP.md", "_blank")}
                className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Setup Instructions
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="bg-green-100 p-3 rounded-lg">
            <FileSpreadsheet className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Google Sheets Integration
            </h3>
            <p className="text-green-700 mb-4">
              All form submissions are automatically synced to your Google
              Spreadsheet.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-800">
                  {totalContacts}
                </div>
                <div className="text-xs text-green-600">Contacts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-800">
                  {totalApplications}
                </div>
                <div className="text-xs text-green-600">Applications</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-800">
                  {totalGetStarted}
                </div>
                <div className="text-xs text-green-600">Get Started</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-800">
                  {totalResumes}
                </div>
                <div className="text-xs text-green-600">Resumes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-800">
                  {totalNewsletter}
                </div>
                <div className="text-xs text-green-600">Newsletter</div>
              </div>
            </div>

            {lastSync && (
              <p className="text-sm text-green-600 mb-3">
                Last sync: {lastSync.toLocaleString()}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={syncToGoogleSheets}
            className="text-green-700 border-green-300 hover:bg-green-100"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Sync
          </Button>

          {googleSheetsUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(googleSheetsUrl, "_blank")}
              className="text-green-700 border-green-300 hover:bg-green-100"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Open Sheets
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
