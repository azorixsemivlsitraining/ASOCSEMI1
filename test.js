import { google } from "googleapis";
import { readFileSync } from "fs";

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_FILE,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

// Append subscriber
async function addSubscriber(email) {
  const date = new Date().toISOString().split("T")[0];

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    range: "Newsletter!A:B", // 👈 Make sure this matches your tab name
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[date, email]],
    },
  });

  console.log(`✅ Added subscriber: ${email}`);
}
