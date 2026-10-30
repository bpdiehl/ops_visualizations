# Shared visual and interaction rules

Audience: MBA classmates using a browser without developer tools. Default to a quiet light page, clear typography, descriptive labels and a worked scenario. Use system fonts so downloads have no font requests. src/shared/theme.css provides the starting palette and catalog layout.

## Demo layout

Title, one-sentence learning goal and version/date first. Keep the main diagram/chart in the first laptop viewport; place compact controls alongside it, then below at narrow widths. Show 3–5 key results with units and a short causal explanation. Group presets and Reset clearly. Put formulas, caveats and advanced settings in labeled disclosures.

Use dark text, blue primary actions, orange warning/constraint, green favorable outcome and neutral gray comparison. Never rely on color alone; add text, shape or patterns. Use a restrained type scale and spacing. Axes have names, units, sensible scale and a labeled zero where applicable; disclose truncated axes. Clearly distinguish stock, rate, cumulative count and observed/expected plots.

## Controls and help

Use real buttons, labels and form inputs. Numeric fields allow exact entry; sliders have readable current values, units and keyboard control. Targets are at least 44 px where practical. Visible focus is required. Every important unfamiliar term has a small information button with a specific accessible name. Its popover works on click, tap, Enter/Space and Escape; manage focus and restore it on close. Do not hide essential units or invalid-state warnings in help.

For repeated definitions, extend src/shared/glossary.json in source and inline any required definitions in app.js or page.html during authoring; the browser must never fetch the JSON file. Keep 35–90 word help concise, original and assumption-aware.

## States and motion

Show valid defaults immediately. Presets reset all relevant inputs, seed and simulation time. Invalid inputs explain what failed and suppress invalid metrics. Use a stable comparison baseline for explanations. If motion teaches a process, provide Pause/Play and respect prefers-reduced-motion. Animation speed cannot change the mathematical outcome. Ensure charts also have textual numbers/summary.

Test at 360 px and laptop widths without horizontal page overflow. Avoid hover-only interactions. Keep controls readable when zoomed. Detached downloads must identify their topic and assumptions, even when no catalog or internet is present.
