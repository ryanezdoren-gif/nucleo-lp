import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.readonly'];

function getAuth() {
  const json = process.env.GOOGLE_CREDENTIALS_JSON;
  if (!json) throw new Error('Falta GOOGLE_CREDENTIALS_JSON');
  const creds = JSON.parse(json);
  const auth = new google.auth.JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: SCOPES,
  });
  return auth;
}

export async function readSheet(tab: string) {
  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;
  const range = `${tab}!A:Z`;
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  const rows = res.data.values || [];
  if (rows.length === 0) return [] as any[];
  const [header, ...data] = rows;
  return data.map(r => Object.fromEntries(header.map((h, i) => [String(h).trim(), r[i] ?? ''])));
}

export async function appendRow(tab: string, row: Record<string, any>) {
  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;
  const values = [Object.values(row)];
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${tab}!A:Z`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values },
  });
}
