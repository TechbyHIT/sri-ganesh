export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  const input = text.replace(/^\uFEFF/, "");
  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    if (quoted) {
      if (char === '"' && input[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') quoted = false;
      else field += char;
      continue;
    }
    if (char === '"') quoted = true;
    else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && input[index + 1] === "\n") index += 1;
      row.push(field);
      field = "";
      if (row.some((cell) => cell.trim())) rows.push(row);
      row = [];
    } else field += char;
  }
  row.push(field);
  if (row.some((cell) => cell.trim())) rows.push(row);
  return rows;
}

export function csvRecords(text: string) {
  const [header, ...body] = parseCsv(text);
  if (!header) return [];
  const keys = header.map((cell) => cell.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_"));
  return body.map((cells, index) => ({
    line: index + 2,
    values: Object.fromEntries(keys.map((key, column) => [key, (cells[column] ?? "").trim()])) as Record<string, string>,
  }));
}

function cell(value: unknown) {
  const text = value === null || value === undefined ? "" : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(header: string[], rows: unknown[][]) {
  return [header, ...rows].map((row) => row.map(cell).join(",")).join("\r\n");
}
