import { google } from "googleapis";

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.readonly",
];

function getAuth() {
  const json = process.env.GOOGLE_CREDENTIALS_JSON;
  if (!json) throw new Error("Falta GOOGLE_CREDENTIALS_JSON");

  const creds = JSON.parse(json) as {
    client_email: string;
    private_key: string;
  };

  return new google.auth.JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: SCOPES,
  });
}

function requireSpreadsheetId(): string {
  const id = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!id) throw new Error("Falta GOOGLE_SHEETS_SPREADSHEET_ID");
  return id;
}

export async function readSheet(tab: string) {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = requireSpreadsheetId();

  const range = `${tab}!A:Z`;
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });

  const rows = res.data.values ?? [];
  if (rows.length === 0) return [] as Record<string, string>[];

  const [headerRow, ...dataRows] = rows;
  const headers = (headerRow ?? []).map((h) => String(h).trim());

  return dataRows.map((r) =>
    Object.fromEntries(headers.map((h, i) => [h, String(r?.[i] ?? "")]))
  );
}

export async function writeHeaderAwareRow(
  tab: string,
  row: Record<string, any>
) {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = requireSpreadsheetId();

  const headerRes = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${tab}!1:1`,
  });

  const headers = (headerRes.data.values?.[0] ?? []).map((h) =>
    String(h).trim()
  );

  if (headers.length === 0) {
    throw new Error("Debe existir una fila de encabezados en la hoja");
  }

  const values = headers.map((h) => row[h] ?? "");

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${tab}!A:Z`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [values] },
  });
}

export async function upsertRowByKey(
  tab: string,
  keyHeader: string,
  csvValues: string[]
) {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = requireSpreadsheetId();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${tab}!A:Z`,
  });

  const rows = res.data.values ?? [];
  if (rows.length === 0) throw new Error("Hoja vacía");

  const headers = (rows[0] ?? []).map((h) => String(h).trim());
  const idx = headers.indexOf(keyHeader);
  if (idx === -1) {
    throw new Error(`Encabezado clave no encontrado: ${keyHeader}`);
  }

  const keyVal = csvValues[idx] ?? "";

  let foundRowNumber = -1;
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i]?.[idx] ?? "") === String(keyVal)) {
      foundRowNumber = i + 1; // Sheets are 1-indexed
      break;
    }
  }

  const values = headers.map((_, i) => csvValues[i] ?? "");

  if (foundRowNumber === -1) {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${tab}!A:Z`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [values] },
    });
  } else {
    const range = `${tab}!A${foundRowNumber}:Z${foundRowNumber}`;
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [values] },
    });
  }
}
