/** Quote a CSV cell and keep spreadsheet applications from evaluating input. */
export function csvCell(value: string): string {
  const candidate = value.trimStart();
  const startsWithFormula = /^[=+\-@]/.test(candidate);
  const startsWithControl = (value.length > 0 && value.charCodeAt(0) < 32)
    || (candidate.length > 0 && candidate.charCodeAt(0) < 32);
  const text = startsWithFormula || startsWithControl ? `'${value}` : value;

  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}
