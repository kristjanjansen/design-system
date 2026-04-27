import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { APCAcontrast, sRGBtoY } from "apca-w3";
import { clampRgb, oklch, rgb, wcagContrast } from "culori";
import { describe, expect, test } from "vite-plus/test";

// --- Color helpers using culori ---

function toOklch(L: number, C: number, H: number) {
  return oklch({ mode: "oklch", l: L, c: C, h: H });
}

function toRgb255(L: number, C: number, H: number): [number, number, number] {
  const c = clampRgb(rgb(toOklch(L, C, H)));
  return [Math.round(c.r * 255), Math.round(c.g * 255), Math.round(c.b * 255)];
}

function oklchWcag(
  fgL: number,
  fgC: number,
  fgH: number,
  bgL: number,
  bgC: number,
  bgH: number,
): number {
  return wcagContrast(toOklch(fgL, fgC, fgH), toOklch(bgL, bgC, bgH));
}

function oklchApca(
  fgL: number,
  fgC: number,
  fgH: number,
  bgL: number,
  bgC: number,
  bgH: number,
): number {
  const fg = toRgb255(fgL, fgC, fgH);
  const bg = toRgb255(bgL, bgC, bgH);
  return Math.abs(Number(APCAcontrast(sRGBtoY(fg), sRGBtoY(bg))));
}

// --- CSS parser ---

type OklchTuple = [number, number, number];

interface ThemeColors {
  fg: OklchTuple;
  "fg-muted": OklchTuple;
  "fg-accent": OklchTuple;
  "fg-error": OklchTuple;
  "fg-success": OklchTuple;
  "fg-warning": OklchTuple;
  bg: OklchTuple;
  "bg-page": OklchTuple;
  "bg-accent": OklchTuple;
  border: OklchTuple;
  outline: OklchTuple;
}

