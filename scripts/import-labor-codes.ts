/**
 * import-labor-codes.ts
 * ---------------------
 * Convert a manufacturer's flat-rate CSV chart into data/labor-codes.json.
 *
 * Usage:
 *   npm run import-labor-codes -- <path-to-csv> [output-json-path]
 *   # or directly:
 *   npx tsx scripts/import-labor-codes.ts ./thor-flat-rate.csv
 *
 * The CSV is expected to have a header row with these columns (case-insensitive,
 * extra columns are ignored):
 *
 *   code, description, hours, manufacturer
 *
 * `manufacturer` is optional. Everything is validated; bad rows are skipped and
 * reported. A full run log is written both to the console AND to a .txt file
 * next to this script (import-labor-codes.log.txt) so you have a record of what
 * was imported.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---- tiny logger that fans out to console + a .txt log file --------------------

const logLines: string[] = [];
function log(message: string): void {
  const line = message;
  logLines.push(line);
  // eslint-disable-next-line no-console
  console.log(line);
}

function flushLog(): void {
  const logPath = resolve(__dirname, "import-labor-codes.log.txt");
  const stamp = `Run finished (${logLines.length} log lines)\n`;
  writeFileSync(logPath, logLines.join("\n") + "\n" + stamp, "utf8");
  // eslint-disable-next-line no-console
  console.log(`\nLog written to: ${logPath}`);
}

// ---- minimal CSV parser (handles quoted fields and embedded commas) ------------

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++; // skip the escaped quote
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      // Handle \r\n by only committing on \n or a lone \r.
      if (char === "\r" && next === "\n") continue;
      row.push(field);
      field = "";
      rows.push(row);
      row = [];
    } else {
      field += char;
    }
  }

  // Commit any trailing field/row that didn't end with a newline.
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

// ---- main ----------------------------------------------------------------------

interface LaborCode {
  code: string;
  description: string;
  hours: number;
  manufacturer?: string;
}

function main(): void {
  const [, , csvArg, outArg] = process.argv;

  if (!csvArg) {
    log("ERROR: No CSV file path provided.");
    log("Usage: npm run import-labor-codes -- <path-to-csv> [output-json-path]");
    flushLog();
    process.exit(1);
  }

  const csvPath = resolve(process.cwd(), csvArg);
  const outPath = outArg
    ? resolve(process.cwd(), outArg)
    : resolve(__dirname, "..", "data", "labor-codes.json");

  log(`Reading CSV: ${csvPath}`);

  let raw: string;
  try {
    raw = readFileSync(csvPath, "utf8");
  } catch (err) {
    log(`ERROR: Could not read CSV file: ${(err as Error).message}`);
    flushLog();
    process.exit(1);
    return;
  }

  const rows = parseCsv(raw);
  if (rows.length < 2) {
    log("ERROR: CSV must have a header row and at least one data row.");
    flushLog();
    process.exit(1);
  }

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const idx = {
    code: header.indexOf("code"),
    description: header.indexOf("description"),
    hours: header.indexOf("hours"),
    manufacturer: header.indexOf("manufacturer"),
  };

  if (idx.code === -1 || idx.description === -1 || idx.hours === -1) {
    log(
      `ERROR: CSV header must include 'code', 'description', and 'hours'. Found: ${header.join(
        ", "
      )}`
    );
    flushLog();
    process.exit(1);
  }

  const codes: LaborCode[] = [];
  let skipped = 0;

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i];
    const rowNum = i + 1; // 1-based, accounting for header

    const code = (cells[idx.code] ?? "").trim();
    const description = (cells[idx.description] ?? "").trim();
    const hoursStr = (cells[idx.hours] ?? "").trim();
    const manufacturer =
      idx.manufacturer !== -1 ? (cells[idx.manufacturer] ?? "").trim() : "";

    if (!code || !description || !hoursStr) {
      log(`  SKIP row ${rowNum}: missing code/description/hours.`);
      skipped++;
      continue;
    }

    const hours = Number(hoursStr);
    if (!Number.isFinite(hours) || hours < 0) {
      log(`  SKIP row ${rowNum}: invalid hours value "${hoursStr}".`);
      skipped++;
      continue;
    }

    const entry: LaborCode = { code, description, hours };
    if (manufacturer) entry.manufacturer = manufacturer;
    codes.push(entry);
    log(`  OK   row ${rowNum}: ${code} (${hours}h) — ${description}`);
  }

  writeFileSync(outPath, JSON.stringify(codes, null, 2) + "\n", "utf8");

  log("");
  log("----------------------------------------");
  log(`Imported: ${codes.length} labor code(s)`);
  log(`Skipped:  ${skipped} row(s)`);
  log(`Output:   ${outPath}`);
  log("----------------------------------------");

  flushLog();
}

main();
