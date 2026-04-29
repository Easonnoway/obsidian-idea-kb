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
ideas/          -> Idea notes, one per idea
literature/     -> Paper reading notes, one per paper
methods/        -> Research method/technique notes
atlas/          -> Navigation hub: Dashboard, indexes
templates/      -> Templates: Idea, Literature, Method, Daily Note
attachments/    -> Embedded images and files
```

**Dashboard** (`atlas/Dashboard.md`) is the single source of truth for vault state.

---

## Note Schemas

Every note must conform to its template. On self-check, verify these required fields:

### Idea Note (`ideas/*.md`)
- **YAML**: `title`, `created`, `updated`, `status`, `tags`
- **Required sections**: Research Question, Motivation & Background, Core Innovation, Related Work, Preliminary Approach, Expected Experiments, Feasibility Analysis, Risks & Mitigations, Target Venue, Next Steps, References
- **Status values**: `Spark` -> `Researching` -> `Writing` -> `Experimenting` -> `Published` / `Abandoned`

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

1. **Literature search**: Use WebSearch, Exa (`web_search_exa`, `web_fetch_exa`), sequential thinking. Search arXiv, OpenReview, Google Scholar, top venue proceedings (NeurIPS/ICLR/ICML/ACL/EMNLP/AAAI).
2. **Competitive analysis**: Map idea into 2D space (optimization target x method). Verify the cell is unoccupied. Rate novelty honestly — downgrade when competitors found.
3. **Write literature notes**: One file per paper. Use competition markers. Include real paper URLs.
4. **Update idea note**: Add competitive landscape, differentiate vs. closest competitors, narrative strategy, experimental design.
5. **Sync Dashboard + Atlas**: Update Dashboard counts/competition/timeline/literature index. Also update `atlas/Atlas - Ideas.md` and `atlas/Atlas - Literature.md` with new entries.

---

## Session Protocol

### Entry (start of session)
- Read `CLAUDE.md` and `atlas/Dashboard.md` to understand current vault state
- Check which ideas are active and their latest status

### Exit (end of session, before responding to user's last message)
Run self-check on **all files modified in this session**:

1. **Frontmatter integrity**: Every modified `.md` has valid YAML matching its template schema
2. **Required fields**: Literature notes have `Paper URL`; idea notes have `status`
3. **Broken wikilinks**: Every `[[Target]]` resolves to an existing file in the vault
4. **Sync Dashboard** (`atlas/Dashboard.md`): Counts, competition table, timeline, risk assessment, literature index
5. **Sync Atlas indexes** — new ideas/literature MUST also appear in:
   - `atlas/Atlas - Ideas.md` -> add row to the correct status table
   - `atlas/Atlas - Literature.md` -> add row to the literature index table
   - Update `updated` date in both files
6. **Bidirectional links**: For every wikilink `[[B]]` in note A's "Related Papers" section, verify note B's "Related Papers" also contains `[[A]]`. **Method**: for each new/modified note, list all targets in its "Related Papers", then read each target and confirm the back-link exists. Add missing back-links before proceeding.
7. **Mermaid safety**: No angle brackets (`<>`) in Mermaid node labels — use backtick formatting
8. **Orphan detection**: New notes are referenced from at least one other note or Dashboard

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
- Ideas: `Full Descriptive Title.md`
- Methods: `Method Name.md`

## Obsidian Config

- New files default to `ideas/` folder
- Templates folder: `templates/`
- Daily notes folder: `atlas/`
- Accent color: `#7b6cd9`
