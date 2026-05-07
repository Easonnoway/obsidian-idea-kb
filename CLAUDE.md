# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

**Idea KB** — An Obsidian vault + Claude Code workflow for academic research idea management. From spark to publication.

**Core workflow**: User provides an idea -> Claude searches literature -> expands the knowledge base with structured notes.

---

## Quick Start

### Prerequisites

- [Obsidian](https://obsidian.md) — open this folder as a vault
- [Claude Code](https://claude.ai/code) — CLI or IDE extension
- **Required skills**: [obsidian-skills](https://github.com/kepano/obsidian-skills)
- **Recommended plugin**: [everything-claude-code](https://github.com/affaan-m/everything-claude-code)
- Recommended MCP tools: **WebSearch** (built-in), **Exa** (`web_search_exa`, `web_fetch_exa`), **Sequential Thinking**

### Setup

1. Open this folder in Obsidian
2. Enable the CSS snippet: Settings -> Appearance -> CSS snippets -> toggle `dashboard`
3. Configure graph view colors by folder path:
   - `path:atlas` -> purple (navigation)
   - `path:ideas` -> orange (ideas)
   - `path:literature` -> blue (papers)
   - `path:methods` -> green (techniques)
4. Start Claude Code in this directory

### First Idea

```
# Tell Claude your idea
"My idea is: using test-time compute to optimize multi-agent communication strategies"

# Claude will:
1. Search arXiv, Google Scholar, top venues for related work
2. Create literature notes in literature/
3. Create/update idea note in ideas/
4. Update Dashboard with stats, competition, timeline
5. Run self-check on all modified files
```

---

## Vault Architecture

```
ideas/          -> One folder per idea (ShortName/)
  {ShortName}/  -> Contains:
    {Full Title}.md          -> Core summary (research question, motivation, innovation, brief approach)
    {ShortName} - Topic.md   -> Deep-dive sub-documents (created on-demand)
literature/     -> Paper reading notes, one per paper (flat)
methods/        -> Research method/technique notes
atlas/          -> Navigation hub: Dashboard, indexes
templates/      -> Templates: Idea, Idea Sub-Document, Literature, Method, Daily Note
attachments/    -> Embedded images and files
```

**Dashboard** (`atlas/Dashboard.md`) is the single source of truth for vault state.

---

## Note Schemas

Every note must conform to its template. On self-check, verify these required fields:

### Idea Note (`ideas/{ShortName}/{Full Title}.md`)
- **YAML**: `title`, `created`, `updated`, `status`, `tags`
- **Required sections**: Research Question, Motivation & Background, Core Innovation, Related Work (brief table), Preliminary Approach (brief), Status & Next Steps, Target Venue, Deep Dives, References
- **Status values** (单选): `Spark` (💡 灵感萌芽) -> `Researching` (🔍 调研中) -> `Writing` (✍️ 写作中) -> `Experimenting` (🧪 实验中) -> `Published` (✅ 已发表) / `Abandoned` (❌ 已放弃)
- **Naming**: Main note keeps its original long title; folder uses short name

### Idea Sub-Document (`ideas/{ShortName}/{ShortName} - *.md`)
- **YAML**: `title`, `created`, `updated`, `parent` (wikilink to main note), `type` ("Idea Sub-Document"), `tags`
- **Required sections**: Overview (3-5 line summary with key takeaways), Content, References
- **Naming**: `{ShortName} - {English Topic Title}.md` (e.g., `CommThink - Benchmark Selection.md`)
- **Auto-created**: When Claude answers a deep question (>50 lines or distinct topic) about an existing idea

### Literature Note (`literature/*.md`)
- **YAML**: `title`, `created`, `updated`, `type` ("Literature Note"), `author`, `year`, `venue`, `tags`
- **Required sections**: Metadata (must include `Paper URL` with a real URL), One-line Summary, Research Question, Core Method, Key Innovations, Limitations, Insights for My Work, Related Papers
- **Competition markers**: direct competitor, complementary, supporting

### Method Note (`methods/*.md`)
- **YAML**: `title`, `created`, `updated`, `type` ("Method Note"), `tags`
- **Required sections**: Overview, Basic Principles, Pros & Cons, Use Cases, Papers Using This Method

---

## Linking Rules

- **Wikilinks only**: `[[filename|display text]]` (Obsidian `useMarkdownLinks: false`)
- **Bidirectional**: If note A lists note B in "Related Papers" or "References", then note B must also reference note A
- **Dashboard indexes**: Every literature note must appear in Dashboard's literature table. Every idea must appear in the active idea section (unless `Abandoned`)
- **Competition table**: Papers directly relevant to an active idea must also appear in Dashboard with competition markers

---

## Idea Lifecycle

```
Spark -> (user provides idea) -> Researching -> (research complete) -> Writing -> Experimenting -> Published
                                                                                             -> Abandoned
```

| Transition | Trigger | Required Actions |
|---|---|---|
| Any -> Researching | User provides new idea or asks for research | Full literature search, create lit notes, competitive analysis, update idea note |
| Researching -> Writing | Research phase complete, user starts writing | Add narrative strategy and experimental design to idea note |
| Writing -> Experimenting | Paper draft done, experiments running | Update idea with results |
| -> Published | Paper accepted | Finalize idea note, update Dashboard |
| -> Abandoned | User decides to drop | Update status, keep note for reference |

---

## Research Workflow

When the user provides a new idea or asks for deeper research:

0. **Determine scope**:
   - New idea: Create folder `ideas/{ShortName}/`, create main note from `Template - Idea.md`
   - Deep question about existing idea (e.g., "how should I design experiments?", "what benchmarks to use?"):
     - If the answer would exceed ~50 lines or represents a distinct research topic → create a sub-document in the idea folder
     - If the answer is brief → update the relevant section in the main note or existing sub-document
1. **Literature search**: Use WebSearch, Exa (`web_search_exa`, `web_fetch_exa`), sequential thinking. Search arXiv, OpenReview, Google Scholar, top venue proceedings (NeurIPS/ICLR/ICML/ACL/EMNLP/AAAI).
2. **Competitive analysis**: Map idea into 2D space (optimization target x method). Verify the cell is unoccupied. Rate novelty honestly — downgrade when competitors found.
3. **Write literature notes**: One file per paper. Use competition markers. Include real paper URLs.
4. **Update idea note**: Update the main note's core sections. For substantial new analysis, create or update a sub-document in the idea folder, then add it to the main note's "Deep Dives" table.
5. **Sync Dashboard + Atlas**: Update Dashboard counts/competition/timeline/literature index. Also update `atlas/Atlas - Ideas.md` and `atlas/Atlas - Literature.md` with new entries.
6. **Regenerate landscape site data**: After ANY modification to files in `ideas/` or `literature/` (create, edit, delete, including sub-folders), immediately run `node site/export.mjs` to regenerate `site/data.json` and `site/embed-data.js`. Do NOT defer this to the end of the session — the website must reflect the latest vault state at all times.

---

## Q&A Mode

When the user is **only asking questions** about existing knowledge base content (e.g. "这篇论文讲了什么", "这个方法是什么意思", "帮我解释一下这段内容"), do **NOT** proactively update knowledge base files, Dashboard, or Atlas indexes. Simply answer the question based on existing notes. Only trigger the full research/self-check workflow when the user explicitly asks to create, update, or expand knowledge base content.

---

## Session Protocol

### Entry (start of session)
- Read `CLAUDE.md` and `atlas/Dashboard.md` to understand current vault state
- Check which ideas are active and their latest status

### Exit (end of session, before responding to user's last message)
Run `node scripts/healthcheck.mjs` to automatically check for frontmatter issues, broken wikilinks, and Dashboard sync problems. Then manually verify:

1. **Sync Atlas indexes** — new ideas/literature MUST also appear in:
   - `atlas/Atlas - Ideas.md` -> add row to the correct status table
   - `atlas/Atlas - Literature.md` -> add row to the literature index table
   - Update `updated` date in both files
2. **Bidirectional links**: For every wikilink `[[B]]` in note A's "Related Papers" section, verify note B's "Related Papers" also contains `[[A]]`. **Method**: for each new/modified note, list all targets in its "Related Papers", then read each target and confirm the back-link exists. Add missing back-links before proceeding.
3. **Sub-document integrity**: For each idea folder:
   - The main note exists and has all required core sections
   - Every sub-document in the folder appears in the main note's "Deep Dives" table
   - Every sub-document's `parent` frontmatter field links to the main note
4. **Mermaid safety**: No angle brackets (`<>`) in Mermaid node labels — use backtick formatting
5. **Orphan detection**: New notes are referenced from at least one other note or Dashboard. Sub-documents are referenced from their parent's "Deep Dives" table.
6. **Update landscape site**: Run `node site/export.mjs` to regenerate `site/data.json`. If the `site/` directory doesn't exist, skip this step.

**Fix any issue found immediately.** Report the self-check result to the user.

---

## Known Pitfalls

| Issue | Cause | Fix |
|---|---|---|
| Mermaid not rendering | Angle brackets `<tag>` in nodes | Replace with backtick formatting |
| Dashboard styles broken | CSS snippet not enabled | Settings -> Appearance -> CSS snippets -> enable `dashboard.css` |
| Broken wikilinks | File renamed or never created | Verify target exists; use exact filename |
| Stale competition assessment | New competitor found | Downgrade novelty honestly, update idea note and Dashboard |
| Empty atlas pages | No Dataview plugin | All tables are manual markdown — update by hand or via Claude |

---

## File Naming

- Literature: `Author Keyword - Short Title.md`
- Ideas: `ShortName/Full Descriptive Title.md` (main note in folder)
- Idea Sub-Documents: `ShortName/ShortName - Topic Title.md`
- Methods: `Method Name.md`

## Obsidian Config

- New files default to `ideas/` folder
- Templates folder: `templates/`
- Daily notes folder: `atlas/`
- Accent color: `#7b6cd9`
