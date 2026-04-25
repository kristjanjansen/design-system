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

type ColorName = "fg" | "muted" | "error" | "border" | "bg" | "page" | "accent" | "outline";
type ThemeColors = Record<ColorName, [number, number, number]>;

function parseOklch(str: string): [number, number, number] {
  const match = str.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/);
  if (!match) throw new Error(`Cannot parse oklch: ${str}`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function parseThemeFile(filePath: string): { light: ThemeColors; dark: ThemeColors } {
  const css = readFileSync(filePath, "utf-8");
  const names: ColorName[] = ["fg", "muted", "error", "border", "bg", "page", "accent", "outline"];
  const light: Record<string, [number, number, number]> = {};
  const dark: Record<string, [number, number, number]> = {};

  for (const name of names) {
    const re = new RegExp(
      `--ds-color-${name}:\\s*light-dark\\(\\s*(oklch\\([^)]+\\))\\s*,\\s*(oklch\\([^)]+\\))\\s*\\)`,
    );
    const match = css.match(re);
    if (match) {
      light[name] = parseOklch(match[1].trim());
      dark[name] = parseOklch(match[2].trim());
    }
  }

  return { light: light as ThemeColors, dark: dark as ThemeColors };
}

// --- Load themes ---

const brand1 = parseThemeFile(resolve(import.meta.dirname, "themes/brand1.css"));
const brand2 = parseThemeFile(resolve(import.meta.dirname, "themes/brand2.css"));

const themes = [
  { name: "brand1-light", colors: brand1.light },
  { name: "brand1-dark", colors: brand1.dark },
  { name: "brand2-light", colors: brand2.light },
  { name: "brand2-dark", colors: brand2.dark },
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
      const ratio = oklchWcag(...colors.fg, ...colors.page);
      expect(ratio, `ratio: ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(AA_TEXT);
    });

    test("fg on bg ≥ 4.5:1", () => {
      const ratio = oklchWcag(...colors.fg, ...colors.bg);
      expect(ratio, `ratio: ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(AA_TEXT);
    });

    test("muted on page ≥ 4.5:1", () => {
      const ratio = oklchWcag(...colors.muted, ...colors.page);
      expect(ratio, `ratio: ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(AA_TEXT);
    });

    test("muted on bg ≥ 4.5:1", () => {
      const ratio = oklchWcag(...colors.muted, ...colors.bg);
      expect(ratio, `ratio: ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(AA_TEXT);
    });

    test("error on page ≥ 4.5:1", () => {
      const ratio = oklchWcag(...colors.error, ...colors.page);
      expect(ratio, `ratio: ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(AA_TEXT);
    });

    test("error on bg ≥ 4.5:1", () => {
      const ratio = oklchWcag(...colors.error, ...colors.bg);
      expect(ratio, `ratio: ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(AA_TEXT);
    });

    // Borders are supplementary (labels provide primary identification). WCAG 1.4.11 exempt.
    test("border on page ≥ 1.4:1", () => {
      const ratio = oklchWcag(...colors.border, ...colors.page);
      expect(ratio, `ratio: ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(1.4);
    });

    test("border on bg ≥ 1.4:1", () => {
      const ratio = oklchWcag(...colors.border, ...colors.bg);
      expect(ratio, `ratio: ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(1.4);
    });

    test("white on accent ≥ 4.5:1", () => {
      const ratio = oklchWcag(1, 0, 0, ...colors.accent);
      expect(ratio, `ratio: ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(AA_TEXT);
    });

    test("outline on page ≥ 3:1", () => {
      const ratio = oklchWcag(...colors.outline, ...colors.page);
      expect(ratio, `ratio: ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(AA_UI);
    });
  });

  describe(`${name} APCA`, () => {
    test("fg on page |Lc| ≥ 60", () => {
      const lc = oklchApca(...colors.fg, ...colors.page);
      expect(lc, `|Lc|: ${lc.toFixed(1)}`).toBeGreaterThanOrEqual(APCA_BODY);
    });

    test("fg on bg |Lc| ≥ 60", () => {
      const lc = oklchApca(...colors.fg, ...colors.bg);
      expect(lc, `|Lc|: ${lc.toFixed(1)}`).toBeGreaterThanOrEqual(APCA_BODY);
    });

    test("muted on page |Lc| ≥ 45", () => {
      const lc = oklchApca(...colors.muted, ...colors.page);
      expect(lc, `|Lc|: ${lc.toFixed(1)}`).toBeGreaterThanOrEqual(APCA_LARGE);
    });

    test("muted on bg |Lc| ≥ 45", () => {
      const lc = oklchApca(...colors.muted, ...colors.bg);
      expect(lc, `|Lc|: ${lc.toFixed(1)}`).toBeGreaterThanOrEqual(APCA_LARGE);
    });

    test("error on page |Lc| ≥ 45", () => {
      const lc = oklchApca(...colors.error, ...colors.page);
      expect(lc, `|Lc|: ${lc.toFixed(1)}`).toBeGreaterThanOrEqual(APCA_LARGE);
    });

    test("white on accent |Lc| ≥ 60", () => {
      const lc = oklchApca(1, 0, 0, ...colors.accent);
      expect(lc, `|Lc|: ${lc.toFixed(1)}`).toBeGreaterThanOrEqual(APCA_BODY);
    });

    test("outline on page |Lc| ≥ 30", () => {
      const lc = oklchApca(...colors.outline, ...colors.page);
      expect(lc, `|Lc|: ${lc.toFixed(1)}`).toBeGreaterThanOrEqual(APCA_UI);
    });
  });
}