function parseOklch(str: string): OklchTuple {
  const match = str.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/);
  if (!match) throw new Error(`Cannot parse oklch: ${str}`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function parseSingleThemeFile(filePath: string): ThemeColors {
  const css = readFileSync(filePath, "utf-8");
  const names: (keyof ThemeColors)[] = [
    "fg",
    "fg-muted",
    "fg-accent",
    "fg-error",
    "fg-success",
    "fg-warning",
    "bg",
    "bg-page",
    "bg-accent",
    "border",
    "outline",
  ];
  const colors: Record<string, OklchTuple> = {};

  for (const name of names) {
    const re = new RegExp(`--ds-color-${name}:\\s*(oklch\\([^)]+\\))`);
    const match = css.match(re);
    if (match) {
      colors[name] = parseOklch(match[1].trim());
    }
  }

  return colors as ThemeColors;
}

// --- Load themes ---

const themesDir = resolve(import.meta.dirname, "themes");

const themes = [
  { name: "brand1-light", colors: parseSingleThemeFile(`${themesDir}/brand1-light.css`) },
  { name: "brand1-dark", colors: parseSingleThemeFile(`${themesDir}/brand1-dark.css`) },
  { name: "brand2-light", colors: parseSingleThemeFile(`${themesDir}/brand2-light.css`) },
  { name: "brand2-dark", colors: parseSingleThemeFile(`${themesDir}/brand2-dark.css`) },
];

// --- WCAG 2.x thresholds ---
const AA_TEXT = 4.5;
const AA_UI = 3;

// --- APCA thresholds ---
const APCA_BODY = 60;
const APCA_LARGE = 45;
const APCA_UI = 30;

for (const { name, colors } of themes) {
  describe(`${name} contrast`, () => {
    test("fg on page ≥ 4.5:1", () => {
      const ratio = oklchWcag(...colors.fg, ...colors["bg-page"]);
      expect(ratio, `ratio: ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(AA_TEXT);
    });

    test("fg on bg ≥ 4.5:1", () => {
      const ratio = oklchWcag(...colors.fg, ...colors.bg);
      expect(ratio, `ratio: ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(AA_TEXT);
    });

    test("fg-muted on page ≥ 4.5:1", () => {
      const ratio = oklchWcag(...colors["fg-muted"], ...colors["bg-page"]);
      expect(ratio, `ratio: ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(AA_TEXT);
    });

    test("fg-muted on bg ≥ 4.5:1", () => {
      const ratio = oklchWcag(...colors["fg-muted"], ...colors.bg);
      expect(ratio, `ratio: ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(AA_TEXT);
    });

    test("fg-error on page ≥ 4.5:1", () => {
      const ratio = oklchWcag(...colors["fg-error"], ...colors["bg-page"]);
      expect(ratio, `ratio: ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(AA_TEXT);
    });

    test("fg-error on bg ≥ 4.5:1", () => {
      const ratio = oklchWcag(...colors["fg-error"], ...colors.bg);
      expect(ratio, `ratio: ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(AA_TEXT);
    });

    test("fg-success on page ≥ 4.5:1", () => {
      const ratio = oklchWcag(...colors["fg-success"], ...colors["bg-page"]);
      expect(ratio, `ratio: ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(AA_TEXT);
    });

    test("fg-warning on page ≥ 4.5:1", () => {
      const ratio = oklchWcag(...colors["fg-warning"], ...colors["bg-page"]);
      expect(ratio, `ratio: ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(AA_TEXT);
    });

    test("border on page ≥ 1.4:1", () => {
      const ratio = oklchWcag(...colors.border, ...colors["bg-page"]);
      expect(ratio, `ratio: ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(1.4);
    });

    test("border on bg ≥ 1.4:1", () => {
      const ratio = oklchWcag(...colors.border, ...colors.bg);
      expect(ratio, `ratio: ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(1.4);
    });

    test("white on bg-accent ≥ 4.5:1", () => {
      const ratio = oklchWcag(1, 0, 0, ...colors["bg-accent"]);
      expect(ratio, `ratio: ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(AA_TEXT);
    });

    test("outline on page ≥ 3:1", () => {
      const ratio = oklchWcag(...colors.outline, ...colors["bg-page"]);
      expect(ratio, `ratio: ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(AA_UI);
    });
  });

  describe(`${name} APCA`, () => {
    test("fg on page |Lc| ≥ 60", () => {
      const lc = oklchApca(...colors.fg, ...colors["bg-page"]);
      expect(lc, `|Lc|: ${lc.toFixed(1)}`).toBeGreaterThanOrEqual(APCA_BODY);
    });

    test("fg on bg |Lc| ≥ 60", () => {
      const lc = oklchApca(...colors.fg, ...colors.bg);
      expect(lc, `|Lc|: ${lc.toFixed(1)}`).toBeGreaterThanOrEqual(APCA_BODY);
    });

    test("fg-muted on page |Lc| ≥ 45", () => {
      const lc = oklchApca(...colors["fg-muted"], ...colors["bg-page"]);
      expect(lc, `|Lc|: ${lc.toFixed(1)}`).toBeGreaterThanOrEqual(APCA_LARGE);
    });

    test("fg-muted on bg |Lc| ≥ 45", () => {
      const lc = oklchApca(...colors["fg-muted"], ...colors.bg);
      expect(lc, `|Lc|: ${lc.toFixed(1)}`).toBeGreaterThanOrEqual(APCA_LARGE);
    });

    test("fg-error on page |Lc| ≥ 45", () => {
      const lc = oklchApca(...colors["fg-error"], ...colors["bg-page"]);
      expect(lc, `|Lc|: ${lc.toFixed(1)}`).toBeGreaterThanOrEqual(APCA_LARGE);
    });

    test("white on bg-accent |Lc| ≥ 60", () => {
      const lc = oklchApca(1, 0, 0, ...colors["bg-accent"]);
      expect(lc, `|Lc|: ${lc.toFixed(1)}`).toBeGreaterThanOrEqual(APCA_BODY);
    });

    test("outline on page |Lc| ≥ 30", () => {
      const lc = oklchApca(...colors.outline, ...colors["bg-page"]);
      expect(lc, `|Lc|: ${lc.toFixed(1)}`).toBeGreaterThanOrEqual(APCA_UI);
    });
  });
}
