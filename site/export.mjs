import fs from "fs";
import path from "path";
import matter from "gray-matter";

const VAULT_ROOT = path.resolve(import.meta.dirname, "..");
const IDEAS_DIR = path.join(VAULT_ROOT, "ideas");
const LIT_DIR = path.join(VAULT_ROOT, "literature");
const OUTPUT = path.join(import.meta.dirname, "data.json");

const WIKILINK_RE = /\[\[([^\]|]+?)(?:\|([^\]]+))?\]\]/g;
const COMPETITION_RE = /[🔴🟡🟢]/;
const COMPETITION_MAP = { "🔴": "competitor", "🟡": "complementary", "🟢": "supporting" };

function slugify(filename) {
  return filename.replace(/\.md$/, "").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
}

function parseFile(filepath) {
  const raw = fs.readFileSync(filepath, "utf-8");
  const { data, content } = matter(raw);
  return { frontmatter: data, content, filename: path.basename(filepath) };
}

function extractWikilinks(text) {
  const links = [];
  let m;
  WIKILINK_RE.lastIndex = 0;
  while ((m = WIKILINK_RE.exec(text)) !== null) {
    links.push({ target: m[1], display: m[2] || m[1] });
  }
  return links;
}

function detectCompetition(text) {
  for (const [emoji, type] of Object.entries(COMPETITION_MAP)) {
    if (text.includes(emoji)) return type;
  }
  return null;
}

