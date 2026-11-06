# Equation presentation and consistency release review — November 6, 2026

Owner requested numerical terms directly beneath corresponding symbols, familiar textbook fractions in symbolic and numerical rows, and consistent result positions. The owner authorized these reviewed changes for commit and push on November 6, 2026.

## Implementation

The small shared equation-layout helper is copied into each independent repository and inlined by the builder before the app. There are no runtime file imports or new network dependencies. Each app supplies semantic symbol/value tokens from its existing model. Symbolic and numerical rows share CSS grid columns; numerator/denominator atoms use matching widths. Long equations scroll inside a keyboard-focusable region. Existing precision and symbol/edit metadata are retained. Values/results now stay on the same side of the equals sign in both rows.

WACC weights use stacked market-value fractions normalized to the existing $100 financing illustration; numerator values update with the debt slider. DCF splits the long NOPAT equality chain into EBIT-from-margin and NOPAT steps. NPV/IRR expands the cash-flow terms so each fraction aligns with its numbers; multiple roots each have a numerical row and rounded IRR substitutions use ≈. Queueing, bottleneck and batching calculations retain their original mathematical models and invalid/stability conditions. Queue distribution means now have their own correctly paired equations, alongside the density/PMF formulas.

## Browser audit

Supported in-app browser on macOS, engine version not reported. Local HTTP previews (Finance8777; Operations8776). Read-only DOM measurements compared symbolic/value grid-column positions: no mismatches at laptop width or360px across the seven built demos (WACC, DCF, NPV/IRR, FCF, M/M/1, Bottlenecks, Batching). Equation group counts are3,14,2,4,9,4,4 respectively. DCF/Bottlenecks disclosures were opened for measurement. Screenshots inspected for WACC, DCF, NPV, M/M/1, Batching and FCF; the remaining Bottlenecks layout was measured and its cycle-time mode exercised. The NPV360px page initially overflowed by26px; constraining the equation parents fixed it, and it was remeasured at360px with a360px page. Long equations remain internally scrollable.

WACC debt40.5% updated normalized equation numerators59.50 and40.50. NPV two-root case retained10%/20%; a blank cash flow displayed validation. Queue arrival=service suppressed finite long-run means; zero arrivals displayed no finite arrival-gap mean. Bottlenecks Cycle Time mode showed3 stacked station fractions and unchanged default capacities12/8/10. DCF r=g suppressed operating valuation while retaining the explanatory terminal-year CF. Captured browser warning/error logs were empty in the audited loads. Temporary viewport overrides were reset.

## Scope and limits

New DCF terminal-year and FCF interaction evidence is in their individual records. No new file:// or network-blocked offline run, cross-browser test, reduced-motion emulation, exhaustive every-control/preset pass across all seven, or new catalog download test was performed for this presentation audit. Prior omissions remain applicable. Packaging checks prove embedding, not real offline execution. The current owner request authorizes publication; prior local-only restrictions are historical.

## Final consistency and release pass — November 6, 2026

The seven demos share amber attention tokens (#fff1c7 wash, #c59b3b edge), a soft matching glow, neutral notation buttons, and common graph-legend typography/spacing. Graph series colors and distinct line/bar markers are retained. Large DCF notation remains grouped; smaller keys keep their existing layouts. Corrected DCF font/hover specificity and Bottlenecks symbol-button font; inline-block symbol buttons preserve natural subscript/superscript positioning.

Browser computed styles confirmed the same 16.32px notation-button font, neutral RGB247/249/252 background and RGB210/220/229 border in DCF, NPV, FCF, Bottlenecks and Batching; graph legend text is11.84px across all seven. Pinned DCF/FCF/Bottlenecks/Batching symbols showed RGB255/241/199 attention wash and identical shadow. WACC/MM1 number edits produced the expected editing classes and values. Rechecked all seven at360px after the final CSS change: page width360px, no symbolic/numeric column mismatches. Inspected DCF/FCF/Bottlenecks screenshots and retained existing user input values in the review tabs. Captured warning/error logs were empty during audited loads.

Batching Small/Middle/Large presets again constrained A/B/C with capacities9.23/26.67/30.00 units/hour. Generated catalogs show4 Finance and3 Operations ready demos; local catalog Open actions loaded FCF and Bottlenecks without captured browser errors. A Batching catalog download-event test timed out in browser automation; its completion and detached-file execution were not verified in this pass. The earlier offline/browser limits remain. The generated files remain entirely embedded, and the packaging regression checks helper inclusion exactly once, before app startup, plus rejection of an unsafe closing script tag.

Final build/check evidence: 46 Node model tests and 7 Python checks pass. Shared helper/theme copies match across the independent repositories. Owner authorized commit and push.
