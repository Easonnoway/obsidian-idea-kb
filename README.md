<div align="center">

# Idea KB

**An Obsidian vault + Claude Code workflow for academic research idea management.**

*From spark to publication — give an idea, get a literature review. Automatically.*

[![Version](https://img.shields.io/badge/version-v1.1-blue)](https://github.com/Easonnoway/obsidian-idea-kb/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Obsidian](https://img.shields.io/badge/Obsidian-compatible-purple)](https://obsidian.md)
[![Claude Code](https://img.shields.io/badge/Claude_Code-compatible-orange)](https://claude.ai/code)

[English](#english) | [中文](#中文)

</div>

---

# English

## Features

- **Folder-per-idea architecture** — each idea gets its own folder with a core summary + deep-dive sub-documents
- **On-demand sub-documents** — Claude auto-creates focused research docs (competitive analysis, method design, experiment plans, etc.) as you explore
- **Research Landscape Website** — interactive D3.js visualization with 7 views: network graph, papers table, timeline, competition landscape, stats dashboard, idea detail pages, and **Ideas & Deep Dives** sidebar
- **Standardized idea lifecycle** — 6 status levels with color-coded tags: Spark → Researching → Writing → Experimenting → Published / Abandoned
- **Automated literature search** — Claude searches arXiv, Google Scholar, top venues (NeurIPS/ICLR/ICML/ACL/EMNLP/AAAI)
- **Competitive analysis** — map your idea into research space, find your niche, track competitors
- **Structured notes** — YAML frontmatter + required sections for every note type
- **Dashboard** — styled overview with stats, idea cards, literature index
- **Self-checking** — Claude validates format, links, and consistency after every session

## Quick Start

### Prerequisites

| Tool | Purpose | Required |
|------|---------|----------|
| [Obsidian](https://obsidian.md) | Knowledge base UI | Yes |
| [Claude Code](https://claude.ai/code) | AI research assistant | Yes |
| [obsidian-skills](https://github.com/kepano/obsidian-skills) | Agent skills for Obsidian | Yes |
| [everything-claude-code](https://github.com/affaan-m/everything-claude-code) | Agent harness with skills | Recommended |

### Installation

```bash
git clone https://github.com/Easonnoway/obsidian-idea-kb.git
cd obsidian-idea-kb

# Open in Obsidian: File → Open folder as vault
# Enable CSS snippet: Settings → Appearance → CSS snippets → toggle "dashboard"
# Start Claude Code
claude
```

### First Idea

```
"My idea: using test-time compute to optimize multi-agent communication strategies"
```

Claude will:
1. Search arXiv, Google Scholar, and top venues for related work
2. Create structured literature notes in `literature/`
3. Create an idea folder in `ideas/` with competitive analysis
4. Auto-generate deep-dive sub-documents as the research progresses
5. Update the Dashboard and Research Landscape website
6. Run a self-check on all modified files

## Vault Structure

```
ideas/
  CommThink/                                # One folder per idea
    Test-Time Compute for Agentic Communication.md   # Core summary (~130 lines)
    CommThink - Competitive Analysis.md              # Deep-dive sub-documents
    CommThink - Method Design.md                     #   (auto-created by Claude
    CommThink - Experiment Design.md                 #    when you ask deep questions)
    ...
literature/           # Paper reading notes (flat, one per paper)
methods/              # Research method/technique notes
atlas/                # Navigation hub (Dashboard, indexes)
templates/            # Note templates
  Template - Idea.md
  Template - Idea Sub-Document.md
  Template - Literature.md
  Template - Method.md
  Template - Daily Note.md
site/                 # Research Landscape website
  index.html          # Single-page app
  export.mjs          # Data export script (vault → JSON)
CLAUDE.md             # Claude Code instructions
```

## Idea Status

Each idea has a standardized status tracked in YAML frontmatter:

| Status | Emoji | Meaning |
|--------|-------|---------|
| `Spark` | 💡 | Initial idea, not yet explored |
| `Researching` | 🔍 | Active literature search and analysis |
| `Writing` | ✍️ | Paper writing in progress |
| `Experimenting` | 🧪 | Running experiments |
| `Published` | ✅ | Paper accepted |
| `Abandoned` | ❌ | Dropped, kept for reference |

In Obsidian, edit the `status` field in the Properties panel. The website displays each status with a distinct color.

## Research Landscape Website

```bash
cd site && npm install
node export.mjs    # Generate data.json from vault
open index.html    # Works with file:// protocol
```

| View | Description |
|------|-------------|
| **Network** | D3.js force-directed graph with idea-literature connections |
| **Papers** | Sortable table with competition markers and paper links |
| **Timeline** | Papers by year, filterable by idea |
| **Landscape** | Per-idea competition cards |
| **Stats** | Bento-grid dashboard with distributions and tag cloud |
| **Idea Detail** | Full research plan with sections and sub-documents |
| **Ideas & Deep Dives** | Sidebar tree showing idea → sub-document hierarchy |

## Note Schemas

### Idea Note (`ideas/{ShortName}/{Full Title}.md`)

```yaml
---
title: "Idea Title"
created: 2026-01-01
updated: 2026-01-01
status: "Researching"
tags: [idea, multi-agent, RL]
---
```

### Idea Sub-Document (`ideas/{ShortName}/{ShortName} - Topic.md`)

```yaml
---
title: "CommThink - Experiment Design"
created: 2026-05-05
updated: 2026-05-05
parent: "[[Test-Time Compute for Agentic Communication]]"
type: "Idea Sub-Document"
tags: [idea-detail]
---
```

### Literature Note (`literature/Author Keyword - Title.md`)

```yaml
---
title: "Paper Title"
created: 2026-01-01
updated: 2026-01-01
type: "Literature Note"
author: "Author Name"
year: 2026
venue: "NeurIPS"
tags: []
---
```

## Workflow

```
Idea Input → Literature Search → Note Creation → Dashboard Sync → Self-Check
     ↑                                                            │
     └──────────── Next iteration ────────────────────────────────┘
```

## Changelog

### v1.1 (2026-05-07)

- **Folder-per-idea architecture** — ideas are now folders with a core summary + deep-dive sub-documents
- **Sub-document template** — `Template - Idea Sub-Document.md` with `parent` and `type` frontmatter
- **On-demand sub-document creation** — Claude auto-creates sub-documents when answering deep research questions
- **Standardized status values** — 6 English status levels (Spark/Researching/Writing/Experimenting/Published/Abandoned) with color-coded website display
- **Ideas & Deep Dives sidebar** — website sidebar shows expandable idea → sub-document tree
- **Sub-document detail view** — click any sub-document in the sidebar to view its full content
- **Recursive script support** — healthcheck.mjs and export.mjs scan idea subfolders
- **Updated CLAUDE.md** — new schemas, workflow rules, and sub-document integrity checks

### v1.0 (2026-05-05)

- Initial release
- Obsidian vault with idea/literature/method notes
- Research Landscape website with 6 interactive views
- Claude Code workflow with automated literature search and self-check

## Customization

- **Templates**: Edit files in `templates/` to match your field's conventions
- **Dashboard CSS**: Edit `snippets/dashboard.css` for styling
- **CLAUDE.md**: Modify Claude's behavior, search targets, note schemas
- **Languages**: Content defaults to Chinese; change the language setting in CLAUDE.md

## License

[MIT](LICENSE)

---

# 中文

基于 Obsidian + Claude Code 的学术研究想法管理工作流 —— 从灵感萌芽到论文发表。

给一个想法，自动获取文献综述。

## 特性

- **文件夹化 idea 结构** — 每个想法独立文件夹，核心摘要 + 按需深度子文档
- **按需子文档** — Claude 在回答深度研究问题时自动创建聚焦的子文档（竞争分析、方法设计、实验方案等）
- **Research Landscape 网站** — 交互式 D3.js 可视化，7 个视图 + **Ideas & Deep Dives** 侧边栏
- **标准化状态追踪** — 6 种状态级别，网页端彩色标签展示
- **自动文献检索** — 搜索 arXiv、Google Scholar、顶级会议
- **竞争分析** — 将想法映射到研究空间，定位差异化
- **自动自检** — 每次会话后验证格式、链接和一致性

## 快速开始

```bash
git clone https://github.com/Easonnoway/obsidian-idea-kb.git
cd obsidian-idea-kb

# 用 Obsidian 打开：文件 → 打开文件夹为仓库
# 启用 CSS 片段：设置 → 外观 → CSS 片段 → 开启 dashboard
# 启动 Claude Code
claude
```

## 状态值

| 状态 | Emoji | 含义 |
|------|-------|------|
| `Spark` | 💡 | 灵感萌芽 |
| `Researching` | 🔍 | 调研中 |
| `Writing` | ✍️ | 写作中 |
| `Experimenting` | 🧪 | 实验中 |
| `Published` | ✅ | 已发表 |
| `Abandoned` | ❌ | 已放弃 |

## 更新日志

### v1.1 (2026-05-07)

- 文件夹化 idea 架构 + 子文档模板
- 标准化状态值 + 网页彩色标签
- Ideas & Deep Dives 侧边栏导航
- 递归脚本支持（healthcheck + export）

### v1.0 (2026-05-05)

- 初始发布

## 许可证

[MIT](LICENSE)
