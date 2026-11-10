# Change log

## Local review — Operations presentation refinements

- Collapsible Batching/M/M/1 equations; right-aligned Batching column help.
- Explicit zero line on WIP actual flow rates.
- Persistent Inventory comparison scales, clear scale readouts and deliberate Fit view controls.
- Owner review pending; no commit/push.

## November 9, 2026 — Catalog navigation

- Made the upper-right Operations label link to the public Operations catalog in every visualization, including downloaded HTML files.
- Published the owner-approved SPC & Capability visualization and its catalog entry.

## Local draft refinement — X̄ specification reference lines

- Added labeled LSL/USL reference lines to X̄, using a distinct color/dash and individual-item interpretation in the legend/help.
- Expanded chart bounds when needed to keep the specifications visible; statistical control limits and the R chart remain unaffected.
- Kept current example-button styling unchanged.

## Local draft refinement — SPC matching examples and equation disclosure

- Matched example styling across tabs and added the centered In control default to Control charts.
- Made Equations collapsible and initially closed, as requested; retained its nested symbol key and live substitutions.
- Verified initial/reset selection, identical button styling and equation expansion in the desktop preview.

## Local draft refinement — SPC examples and specification context

- Scoped capability comparison and control-signal presets to their respective tabs.
- Added a collapsible individual-measurement plot with LSL/USL, keeping specification lines separate from X̄/R control limits.
- Verified tab-state preservation, preset routing, reading selection and specification-only updates in the desktop browser.

## Local draft refinement — SPC & Capability v0.2

- Fixed comparison axes so mean shifts and spread differences remain visible; emphasized and strengthened the three in-control examples.
- Verified eight seeded examples, including an isolated outlier and a six-point trend inside limits. Highlight all points belonging to detected patterns.
- Separated current-model capability from historical control status and explained improved spread triggering a process-change signal.96automated checks pass; local review only.

## Local draft — Quality: SPC & Capability, November 9, 2026

- Added linked X̄/R control charts and normal-model capability, explicit reference-limit snapshots, seed/subgroup controls and seven original examples.
- Checks beyond-limit points, eight same-side points and six-point trends; signal details identifies each window and highlights it on selection.
- Visible aligned equations, exact symbol/numerical glows, individual specification comparison and conditional capability warnings. Draft only; no public download, commit or push.

## 2026-11-09 — Inventory Decisions v0.1

- Released EOQ and normal-demand single-period stocking with cost curves, bell-curve probabilities, exact expected shortage/leftover costs and type-specific examples that select the optimum.
- Added fixed replenishment-chart scales with Fit view, quantity sliders matching graph bounds, textbook square-root overbars and a prominent optimal-quantity button.
- Added the catalog listing and standalone download. Verification scope and remaining offline/browser limits are documented.

## Local draft — Inventory Decisions v0.1, November 9, 2026

- Owner refinement: normal mean/SD replace uniform bounds; normal-quantile optimum and analytic normal loss functions; quantity slider matches the graph domain.

- Added EOQ and normal-demand single-period stocking as distinct modes with relevant cost curves, linked replenishment/demand plots and optimal-quantity action.
- Added type-specific examples, exact fields/sliders, collapsed worked equations with nested symbols, shortage/leftover expectations and service probabilities.
- Seven model tests and desktop evidence recorded; catalog remains draft pending owner review.

## 2026-11-09 — WIP & Buffer Dynamics v0.1

- Released shared-buffer accumulation with independent input/output schedules, exact inventory and rate curves, finite storage and blocked/unmet flow accounting.
- Grouped input/output schedule cards in left/right columns, with a collapsible buffer diagram above them. Flow schedules appears below the graphs; equations collapse separately.
- Added the standalone download and Operations catalog listing. Verification evidence and remaining offline/cross-browser limits are recorded in verification/wip.md.

## Local draft — WIP & Buffer Dynamics v0.1, November 9, 2026

