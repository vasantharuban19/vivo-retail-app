# Google Sheets Integration Guide
## Vivo TN Retail Activity App

This guide explains how to connect the app to Google Sheets as a backend
(alternative to Firebase).

---

## Step 1 — Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet.
2. Rename it to **"Vivo TN Retail Activity Data"**.
3. In **Sheet1**, add these headers in Row 1:

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| id | branch | date | campaign | submittedBy | budgetAllocated | budgetSpent | remainingBudget | storeDeco_planned | storeDeco_executed | storeDeco_budget | backDrop_planned | backDrop_executed | backDrop_budget | props_planned | props_executed | props_budget | ... |

4. Copy the **Sheet ID** from the URL:
   `https://docs.google.com/spreadsheets/d/**YOUR_SHEET_ID**/edit`

---

## Step 2 — Enable Google Sheets API

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Navigate to **APIs & Services → Library**.
4. Search for **"Google Sheets API"** and click **Enable**.
5. Go to **APIs & Services → Credentials**.
6. Click **Create Credentials → API Key**.
7. Copy the API key.
8. (Recommended) Restrict the key to **Google Sheets API** only.

---

## Step 3 — Make the Sheet Publicly Readable

For reading data without authentication:

1. In your Google Sheet, click **Share**.
2. Change access to **"Anyone with the link → Viewer"**.
3. Click **Done**.

For write access, you need a **Service Account** (see Step 4).

---

## Step 4 — Service Account for Write Access

1. In Google Cloud Console → **APIs & Services → Credentials**.
2. Click **Create Credentials → Service Account**.
3. Fill in name (e.g., `vivo-tn-sheets-writer`) and click **Create**.
4. Download the JSON key file.
5. In your Google Sheet, click **Share** and add the service account email
   (`...@your-project.iam.gserviceaccount.com`) as an **Editor**.

---

## Step 5 — Google Apps Script (Recommended for Write)

The simplest write approach uses a Google Apps Script web app as a proxy:

1. In your Sheet, go to **Extensions → Apps Script**.
2. Paste this script:

```javascript
// Google Apps Script — Vivo TN Activity Collector
const SHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
const SHEET_NAME = "Sheet1";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    
    const row = [
      data.id,
      data.branch,
      data.date,
      data.campaign,
      data.submittedBy,
      data.budgetAllocated,
      data.budgetSpent,
      data.budgetAllocated - data.budgetSpent,
      new Date().toISOString(),
      // Activities
      data.activities.store_deco.planned,
      data.activities.store_deco.executed,
      data.activities.store_deco.budget,
      data.activities.back_drop.planned,
      data.activities.back_drop.executed,
      data.activities.back_drop.budget,
      data.activities.props.planned,
      data.activities.props.executed,
      data.activities.props.budget,
      data.activities.cake.planned,
      data.activities.cake.executed,
      data.activities.cake.budget,
      data.activities.promo.planned,
      data.activities.promo.executed,
      data.activities.promo.budget,
    ];
    
    sheet.appendRow(row);
    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", id: data.id })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const rows  = sheet.getDataRange().getValues();
  const headers = rows[0];
  const data = rows.slice(1).map(row =>
    Object.fromEntries(headers.map((h, i) => [h, row[i]]))
  );
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Click **Deploy → New Deployment**.
4. Select type: **Web App**.
5. Set **"Who has access"** to **Anyone**.
6. Click **Deploy** and copy the **Web App URL**.

---

## Step 6 — Connect to the App

In your `.env.local`, set:

```
REACT_APP_GOOGLE_SHEETS_API_KEY=your_api_key_from_step_2
REACT_APP_GOOGLE_SHEET_ID=your_sheet_id_from_step_1
REACT_APP_SHEETS_WEBAPP_URL=your_apps_script_web_app_url_from_step_5
REACT_APP_USE_FIREBASE=false
```

Then update `src/hooks/useSubmissions.js` to call the Apps Script URL
instead of Firebase when `REACT_APP_USE_FIREBASE=false`.

---

## Sheet Column Reference

| Column | Field              |
|--------|--------------------|
| A      | id                 |
| B      | branch             |
| C      | date               |
| D      | campaign           |
| E      | submittedBy        |
| F      | budgetAllocated    |
| G      | budgetSpent        |
| H      | remainingBudget    |
| I      | timestamp          |
| J–L    | Store Decoration   |
| M–O    | Back Drop          |
| P–R    | Props              |
| S–U    | Cake Cutting       |
| V–X    | Promo Material     |
