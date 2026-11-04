# Operations — MBA Interactive Learning Lab

Interactive browser visualizations for MBA classmates. The goal is intuition: change an assumption, see the effect, and understand why.

**M/M/1 Queueing is available.** Bottlenecks is a committed draft; Batching & Setups is in local review. No GitHub account is needed.

## For classmates

Choose a topic in the [visualization catalog](https://bpdiehl.github.io/ops_visualizations/), select Download HTML, find the .html file in Downloads, and double-click it to open in your browser. Each download will work by itself offline. No coding, software installation or ZIP extraction is needed. A laptop is recommended.

[Open M/M/1 Queueing](https://bpdiehl.github.io/ops_visualizations/downloads/mm1.html) or use the catalog’s Download HTML button. If a downloaded file opens in an editor, right-click → Open With → your browser. See verification/mm1.md for tested coverage and the remaining saved-file/offline testing limits.

## Topics

| Code | Topic / build brief | Build wave | Status |
| --- | --- | --- | --- |
| O1 | [Process Flow Fundamentals](specs/process-flow.md) | 1 | Planned |
| O2 | [Bottlenecks & Production Design](specs/bottlenecks.md) | 1 | Local draft |
| O3 | [Batching, Setups & Scheduling](specs/batching.md) | 2 | Local draft |
| O4 | [WIP, Storage & Buffer Dynamics](specs/wip.md) | 2 | Planned |
| O5 | [M/M/1 Queueing](specs/mm1.md) | 1 | Available |
| O6 | [Inventory Decisions](specs/inventory.md) | 2 | Planned |
| O7 | [Quality: SPC & Capability](specs/spc.md) | 3 | Planned |

Build waves are priorities, not availability promises. See the [finance collection](https://github.com/bpdiehl/finance_visualizations) for the other seven topics.

## For maintainers and AI assistants

Read [AGENTS.md](AGENTS.md), [CONTRIBUTING.md](CONTRIBUTING.md), [shared requirements](specs/SHARED_REQUIREMENTS.md), and [DESIGN.md](DESIGN.md). Classmates do not need these tools:

~~~sh
python3 scripts/manage.py build
python3 scripts/manage.py check
~~~

| Location | Purpose |
| --- | --- |
| catalog.json | Topic IDs, titles, slugs, status and priority |
| specs/ | Working briefs, shared requirements and editorial corrections |
| src/<slug>/ | Editable model, UI, styles and page template |
| src/shared/ | Local reusable styles and glossary |
| tests/ | Packaging checks and future mathematical model tests |
| verification/ | Human-readable browser/model release evidence |
| docs/index.html | Generated class-facing catalog |
| docs/downloads/ | Generated ready single-file HTML downloads |
| templates/ | Maintainer page and verification starting points |
| scripts/ | Dependency-free Python packaging/check tool |

Ready downloads and the catalog are checked in. [Publishing instructions](PUBLISHING.md) use main → /docs for GitHub Pages. Original lecture files and the private source dump belong outside this repository.

[Rights and provenance](RIGHTS.md): a public reuse license has not been selected. The briefs derive from a supplied planning specification; referenced original course notes were not supplied or verified in this setup.

## M/M/1 Queueing

v0.2 defaults to average line length, with a wait-time toggle, Poisson arrival-count and exponential-time plots, visible worked equations, and an optional seeded FIFO sample. The owner approved it for commit and publication on 2026-10-31.

For local development, run `python3 scripts/manage.py preview mm1`, then serve only `.preview/` with `python3 -m http.server 8771 --directory .preview --bind 127.0.0.1`. Open `http://127.0.0.1:8771/mm1.html`. See `verification/mm1.md` for evidence and remaining download/offline checks.

## Bottlenecks draft

The O2 constraint lab is in local owner review. Build it with `python3 scripts/manage.py preview bottlenecks` and serve `.preview/` using the same local-development workflow. It is not a public download yet. See `specs/bottlenecks.md` and `verification/bottlenecks.md` for scope and evidence.


## Batching & Setups draft

O3 compares batch-size-dependent station capacity with an exact whole-batch order schedule. Preview with `python3 scripts/manage.py preview batching`, then serve `.preview/` locally. See the brief and verification/batching.md for assumptions and evidence. Drafts have no public download.