- Added general multi-stream accumulation with independently timed rate segments, exact inventory/rate plots, synchronized cursor and network readings.
- Added unlimited/finite storage, explicit blocked-input and unmet-output accounting, inventory/slope equations and exact average-inventory integration.
- Nine model tests and desktop preview evidence recorded. Catalog remains draft with no public download or commit/push.

## 2026-11-07 — Process Flow v0.3

- Released the owner-approved desktop Cycle Time & Throughput Time visualization with a steady-state process diagram, looping unit and fixed-point observations, station activity glow, and one to six configurable processes.
- Default processing times 2/4/1 min distinguish TPT 7 min from line CT 4 min/unit. Added capacity utilization, aligned equations, and the complete Entrance-to-Exit marker range.
- Added the standalone HTML and catalog Open/Download links. Browser and offline verification limits are recorded in verification/process-flow.md.

## Local draft — Process Flow v0.2

- Rebuilt around following one moving unit for TPT and watching successive crossings of a fixed marker for CT.
- Added prominent stopwatches, observed/upcoming events, arbitrary marker placement and zoom that preserves the measurement.
- Explicit local crossing gaps during queue buildup; moved detailed schedules into a disclosure.
- Retained paired equations, shared amber feedback and standalone packaging. No commit/push or publication yet.

## Local draft — Process Flow v0.1

- Added deterministic FIFO process playback, a tracked unit journey and completion-spacing comparison.
- Visible aligned rate/CT/TPT/conservation equations, shared amber editing and notation feedback.
- Independent model checks and a separate exact complete-run average identity; overload/zero-arrival states are explicit.
- Draft only, awaiting owner review; no public download or commit/push.

## 2026-11-06 — Equation and legend consistency release

- M/M/1 v0.2.1, Bottlenecks v0.4 and Batching & Setups v0.4.
- Aligned symbolic and numeric terms/results, including distribution means; rendered divisions as textbook fractions.
- Standardized soft amber editing/symbol feedback and notation buttons; coordinated graph legend typography while preserving series colors and markers.
- Published the previously accepted Bottlenecks and Batching demos in the Operations catalog with Open/Download actions.
- Owner authorized commit/push. Evidence and coverage limits: verification/equation-layout-review.md and individual records.

## 2026-11-03 — Batching badge refinement

- Matched the capacity-limiting station badge to the corresponding station color; tied constraints use a combined palette.
- Verified the A/B/C presets in the browser; the project remains a catalog draft without a public download.

## 2026-11-03 — Batching & Setups owner-review draft v0.3

- Retuned shared station assumptions so Small/Middle/Large batch presets move the bottleneck A → B → C by changing only batch size.
- Explicitly labeled the equation group Steady-state capacity.
- Updated independent model examples, crossover checks and browser evidence.

## 2026-11-03 — Batching & Setups owner-review draft v0.2

- Added six synchronized station setup/processing sliders alongside exact entry.
- Limited the key to the main equation symbols and removed schedule equations and the secondary order-rate metric.
- Kept schedule explanation in its info button; aligned the main equation headings.

## 2026-11-03 — Batching & Setups owner-review draft v0.1

- Added setup-amortized capacity, moving bottlenecks, utilization and a batch-size curve.
- Added exact three-station whole-batch scheduling, partial final batches and distinct first-batch/order completion metrics.
- Carried forward native disclosure arrows, collapsed symbol key, precise index highlighting, consistent decimals, aligned controls, info buttons and rotated axis titles.
- Added independent model checks and browser evidence; remains local draft awaiting owner review.

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

- O1 Process Flow v0.3 draft: replaced finite arrivals/queues with an explicitly steady-state, no-buffer, deterministic line; moved diagram above calculations; looping unit/point views; configurable 1–6 processes; default 2/4/1 min per unit; added station capacity-utilization equations and per-process occupancy glow; full-width diagram followed by collapsed full-width equations then full-width assumptions; utilization shown as fractions; followed-unit loop holds at exit until the next scheduled release. Not ready for publication.
