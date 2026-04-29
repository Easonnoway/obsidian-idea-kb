# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

**Idea KB** — An Obsidian vault + Claude Code workflow for academic research idea management. From spark to publication.

**Core workflow**: User provides an idea → Claude searches literature → expands the knowledge base with structured notes.

**Language**: All vault content is written in Chinese. Respond in Chinese unless the user switches language.

---

## Quick Start

### Prerequisites

- [Obsidian](https://obsidian.md) — open this folder as a vault
- [Claude Code](https://claude.ai/code) — CLI or IDE extension
- Recommended MCP tools: **WebSearch** (built-in), **Exa** (`web_search_exa`, `web_fetch_exa`), **Sequential Thinking**

### Setup

1. Open this folder in Obsidian
2. Enable the CSS snippet: Settings → Appearance → CSS snippets → toggle `dashboard`
3. Configure graph view colors by folder path:
   - `path:atlas` → purple (navigation)
   - `path:ideas` → orange (ideas)
   - `path:literature` → blue (papers)
   - `path:methods` → green (techniques)
4. Start Claude Code in this directory

### First Idea

```
# Tell Claude your idea (in Chinese or English)
"我的 idea 是：利用 test-time compute 优化多智能体通信策略"

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
ideas/          → Idea notes, one per idea
literature/     → Paper reading notes, one per paper
methods/        → Research method/technique notes
atlas/          → Navigation hub: Dashboard, indexes
templates/      → Templates: Idea, Literature, Method, Daily Note
attachments/    → Embedded images and files
```

**Dashboard** (`atlas/Dashboard.md`) is the single source of truth for vault state.

---

## Note Schemas

Every note must conform to its template. On self-check, verify these required fields:

### Idea Note (`ideas/*.md`)
- **YAML**: `title`, `created`, `updated`, `status`, `tags`
- **Required sections**: 研究问题, 动机与背景, 核心创新点, 相关工作, 初步方案, 预期实验, 可行性分析, 风险与应对, 目标期刊/会议, 下一步行动, 参考文献
- **Status values**: `💡 灵感` → `🔍 调研中` → `📝 撰写中` → `🔄 实验中` → `✅ 已发表` / `🗑 已放弃`

### Literature Note (`literature/*.md`)
- **YAML**: `title`, `created`, `updated`, `type` ("文献笔记"), `author`, `year`, `venue`, `tags`
- **Required sections**: 元信息 (must include `论文链接` with a real URL), 一句话总结, 研究问题, 核心方法, 关键创新点, 局限性, 对我的启发, 相关论文
- **Competition markers**: 🔴 direct competitor, 🟡 complementary, 🟢 supporting

### Method Note (`methods/*.md`)
- **YAML**: `title`, `created`, `updated`, `type` ("方法笔记"), `tags`
- **Required sections**: 概述, 基本原理, 优缺点, 适用场景, 使用该方法的论文

---

## Linking Rules

- **Wikilinks only**: `[[filename|display text]]` (Obsidian `useMarkdownLinks: false`)
- **Bidirectional**: If note A lists note B in "相关论文" or "参考文献", then note B must also reference note A
- **Dashboard indexes**: Every literature note must appear in Dashboard's literature table. Every idea must appear in the active idea section (unless `🗑 已放弃`)
- **Competition table**: Papers directly relevant to an active idea must also appear in Dashboard with competition markers

---

## Idea Lifecycle

```
💡 灵感 → (user provides idea) → 🔍 调研中 → (research complete) → 📝 撰写中 → 🔄 实验中 → ✅ 已发表
                                                                                      → 🗑 已放弃
```

| Transition | Trigger | Required Actions |
|---|---|---|
| Any → 🔍 调研中 | User provides new idea or asks for research | Full literature search, create lit notes, competitive analysis, update idea note |
| 🔍 → 📝 撰写中 | Research phase complete, user starts writing | Add narrative strategy and experimental design to idea note |
| 📝 → 🔄 实验中 | Paper draft done, experiments running | Update idea with results |
| → ✅ 已发表 | Paper accepted | Finalize idea note, update Dashboard |
| → 🗑 已放弃 | User decides to drop | Update status, keep note for reference |

---

## Research Workflow

When the user provides a new idea or asks for deeper research:

1. **Literature search**: Use WebSearch, Exa (`web_search_exa`, `web_fetch_exa`), sequential thinking. Search arXiv, OpenReview, Google Scholar, top venue proceedings (NeurIPS/ICLR/ICML/ACL/EMNLP/AAAI).
2. **Competitive analysis**: Map idea into 2D space (optimization target × method). Verify the cell is unoccupied. Rate novelty honestly — downgrade when competitors found.
3. **Write literature notes**: One file per paper. Use competition markers. Include real paper URLs.
4. **Update idea note**: Add competitive landscape, differentiate vs. closest competitors, narrative strategy, experimental design.
5. **Sync Dashboard + Atlas**: Update Dashboard counts/competition/timeline/literature index. Also update `atlas/Atlas - Idea 看板.md` and `atlas/Atlas - 文献地图.md` with new entries.

---

## Session Protocol

### Entry (start of session)
- Read `CLAUDE.md` and `atlas/Dashboard.md` to understand current vault state
- Check which ideas are active and their latest status

### Exit (end of session, before responding to user's last message)
Run self-check on **all files modified in this session**:

1. **Frontmatter integrity**: Every modified `.md` has valid YAML matching its template schema
2. **Required fields**: Literature notes have `论文链接`; idea notes have `status`
3. **Broken wikilinks**: Every `[[Target]]` resolves to an existing file in the vault
4. **Sync Dashboard** (`atlas/Dashboard.md`): Counts, competition table, timeline, risk assessment, literature index
5. **Sync Atlas indexes** — new ideas/literature MUST also appear in:
   - `atlas/Atlas - Idea 看板.md` → add row to the correct status table
   - `atlas/Atlas - 文献地图.md` → add row to the literature index table
   - Update `updated` date in both files
6. **Bidirectional links**: For every wikilink `[[B]]` in note A's "相关论文" section, verify note B's "相关论文" also contains `[[A]]`. **Method**: for each new/modified note, list all targets in its "相关论文", then read each target and confirm the back-link exists. Add missing back-links before proceeding.
7. **Mermaid safety**: No angle brackets (`<>`) in Mermaid node labels — use backtick formatting
8. **Orphan detection**: New notes are referenced from at least one other note or Dashboard

**Fix any issue found immediately.** Report the self-check result to the user.

---

## Known Pitfalls

| Issue | Cause | Fix |
|---|---|---|
| Mermaid not rendering | Angle brackets `<tag>` in nodes | Replace with backtick formatting |
| Dashboard styles broken | CSS snippet not enabled | Settings → Appearance → CSS snippets → enable `dashboard.css` |
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
- Spellcheck: en-US + zh-CN