function extractSection(content, heading) {
  const re = new RegExp(`^## ${heading}`, "m");
  const match = content.match(re);
  if (!match) return "";
  const start = match.index + match[0].length;
  const nextSection = content.slice(start).match(/^## /m);
  return nextSection ? content.slice(start, start + nextSection.index) : content.slice(start);
}

function parseIdeaNote(filepath) {
  const { frontmatter: fm, content, filename } = parseFile(filepath);
  const id = slugify(filename);

  // Extract related work table wikilinks
  const relatedWork = extractSection(content, "相关工作") || extractSection(content, "Related Work");
  const relatedLinks = extractWikilinks(relatedWork).map((link) => ({
    target: slugify(link.target),
    competition: detectCompetition(relatedWork.slice(
      relatedWork.indexOf(link.target) - 20,
      relatedWork.indexOf(link.target) + link.target.length + 50
    )),
  }));

  // Extract novelty from content
  const noveltyMatch = content.match(/新颖性[：:]\s*.{0,5}(⚠️|✅|❌)\s*(.+?)(?:\s*[|｜])/);
  const novelty = noveltyMatch ? noveltyMatch[2].trim() : null;

  // Extract target venue
  const venueSection = extractSection(content, "目标期刊/会议") || extractSection(content, "Target Venue");
  const venueMatch = venueSection.match(/[-–]\s*(.+)/);
  const targetVenue = venueMatch ? venueMatch[1].trim() : null;

  // Extract research question
  const rqSection = extractSection(content, "研究问题") || extractSection(content, "Research Question");
  const rqMatch = rqSection.match(/>\s*(.+)/);
  const researchQuestion = rqMatch ? rqMatch[1].trim() : null;

  const sections = {
    motivation: extractSection(content, "动机与背景") || extractSection(content, "Motivation") || null,
    innovation: extractSection(content, "核心创新点") || extractSection(content, "Core Innovation") || null,
    approach: extractSection(content, "初步方案") || extractSection(content, "Preliminary Approach") || null,
    feasibility: extractSection(content, "可行性分析") || extractSection(content, "Feasibility") || null,
    experiments: extractSection(content, "预期实验") || extractSection(content, "Expected Experiments") || null,
    nextSteps: extractSection(content, "下一步行动") || extractSection(content, "Next Steps") || null,
    relatedWork: relatedWork || null,
  };

  return {
    id,
    type: "idea",
    title: fm.title || filename.replace(".md", ""),
    status: fm.status || "spark",
    created: fm.created || null,
    updated: fm.updated || null,
    novelty,
    tags: fm.tags || [],
    targetVenue,
    researchQuestion,
    edges: relatedLinks,
    sections,
  };
}

function parseLitNote(filepath) {
  const { frontmatter: fm, content, filename } = parseFile(filepath);
  const id = slugify(filename);

  // Extract summary
  const summarySection = extractSection(content, "一句话总结") || extractSection(content, "One-line Summary");
  const summaryMatch = summarySection.match(/>\s*(.+)/);
  const summary = summaryMatch ? summaryMatch[1].trim() : null;

  // Extract competition marker from metadata section
  const metaSection = extractSection(content, "元信息") || extractSection(content, "Metadata");
  const competition = detectCompetition(metaSection) ||
    detectCompetition(content.split("\n").slice(0, 30).join("\n"));

  // Extract paper URL
  const urlMatch = content.match(/论文链接[：:]\s*(https?:\/\/[^\s]+)/) ||
    content.match(/Paper URL[：:]\s*(https?:\/\/[^\s]+)/);
  const url = urlMatch ? urlMatch[1] : null;

  // Extract related papers (literature-literature edges)
  const relatedSection = extractSection(content, "相关论文") || extractSection(content, "Related Papers");
  const relatedPapers = extractWikilinks(relatedSection).map((link) => ({
    target: slugify(link.target),
  }));

  // Determine which ideas this paper relates to (from tags or content)
  const ideaLinks = [];
  const ideasDir = fs.readdirSync(IDEAS_DIR).filter((f) => f.endsWith(".md"));
  for (const ideaFile of ideasDir) {
    const ideaSlug = slugify(ideaFile);
    if (content.includes(`[[${ideaFile.replace(".md", "")}`)) {
      ideaLinks.push(ideaSlug);
    }
  }

  return {
    id,
    type: "literature",
    title: fm.title || filename.replace(".md", ""),
    author: fm.author || null,
    year: fm.year || null,
    venue: fm.venue || null,
    competition,
    url,
    summary,
    tags: fm.tags || [],
    ideas: ideaLinks,
    edges: relatedPapers,
  };
}

function main() {
  const nodes = [];
  const edges = [];
  const ideaIds = new Set();

  // Parse ideas
  const ideaFiles = fs.readdirSync(IDEAS_DIR).filter((f) => f.endsWith(".md"));
  let researching = 0;
  for (const file of ideaFiles) {
    const node = parseIdeaNote(path.join(IDEAS_DIR, file));
    nodes.push(node);
    ideaIds.add(node.id);
    if (node.status && node.status.includes("调研中") || node.status?.includes("Researching")) researching++;

    // Add idea→literature edges
    for (const link of node.edges) {
      edges.push({
        source: node.id,
        target: link.target,
        type: "idea-literature",
        competition: link.competition,
      });
    }
  }

  // Parse literature
  const litFiles = fs.readdirSync(LIT_DIR).filter((f) => f.endsWith(".md"));
  for (const file of litFiles) {
    const node = parseLitNote(path.join(LIT_DIR, file));
    nodes.push(node);

    // Add literature→literature edges
    for (const link of node.edges) {
      edges.push({
        source: node.id,
        target: link.target,
        type: "literature-literature",
      });
    }
  }

  const data = {
    generated: new Date().toISOString(),
    stats: {
      ideas: ideaFiles.length,
      literature: litFiles.length,
      methods: 0,
      researching,
    },
    nodes: nodes.map(({ edges: _, ...node }) => node),
    edges,
  };

  fs.writeFileSync(OUTPUT, JSON.stringify(data, null, 2));

  // Also write a JS file for direct browser loading (works with file:// protocol)
  const JS_OUTPUT = path.join(import.meta.dirname, "embed-data.js");
  fs.writeFileSync(JS_OUTPUT, `window.__LANDSCAPE_DATA__ = ${JSON.stringify(data)};`);

  console.log(`Exported ${nodes.length} nodes, ${edges.length} edges to ${OUTPUT}`);
}

main();
