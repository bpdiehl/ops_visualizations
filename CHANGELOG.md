# Change log

## 2026-10-31 — M/M/1 Queueing v0.2

- Moved all six worked equations above the primary chart and sliders; distribution plots now immediately follow the controls.
- Rotated every vertical-axis title along its left edge with room for tick labels, including the sample chart.
- Labeled the comparison as full-run sample averages and added help explaining seeds, run duration, startup, slow settling near capacity and unfinished-customer bias.
- Kept the theoretical reference line within the sample chart scale. Added independent interval-based checks of queue, system and service averages across seeds and load levels.
- Owner approved v0.2 for commit/push. Added the standalone public HTML and catalog Open/Download links; saved-file/offline coverage limits remain documented in verification/mm1.md.
- Mathematics and sampling conventions are unchanged.

## 2026-10-31 — M/M/1 owner-review draft v0.1

- Added a line-length-first M/M/1 visualization with a wait-time toggle, six visible worked equations, and explicit units/symbols.
- Added Poisson arrival counts and exponential interarrival/service distributions with means and shaded probabilities.
- Added an optional reproducible FIFO sample, warm-up/unfinished-customer disclosures, presets, accessible help and standalone HTML preview.
- Preserved the owner’s WACC feedback: restrained copy, fixed decimals, equation editing highlights, and definitions inside info controls.
- Catalog status remains draft; commit, push and publication await owner approval. Verification is recorded in verification/mm1.md.

## 2026-10-30 — Local scaffold

- Added seven planned demo briefs, common standards and AI working agreement.
- Added a generated catalog, standalone packaging tool and packaging regression tests.
- Prepared docs/ for branch-based GitHub Pages; publication is pending.
- No completed visualizations or numerical-model test coverage yet.


## 2026-10-30 — Equation visibility standard

- Require visible core equations, current numerical substitutions and symbols beside variable names in all Finance and Operations demos. Keep derivations optional, not the core equation.
