import fs from "fs";
import path from "path";

const VAULT_ROOT = path.resolve(import.meta.dirname, "..");
const IDEAS_DIR = path.join(VAULT_ROOT, "ideas");
const LIT_DIR = path.join(VAULT_ROOT, "literature");
const METHODS_DIR = path.join(VAULT_ROOT, "methods");
const ATLAS_DIR = path.join(VAULT_ROOT, "atlas");
const ATTACHMENTS_DIR = path.join(VAULT_ROOT, "attachments");
const WIKILINK_RE = /\[\[([^\]|]+?)(?:\|([^\]]+))?\]\]/g;

const errors = [];
const warnings = [];

function getAllMdFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split("\n")) {
    const kv = line.match(/^(\w[\w\s]*):\s*(.+)$/);
    if (kv) fm[kv[1].trim()] = kv[2].trim().replace(/^["']|["']$/g, "");
  }
  return fm;
}

function resolveWikilinkTarget(target, allFiles) {
  return allFiles.some((f) => f === target);
}

function collectAllNoteNames() {
  const names = [];
  for (const dir of [IDEAS_DIR, LIT_DIR, METHODS_DIR, ATLAS_DIR]) {
    for (const f of getAllMdFiles(dir)) {
      names.push(f.replace(/\.md$/, ""));
    }
  }
  for (const f of fs.readdirSync(ATTACHMENTS_DIR)) {
    names.push(f);
  }
  return names;
}

function extractWikilinks(raw) {
  const links = [];
  let m;
  WIKILINK_RE.lastIndex = 0;
  while ((m = WIKILINK_RE.exec(raw)) !== null) {
    links.push(m[1].replace(/\\$/, ""));
  }
  return links;
}

function checkLitNote(filepath, filename, allNoteNames) {
  const raw = fs.readFileSync(filepath, "utf-8");
  const fm = parseFrontmatter(raw);

  if (Object.keys(fm).length === 0) {
    errors.push(`  ${filename}: invalid or missing frontmatter`);
    return;
  }

  if (!fm.author || fm.author === "—") {
    warnings.push(`  ${filename}: missing author`);
  }
  if (!fm.year) {
    warnings.push(`  ${filename}: missing year`);
  }
  if (!fm.venue) {
    warnings.push(`  ${filename}: missing venue`);
  }

  const urlMatch = raw.match(/Paper URL[：:]\s*(https?:\/\/[^\s]+)/) ||
    raw.match(/论文链接[：:]\s*(https?:\/\/[^\s]+)/);
  if (!urlMatch) {
    warnings.push(`  ${filename}: missing Paper URL`);
  }

  for (const target of extractWikilinks(raw)) {
    if (!resolveWikilinkTarget(target, allNoteNames)) {
      errors.push(`  ${filename}: broken wikilink [[${target}]]`);
    }
  }
}

function checkIdeaNote(filepath, filename, allNoteNames) {
  const raw = fs.readFileSync(filepath, "utf-8");
  const fm = parseFrontmatter(raw);

  if (Object.keys(fm).length === 0) {
    errors.push(`  ${filename}: invalid or missing frontmatter`);
    return;
  }

  if (!fm.status) {
    errors.push(`  ${filename}: missing status in frontmatter`);
  }

  for (const target of extractWikilinks(raw)) {
    if (!resolveWikilinkTarget(target, allNoteNames)) {
      errors.push(`  ${filename}: broken wikilink [[${target}]]`);
    }
  }
}

function checkDashboard() {
  const dashboardPath = path.join(ATLAS_DIR, "Dashboard.md");
  if (!fs.existsSync(dashboardPath)) {
    errors.push("Dashboard.md not found");
    return;
  }

  const raw = fs.readFileSync(dashboardPath, "utf-8");
  const litCount = getAllMdFiles(LIT_DIR).length;

  const targets = extractWikilinks(raw);
  const dashLitCount = new Set(targets).size;

  if (dashLitCount < litCount) {
    warnings.push(
      `  Dashboard references ${dashLitCount} unique links, but literature/ has ${litCount} files`
    );
  }
}

function main() {
  console.log("=== Idea KB Health Check ===\n");

  const allNoteNames = collectAllNoteNames();

  console.log("--- Literature Notes ---");
  const litFiles = getAllMdFiles(LIT_DIR);
  for (const f of litFiles) {
    checkLitNote(path.join(LIT_DIR, f), f, allNoteNames);
  }
  console.log(`  Checked ${litFiles.length} files`);

  console.log("\n--- Idea Notes ---");
  const ideaFiles = getAllMdFiles(IDEAS_DIR);
  for (const f of ideaFiles) {
    checkIdeaNote(path.join(IDEAS_DIR, f), f, allNoteNames);
  }
  console.log(`  Checked ${ideaFiles.length} files`);

  console.log("\n--- Dashboard Sync ---");
  checkDashboard();

  console.log("\n--- Methods Directory ---");
  const methodFiles = getAllMdFiles(METHODS_DIR);
  if (methodFiles.length === 0) {
    warnings.push("  methods/ directory is empty — consider extracting methods from literature");
  }

  console.log("\n=== Results ===");

  if (errors.length === 0 && warnings.length === 0) {
    console.log("All checks passed.");
    return;
  }

  if (errors.length > 0) {
    console.log(`\nERRORS (${errors.length}):`);
    errors.forEach((e) => console.log(e));
  }

  if (warnings.length > 0) {
    console.log(`\nWARNINGS (${warnings.length}):`);
    warnings.forEach((w) => console.log(w));
  }

  process.exit(errors.length > 0 ? 1 : 0);
}

main();
