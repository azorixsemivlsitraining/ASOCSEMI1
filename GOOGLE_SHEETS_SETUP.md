# Google Sheets Integration Setup

This guide will help you set up Google Sheets integration to automatically sync form submissions.

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click on it and press "Enable"

## Step 2: Create API Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key
4. (Optional) Restrict the API key to only Google Sheets API for security

## Step 3: Create Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Create the following sheets (tabs) with these exact names:

   - `Contacts`
   - `Job Applications`
   - `Get Started Requests`
   - `Resume Uploads`
   - `Newsletter Subscribers`

4. Add headers to each sheet:

### Contacts Sheet Headers (Row 1):

```
Date | Name | Email | Phone | Company | Message
```

### Job Applications Sheet Headers (Row 1):

```
Date | Full Name | Email | Phone | Position | Experience | Cover Letter | Resume URL | Status
```

### Get Started Requests Sheet Headers (Row 1):

```
Date | First Name | Last Name | Email | Company | Phone | Job Title | Message
```

### Resume Uploads Sheet Headers (Row 1):

```
Date | Full Name | Email | Phone | Location | Position Interested | Experience Level | Skills | Cover Letter | LinkedIn URL | Portfolio URL | Resume URL
```

### Newsletter Subscribers Sheet Headers (Row 1):

```
Date | Email
```

## Step 4: Get Spreadsheet ID

1. Open your Google Spreadsheet
2. Look at the URL: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`
3. Copy the `SPREADSHEET_ID` part -

## Step 5: Configure Environment Variables

Add these to your `.env` file:

```env
VITE_GOOGLE_SHEETS_ID=your_spreadsheet_id_here
VITE_GOOGLE_SHEETS_API_KEY=your_api_key_here
```

## Step 6: Make Spreadsheet Public (Important!)

1. Click "Share" button in your Google Spreadsheet
2. Click "Change to anyone with the link"
3. Set permission to "Editor" (so the API can write to it)
4. Click "Done"

## Step 7: Test the Integration

1. Restart your development server
2. Submit a form on your website
3. Check if the data appears in the corresponding Google Sheet

## Troubleshooting

### Common Issues:

1. **"The caller does not have permission"**

   - Make sure the spreadsheet is shared publicly with "Editor" permissions
   - Verify the API key is correct

2. **"Requested entity was not found"**

   - Check that the spreadsheet ID is correct
   - Ensure the sheet names match exactly (case-sensitive)

3. **"The request is missing a valid API key"**

   - Verify the API key is set in environment variables
   - Make sure you've enabled the Google Sheets API

4. **No data appearing in sheets**
   - Check the browser console for any error messages
   - Verify the sheet names in the spreadsheet match the configuration

## Features

- All form submissions are automatically synced to Google Sheets
- Background sync - doesn't block form submission if Sheets API is down
- Proper error handling and logging
- Data includes timestamps for all submissions

## Data Privacy

- Only form data that users explicitly submit is sent to Google Sheets
- No sensitive authentication data is transmitted
- Sync happens in the background and doesn't affect user experience
