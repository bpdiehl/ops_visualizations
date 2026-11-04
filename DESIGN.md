# Shared visual and interaction rules

Audience: MBA classmates using a browser without developer tools. Default to a quiet light page, clear typography, descriptive labels and a worked scenario. Use system fonts so downloads have no font requests. src/shared/theme.css provides the starting palette and catalog layout.

## Demo layout

Title, one-sentence learning goal and version/date first. Keep the main diagram/chart in the first laptop viewport; place compact controls alongside it, then below at narrow widths. Show 3–5 key results with units and a short causal explanation. Group presets and Reset clearly. Keep the core symbolic equation and a live numerical substitution visible in the main view. Put derivations, detailed caveats and advanced settings in labeled disclosures.

Use dark text, blue primary actions, orange warning/constraint, green favorable outcome and neutral gray comparison. Never rely on color alone; add text, shape or patterns. Use a restrained type scale and spacing. Axes have names, units, sensible scale and a labeled zero where applicable; disclose truncated axes. Clearly distinguish stock, rate, cumulative count and observed/expected plots.

## Controls and help

Use real buttons, labels and form inputs. Numeric fields allow exact entry; sliders have readable current values, units and keyboard control. Targets are at least 44 px where practical. Visible focus is required. Every important unfamiliar term has a small information button with a specific accessible name. Its popover works on click, tap, Enter/Space and Escape; manage focus and restore it on close. Do not hide essential units or invalid-state warnings in help.

For repeated definitions, extend src/shared/glossary.json in source and inline any required definitions in app.js or page.html during authoring; the browser must never fetch the JSON file. Keep 35–90 word help concise, original and assumption-aware.

## States and motion

Show valid defaults immediately. Presets reset all relevant inputs, seed and simulation time. Invalid inputs explain what failed and suppress invalid metrics. Use a stable comparison baseline for explanations. If motion teaches a process, provide Pause/Play and respect prefers-reduced-motion. Animation speed cannot change the mathematical outcome. Ensure charts also have textual numbers/summary.

Test at 360 px and laptop widths without horizontal page overflow. Avoid hover-only interactions. Keep controls readable when zoomed. Detached downloads must identify their topic and assumptions, even when no catalog or internet is present.


## Equations and notation — owner requirement

Every visualization must visibly show its governing equation(s) beside the main interaction, with numerical substitution from the current model state. Do not hide the core equation behind a disclosure. For an event model, show its applicable conservation or state-update relation rather than inventing a closed-form shortcut.

Put the mathematical symbol next to each variable name on controls, results and diagrams; define every symbol and its units. Keep notation consistent with the course and explain any alternative convention. Connect equation terms to the corresponding visual quantities with labels and consistent color, while preserving non-color cues. Equations must wrap or adapt at narrow widths without clipping. Invalid inputs suppress stale worked values while preserving the symbolic equation.


## Density, precision and editing feedback

Keep the main view focused on equations, the visual, controls and essential results. Put short explanatory taglines, repeated definitions, assumptions and estimation details in the relevant information controls rather than scattering them across the page. Keep units and validation visible.

Choose a consistent display precision for each kind of value and retain trailing zeros. Use tabular digits and fixed-width equation value slots so changing an input does not shift neighboring terms. Keep internal model precision unchanged. A soft highlight may connect an edited input to its equation terms; keep it active while dragging, fade it after release, and respect reduced-motion settings.


## Owner review refinements — November 3, 2026

Use the browser's native disclosure triangle on the **left** with a concise section name; no extra Show/Hide labels or decorative toggle badges. Keys default collapsed, with one symbol per row and exact highlighting of nested indices/exponents. Keep numeric columns, info buttons and mixed-unit fields aligned; retain trailing decimals and stable substitution widths. Abbreviations and short explanatory copy belong in info buttons. Rotate vertical axis names along the left. Advanced inputs belong immediately below main assumptions. Keep core equations visible in new demos; a specific owner request can group them in a disclosure.

Operations notation: use CT for Cycle Time, C for capacity, r_out for line output rate. Reserve throughput for Throughput Time (TPT); distinguish raw processing time from effective CT when setups exist. Prefer concrete Parallel machines to resources and units/hour as the displayed rate unit, with scope in help. Include utilization beside capacity equations when relevant, with its own help. New drafts need owner review before their commit/push.
