# Shared requirements

This is the working engineering standard derived from the supplied MBA Interactive Learning Lab planning specification v1.0 (2026-10-30). The owner requested two repositories; this split supersedes the original one-repository layout. Seven briefs live here and seven in the sibling collection. The original documents remain in the private intake workspace.

## Learning outcome and interaction

Teach one central intuition in two to five minutes. Start with a fully worked, valid default. Use a dominant live visual, 2–5 primary controls with exact numeric entry, 3–5 results with units, 2–4 meaningful presets (some briefs propose more), Reset, and a concise explanation of what changed and why. Compare with a saved baseline when several inputs change. Keep the core equation(s), defined symbols beside variable names, and a live numerical substitution visible in the main view. Secondary modes/settings and full derivations can go behind a disclosure. A prediction prompt is optional and never blocks the answer.

Every important input and unfamiliar output needs accessible information help: definition, units, effect of changing it, formula when helpful, and assumptions. Hover alone is insufficient; click/touch and keyboard must work. Use original paraphrases, not invented faculty quotes. Related concepts should be optional, limited to 2–3, and never necessary to run an isolated download.

## Mathematical integrity

- Separate input validation, pure domain calculations, formatting and rendering. Every chart, result and numeric explanation consumes the same model output.
- Retain internal precision. Convert units before arithmetic. Label period, rates, stocks, cumulative counts, expected values and observed samples distinctly.
- State simplifications, feasibility limits and undefined results visibly. Never silently clamp economics or hide an unstable queue behind finite steady-state numbers.
- Simulations use deterministic seeds, event time separate from animation time, consistent boundaries/measurement windows, disclosed warm-up/censoring, and conservation checks.
- Validate every worked numerical example independently; test a boundary and an invalid input plus applicable invariants. Source planning text can be wrong or ambiguous; document corrections.

## Subject safeguards

Operations: cycle time defaults to time between completions; throughput time is elapsed time in the system; capacity is a limit, throughput an achieved rate. Little's Law relates consistent long-run averages in a stable system. O4 requires a general event-based piecewise-linear accumulation model with independently timed multiple inflows/outflows, constrained empty/full boundaries, exact segment areas and flow accounting. A hard-coded triangle/trapezoid is insufficient. O5 separates M/M/1 theory and samples and hides finite steady-state results when arrival rate is at least service rate. O7 separates statistical control limits from customer specifications.

Finance: match cash-flow and discount-rate periods, risks and conventions. Apply WACC to appropriate unlevered FCF, with market-value weights. Label fixed component-cost capital structure demonstrations as illustrative. Keep operating value, nonoperating assets, debt and equity separate. DCF terminal value is measured at year N and discounted N periods; growing perpetuity requires discount rate above growth. NPV includes time zero. IRR may be multiple, absent or misleading. Accounting returns need consistent definitions and denominator periods.

## Portable distribution

One finished demo equals one docs/downloads/<slug>.html. All essential CSS, scripts, graphics and data are embedded. No account, installation, server, local fetch, external assets, network access or analytics. Desktop browsers and 360 px layout are the initial targets. Include a visible version/date and model assumptions within each file so detached copies remain understandable.

Source convention: src/<slug>/{page.html,styles.css,model.js,app.js}; shared source: src/shared/; domain tests: tests/<slug>.test.cjs; browser evidence: verification/<slug>.md. scripts/manage.py produces docs/index.html and ready downloads. docs/ is the only Pages publishing root. catalog.json is the status/title/path source of truth.

## Definition of ready

The stated learning interaction is discoverable; worked model examples, invalid/boundary cases and applicable invariants pass; help and units match the math; presets reset all relevant settings and seed; controls work; file:// offline operation and hosted-style download are tested; laptop/narrow layout and keyboard are checked; no unexplained browser errors or runtime requests; evidence is written; source and distribution are synchronized; public content is original or approved for distribution. Another classmate can use it without its developer.

## Initial sequence

Pilot F3 WACC and O5 M/M/1; an O2 bottleneck pilot is a simpler deterministic alternative. Then F5 DCF and the remaining Wave 1 topics; proceed to Wave 2 including the high-interest O4 flow accumulation model; Wave 3 adds risk/CAPM, performance and quality. This sequence is a recommendation, not a requirement to build before demand exists. Consult catalog.json for wave assignments.
