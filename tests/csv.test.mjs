import { test } from "node:test";
import assert from "node:assert/strict";
import { csvCell } from "../src/lib/csv.ts";

test("spreadsheet formula prefixes are exported as text", () => {
  for (const value of ["=1+1", "+1+1", "-1+1", "@SUM(A1:A2)"]) {
    assert.equal(csvCell(value), `'${value}`);
  }
});

test("spaces, Unicode whitespace and controls cannot hide a formula prefix", () => {
  for (const value of ["  =1+1", "\u00a0=1+1", "\ufeff=1+1", "\t=1+1", "\u0000=1+1", " \u0000=1+1"]) {
    assert.equal(csvCell(value), `'${value}`);
  }
});

test("leading line breaks and tabs are protected and quoted where needed", () => {
  assert.equal(csvCell("\tText"), "'\tText");
  assert.equal(csvCell("\n=1+1"), '"\'\n=1+1"');
  assert.equal(csvCell("\r=1+1"), '"\'\r=1+1"');
});

test("formula text containing quotes and delimiters stays in a single CSV cell", () => {
  assert.equal(
    csvCell('=HYPERLINK("https://example.invalid","Click")'),
    '"\'=HYPERLINK(""https://example.invalid"",""Click"")"',
  );
});

test("ordinary text, empty cells and Unicode names retain their content", () => {
  for (const value of ["", "Hamza Dawoud", "Müller & Söhne", "test@example.com", "2026-09-25T12:00:00.000Z"]) {
    assert.equal(csvCell(value), value);
  }
  assert.equal(csvCell('Text, mit "Zitat"'), '"Text, mit ""Zitat"""');
  assert.equal(csvCell("Zeile 1\nZeile 2"), '"Zeile 1\nZeile 2"');
});
