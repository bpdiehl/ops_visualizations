# Change log

## 2026-11-03 — Bottlenecks owner-review draft v0.3.4

- Matched the earlier equation panel pattern: a native disclosure arrow at the left and a concise heading, with no extra show/hide wording.
- Moved the utilization formula, live values and information button into a fourth top equation column above the notation key.
- Refreshed and visually inspected the local preview at laptop width. No automated tests run for this layout-only change.

## 2026-11-03 — Bottlenecks owner-review draft v0.3.3

- Replaced the trial OR symbol with r_out for line output rate. Applied it to the live equation, result label, comparison, utilization relation, help and interactive key; retained r_i for each machine's rate and C for capacity.
- Refreshed the local preview. No test suite run for this notation-only revision.

## 2026-11-03 — Bottlenecks owner-review draft v0.3.2

- Renamed the line output symbol from X to OR in the live equation, result label, comparison, utilization relation, help and interactive key. The symbolic equation now reads OR = min(d, C); station rate r_i and capacity C remain distinct.
- Refreshed the local preview. No test suite run for this notation-only revision.

## 2026-11-03 — Bottlenecks owner-review draft v0.3.1

- Replaced p_i with CT_i as the cycle-time notation in the station equation, worked substitutions, control labels, help and interactive symbol key. Kept C for station/system capacity.
- Rebuilt the local preview. No test suite run for this notation-only revision.

## 2026-11-03 — Bottlenecks owner-review draft v0.3

- Renamed the input view to Cycle Time (CT), with help defining machine cycle time and distinguishing line CT from Throughput Time (TPT).
- Renamed the modeled line result to Output rate; reserve “throughput” for the TPT explanation.
- Moved the equations, worked substitutions, utilization relation and interactive symbol key into one disclosure directly below the preset/top section. It is collapsed by default.
- TPT remains a Process Flow Fundamentals (O1) concept because it measures elapsed time in the whole system; this capacity model has no waits or WIP.
- Rebuilt only the local preview. No additional checks were run for this wording/layout revision; v0.2's44 checks remain the last verified code state.

## 2026-11-03 — Bottlenecks owner-review draft v0.2

- Simplified rate units to units/hour and renamed Parallel resources to Parallel machines, with concrete help and key definitions.
- Added a Rate / Time per unit input toggle, reciprocal capacity equation and live substitutions. Switching views preserves full-precision canonical rates and the saved comparison; presets keep the chosen view and Reset restores Rate.
- Added minute/hour conversion checks, explicit stopped-machine time ∞, time validation, and disabled time sliders for stopped machines. Kept three stations.
- Passed 44 checks and browser tests of conversion, repeated switches, presets/comparison, keyboard, validation, parallel machines and narrow/laptop layouts. Draft remains uncommitted and unpublished; earlier saved-file/offline limits still apply.

## 2026-11-03 — Bottlenecks owner-review draft v0.1

- Added a three-station constraint lab with live station/system/throughput equations, capacity bars, utilization and demand/output limits.
- Added moving-constraint, tied-constraint and low-demand presets, exact fields/sliders, a saved comparison, and collapsed parallel resources directly below main assumptions.
- Kept the owner's clean-copy, aligned-field, consistent-decimal and editing-feedback conventions. Added a collapsed interactive symbol key with exact nested-index targeting and accessible help.
- Added 14 independent model checks. Catalog remains draft; no new public download is generated, committed or pushed. See verification/bottlenecks.md for browser evidence and offline/download omissions.

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
