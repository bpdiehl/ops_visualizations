# O3 — Batching & Setups v0.3

November 3, 2026. Owner-approved source draft; no public download is generated while catalog status is draft.

## Scope and numerical evidence

Three serial machines, one product, same process/transfer batch, setup per batch at each station (including partial final batch), entire-batch handoff, instantaneous transport and no worker conflicts. Repeating full-batch capacity differs from finite-order output rate. All examples are original illustrations.

`python3 scripts/manage.py build` and `check` passed:46 Node model tests (8 O3,18 O2,20 O5),6 Python packaging checks, source syntax and artifact synchronization. `git diff --check` passed.

Eight new model tests cover: independently calculated 25-minute station activity; moving bottleneck and exact tie; default first batch78/order248; partial final batch; station exclusivity/arrival precedence/duration over a grid; zero-setup capacity invariance with changing handoff time; invalid inputs; input isolation and current curve consistency.

## Browser evidence

Supported CUA in-app browser on macOS, engine version not reported. Local HTTP preview on port8776.

- Default B20: capacity35.29, first batch78.00, order248.00, finite-order rate29.03. Large B60: constraint B, capacity47.37, first batch178.00, order254.00. Small B5: capacity11.32. Shorter setup: capacity30.00. Reset restores the defaults.
- Entered Q23/B10: first batch53.00, order93.50, three batches; matches pure-model results. B0 shows a visible error, empties the chart and disables download; Reset recovers.
- Expanded key and schedule equations; clicked index i. All28 data-marked index occurrences outside the key had highlight state, including nested schedule terms. Each symbol has a separate key row. Hover/focus/click handlers are present; keyboard Enter-specific key activation was not separately exercised.
- Keyboard Tab from the batch number reaches the slider; Right changes B20→21 and capacity35.29→36.52, with both views synchronized. Reset restores B20.
- Batch help opens as modal; Escape closes and restores focus to Explain batch size.
- Full-page screenshots inspected at360px and the normal laptop viewport. No document overflow at360px; rotated y-axis title, readable chart axes, aligned station columns, native left disclosure arrows, circle info buttons and four equation columns on desktop. Temporary viewport override reset.
- Captured warning/error logs were empty. Static packaging gate passed. No claim of instrumented zero network requests.

## Limits

Actual download/save and isolated file:// execution with network blocked have not been exercised; prior browser tooling could not complete that flow. Download source uses an inline Blob and packaging permits no runtime external assets. This is not a substitute for detached-file testing. Reduced-motion CSS inspected, live override and cross-browser/device testing omitted. Gantt SVG tooltips expose activities/times on hover; tiny batches can be too narrow for visible batch numbers. No general scheduling optimizer is claimed.


## v0.2 owner refinement

All six station sliders were keyboard-incremented once: setup inputs24.50/4.50/0.50 and processing0.60/1.30/0.90 matched their range values; capacity updated32.88. Exact setup30 and processing2.5 updated the corresponding sliders. Reset restored defaults. DOM inspection confirmed all eight key entries occur in the main equation group and no schedule-math disclosure remains. Desktop screenshot inspected with the two schedule metrics and aligned number/slider columns. Earlier v0.1 schedule/key evidence describes the previous layout, not the current UI.

The v0.2 full-page preview was inspected at360px and the normal971px desktop width. Six station sliders fit with no360px document overflow; all four desktop equation headings have equal48px height. Viewport restored. Repository checks remain46 Node plus6 Python passing; no model changes.


## v0.3 base examples and steady-state label

Updated station assumptions to setups30/15/0 min/batch and processing0.5/1.5/2 min/unit. Independent tests check A/B tie at15 units, B/C tie at30, and identical assumptions across all three base presets. Default station activities40/45/40 minutes give first batch125 and six-batch order350 minutes.

Browser clicks verified Small B5 → A9.23, Middle B20 → B26.67, Large B60 → C30.00 units/hour; all retain identical setup/processing values. Reset restores Middle ground. Full-page screenshot inspected; the main equation group explicitly reads Steady-state capacity. Earlier numerical evidence above records earlier examples and is superseded by these figures. Eight batching tests and full repository checks pass.

## Owner-approved badge refinement

The capacity-limiting station badge uses the same station palette as the capacity chart. Browser inspection verified the small, middle and large presets display Station A, B and C colors respectively; Reset was used to return to the default scenario. `git diff --check` passed. This does not change the model or catalog status.
