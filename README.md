# Idea KB

**[English](#english)** | **[中文](#中文)**

---

# English

A structured Obsidian vault + Claude Code workflow for academic research idea management — from spark to publication.

Give an idea, get a literature review. Automatically.

## Features

- **Idea lifecycle tracking** — 6 states from spark to publication
- **Automated literature search** — Claude searches arXiv, Google Scholar, top venues
- **Competitive analysis** — map your idea into research space, find your niche
- **Structured notes** — YAML frontmatter + required sections for every note type
- **Dashboard** — styled overview with stats, idea cards, literature index
- **Bidirectional linking** — wikilinks connect ideas, papers, and methods
- **Self-checking** — Claude validates format, links, and consistency after every session

## Quick Start

### Prerequisites

- [Obsidian](https://obsidian.md)
- [Claude Code](https://claude.ai/code) (CLI, desktop app, or IDE extension)
- Recommended MCP tools: WebSearch, Exa, Sequential Thinking

### Setup

```bash
git clone https://github.com/Easonnoway/obsidian-idea-kb.git
cd obsidian-idea-kb

# Open in Obsidian (File → Open folder as vault)
# Start Claude Code
claude
```

### Configure Obsidian

1. Enable CSS snippet: **Settings → Appearance → CSS snippets → toggle `dashboard`**
2. Set graph view colors by folder path:
   - `path:atlas` → purple (navigation)
   - `path:ideas` → orange (ideas)
   - `path:literature` → blue (papers)
   - `path:methods` → green (techniques)

### First Idea

Tell Claude your idea in natural language:

```
"My idea: using test-time compute to optimize multi-agent communication strategies"
```

Claude will:
1. Search arXiv, Google Scholar, and top venues for related work
2. Create structured literature notes in `literature/`
3. Create an idea note in `ideas/` with competitive analysis
4. Update the Dashboard with stats and references
5. Run a self-check on all modified files

## Vault Structure

```
idea-kb/
├── ideas/              # Idea notes (one per idea)
├── literature/         # Paper reading notes (one per paper)
├── methods/            # Research method/technique notes
├── atlas/              # Navigation hub
│   ├── Dashboard.md    # Global overview with stats
│   ├── Home.md         # Vault homepage
│   └── ...             # Idea board, literature map, method index
├── templates/          # Note templates
│   ├── Template - Idea.md
│   ├── Template - Literature.md
│   ├── Template - Method.md
│   └── Template - Daily Note.md
├── attachments/        # Embedded images and files
├── CLAUDE.md           # Claude Code instructions
└── README.md           # This file
```

## Note Schemas

### Idea Note

```yaml
---
title: "Idea Title"
created: 2026-01-01
updated: 2026-01-01
status: "💡 Inspiration"
tags: []
---
```

Required sections: Research Question, Motivation & Background, Core Innovation, Related Work, Preliminary Approach, Expected Experiments, Feasibility Analysis, Risks & Mitigations, Target Venue, Next Steps, References

### Literature Note

```yaml
---
title: "Paper Title"
created: 2026-01-01
updated: 2026-01-01
type: "Literature Note"
author: "Author Name"
year: 2026
venue: "Conference/Journal"
tags: []
---
```

Required sections: Metadata (with paper URL), One-line Summary, Research Question, Core Method, Key Innovation, Limitations, Insights for My Work, Related Papers

### Method Note

```yaml
---
title: "Method Name"
created: 2026-01-01
updated: 2026-01-01
type: "Method Note"
tags: []
---
```

Required sections: Overview, Basic Principles, Pros & Cons, Applicable Scenarios, Papers Using This Method

## Workflow

```
Idea Input → Literature Search → Note Creation → Dashboard Sync → Self-Check
     ↑                                                            │
     └──────────── Next iteration ────────────────────────────────┘
```

1. **Input**: Describe your idea to Claude
2. **Search**: Claude searches arXiv, Google Scholar, top venues
3. **Notes**: Creates literature notes with competition markers (🔴/🟡/🟢)
4. **Dashboard**: Updates stats, idea cards, literature index
5. **Self-check**: Validates YAML, wikilinks, bidirectional refs, counts

## Customization

- **Templates**: Edit files in `templates/` to match your field's conventions
- **Dashboard CSS**: Edit `.obsidian/snippets/dashboard.css` for styling
- **CLAUDE.md**: Modify Claude's behavior, search targets, note schemas
- **Languages**: Content defaults to Chinese; change the `Language` line in CLAUDE.md to switch

## Usage Example

Start Claude Code in the vault directory, then describe your idea:

```
You: My idea is: using test-time compute to optimize multi-agent communication strategies

Claude will:
1. Search arXiv, Google Scholar, and top venues (NeurIPS/ICLR/ICML/ACL/EMNLP/AAAI)
2. Create 10-15 structured literature notes in literature/
   - Each note includes: metadata, summary, core method, competition marker (🔴/🟡/🟢)
3. Create an idea note in ideas/ with competitive analysis and experimental design
4. Update Dashboard with stats, idea cards, and literature index
5. Run self-check on all modified files:
   - YAML frontmatter validation
   - Wikilink resolution
   - Bidirectional reference verification
   - Dashboard count consistency
```

After the session, open Obsidian to review the results. The Dashboard shows your idea card with competition landscape, and each literature note links to related papers.

---

# 中文

基于 Obsidian + Claude Code 的学术研究想法管理工作流 —— 从灵感萌芽到论文发表。

给一个想法，自动获取文献综述。

## 特性

- **想法全生命周期追踪** — 从灵感到发表的 6 个状态
- **自动文献检索** — 搜索 arXiv、Google Scholar、顶级会议
- **竞争分析** — 将想法映射到研究空间，定位差异化
- **结构化笔记** — YAML 元数据 + 每种笔记类型的必填章节
- **看板面板** — 带样式的全局概览：统计、想法卡片、文献索引
- **双向链接** — wikilink 连接想法、论文和方法
- **自动自检** — 每次会话后验证格式、链接和一致性

## 快速开始

### 前置条件

- [Obsidian](https://obsidian.md)
- [Claude Code](https://claude.ai/code)（命令行、桌面应用或 IDE 插件）
- 推荐 MCP 工具：WebSearch、Exa、Sequential Thinking

### 安装

```bash
git clone https://github.com/Easonnoway/obsidian-idea-kb.git
cd obsidian-idea-kb

# 用 Obsidian 打开（文件 → 打开文件夹为仓库）
# 启动 Claude Code
claude
```

### 配置 Obsidian

1. 启用 CSS 代码片段：**设置 → 外观 → CSS 代码片段 → 开启 `dashboard`**
2. 按文件夹路径设置图谱颜色：
   - `path:atlas` → 紫色（导航）
   - `path:ideas` → 橙色（想法）
   - `path:literature` → 蓝色（论文）
   - `path:methods` → 绿色（方法）

### 创建第一个想法

用自然语言告诉 Claude 你的想法：

```
"我的想法是：利用测试时计算优化多智能体通信策略"
```

Claude 会自动：
1. 搜索 arXiv、Google Scholar 和顶级会议的相关工作
2. 在 `literature/` 创建结构化文献笔记
3. 在 `ideas/` 创建带竞争分析的想法笔记
4. 更新看板面板（统计、文献索引）
5. 对所有修改文件执行自检

## 仓库结构

```
idea-kb/
├── ideas/              # 想法笔记（每个想法一个文件）
├── literature/         # 论文阅读笔记（每篇论文一个文件）
├── methods/            # 研究方法/技术笔记
├── atlas/              # 导航中心
│   ├── Dashboard.md    # 全局看板（统计 + 想法卡片 + 文献索引）
│   ├── Home.md         # 知识库首页
│   └── ...             # 想法看板、文献地图、方法库
├── templates/          # 笔记模板
│   ├── Template - Idea.md
│   ├── Template - Literature.md
│   ├── Template - Method.md
│   └── Template - Daily Note.md
├── attachments/        # 嵌入的图片和文件
├── CLAUDE.md           # Claude Code 项目指令
└── README.md           # 本文件
```

## 笔记格式

### 想法笔记

```yaml
---
title: "想法标题"
created: 2026-01-01
updated: 2026-01-01
status: "💡 灵感"
tags: []
---
```

必填章节：研究问题、动机与背景、核心创新点、相关工作、初步方案、预期实验、可行性分析、风险与应对、目标期刊/会议、下一步行动、参考文献

### 文献笔记

```yaml
---
title: "论文标题"
created: 2026-01-01
updated: 2026-01-01
type: "文献笔记"
author: "作者"
year: 2026
venue: "会议/期刊"
tags: []
---
```

必填章节：元信息（含论文链接）、一句话总结、研究问题、核心方法、关键创新点、局限性、对我的启发、相关论文

### 方法笔记

```yaml
---
title: "方法名称"
created: 2026-01-01
updated: 2026-01-01
type: "方法笔记"
tags: []
---
```

必填章节：概述、基本原理、优缺点、适用场景、使用该方法的论文

## 工作流

```
想法输入 → 文献检索 → 笔记创建 → 看板同步 → 自动自检
     ↑                                                  │
     └──────────── 下一轮迭代 ──────────────────────────┘
```

1. **输入**：用自然语言描述你的想法
2. **检索**：搜索 arXiv、Google Scholar、顶级会议
3. **笔记**：创建带竞争标记（🔴/🟡/🟢）的文献笔记
4. **同步**：更新看板统计、想法卡片、文献索引
5. **自检**：验证 YAML、wikilink、双向引用、计数一致性

## 自定义

- **模板**：编辑 `templates/` 下的文件，适配你所在领域的惯例
- **看板样式**：编辑 `.obsidian/snippets/dashboard.css`
- **Claude 行为**：修改 `CLAUDE.md` 中的搜索目标、笔记格式
- **语言**：内容默认中文；修改 `CLAUDE.md` 的语言行即可切换

## 使用示例

在仓库目录下启动 Claude Code，然后用自然语言描述你的想法：

```
你：我的想法是：利用测试时计算优化多智能体通信策略

Claude 会自动：
1. 搜索 arXiv、Google Scholar、顶级会议（NeurIPS/ICLR/ICML/ACL/EMNLP/AAAI）
2. 在 literature/ 创建 10-15 篇结构化文献笔记
   - 每篇包含：元信息、摘要、核心方法、竞争标记（🔴/🟡/🟢）
3. 在 ideas/ 创建带竞争分析和实验设计的想法笔记
4. 更新看板面板（统计、想法卡片、文献索引）
5. 对所有修改文件执行自检：
   - YAML 元数据验证
   - Wikilink 解析检查
   - 双向引用一致性
   - 看板计数同步
```

会话结束后，在 Obsidian 中查看结果。看板显示想法卡片和竞争格局，每篇文献笔记自动链接到相关论文。

## 许可证

MIT
