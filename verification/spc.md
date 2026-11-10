# O7 Quality: SPC & Capability — local draft

November 9, 2026. Local owner-review draft; no commit, push, deployment or public SPC download. Catalog remains draft.

## Owner-requested X̄ specification reference lines

LSL/USL are now drawn on X̄ as purple dotted reference lines with left-side labels explicitly saying individual items. The blue control-limit lines and right-side labels remain distinct. The legend and view help explain that item specifications are not acceptance bounds for subgroup averages. No specification lines are added to R; the separate individual-reading specification plot remains available. Buttons are unchanged, per the owner.

Browser checks: default LSL46/USL54 appear at distinct Y positions, with no specification lines on R. Widening to35/65 keeps both lines visible via frame expansion; X̄ upper-limit substitution stays identical and the complete R SVG remains unchanged. Reset restores46/54 and the In control baseline. Updated help verified; captured warning/error logs empty. Final desktop screenshot inspected.96automated checks pass; model/signal definitions unchanged. This supersedes the earlier decision to keep specification lines off X̄, and the earlier claim that its entire SVG stays unchanged when specifications change. No additional offline/download/browser coverage.

## Matching examples, control baseline and collapsible equations

Owner requested matching example visuals in both tabs, an In control default in Control charts, and collapsible equations. Both tabs now use the same three-column example grid and button classes; Control charts has6 buttons and Capability3. The added In control baseline is the same centered seed42 process as In control & capable, with its own control-focused lesson. It is selected initially and by Reset on Control charts. Tab switching still preserves inputs.

Per the owner's explicit request for this visualization, the core equation panel now uses a native disclosure and starts closed; the nested Symbols & units disclosure remains closed. This supersedes the earlier always-visible equation presentation for this draft only.

Browser checks: initial and post-Reset In control selected, zeroX̄/zeroR signals. Both tabs' selected buttons have identical49px height,13.44px type,650 weight,8px/12px padding,6px corners and background. Capability still contains exactly its three comparisons. Expanded capability shows aligned Cp1.333 substitution and closed nested key. Expanded control equations show the51.283 upper-limit substitution; close works and leaves inputs intact. Final screenshot inspected on default Control charts with equations closed,16px disclosure title, matching six-button grid. Captured warnings/errors empty.96 checks still pass; no new offline/download/cross-browser coverage.

## Tab examples and individual specification plot — owner refinement

Capability shows only the three prominent in-control comparison examples. Control charts shows only the five change/signal examples. Global preset indices are retained, so each button still loads its intended case. The short preset lesson is scoped to the active tab; switching tabs preserves inputs and reference limits instead of selecting another preset automatically.

A closed-by-default Individual measurements vs specifications plot accompanies the control charts. It shows every raw reading by subgroup, LSL/USL lines, outside-specification colors and the selected subgroup. Specifications are not overlaid on X̄ or R: those charts plot subgroup means and within-subgroup ranges, respectively. Clicking a raw reading selects the same subgroup used in the main charts and measurement equations.

Browser verification: Control charts exposes exactly indices3–7; Capability exactly0–2. More variation seed5/σ3 survives the tab switch, with no stale lesson shown in Capability. Capability off-center still loads Cp2.667/Cpk0.333. Individual plot shows250 readings at n5 and21 monitoring readings outside46–54 mm; both specification labels appear only on this plot. Clicking a group10 reading selects10. Changing specs to49/51 updates both lines while X̄ SVG remains byte-for-byte unchanged; restored46/54 afterwards. Final desktop screenshot inspected and warning/error logs empty. No new download/offline/cross-browser claims; model is unchanged and96 automated checks remain passing.

## v0.2 — explicit examples, fixed scales and separate statuses

This section supersedes the v0.1 example values, seed choices and endpoint-only visual treatment below. No commit/push or public download.

All points participating in completed runs/trends now have a rust halo/fill; endpoint diamonds still record when the signal became available. Unrelated points retain reference/monitoring colors. Completed pattern membership can include earlier points without changing their earlier endpoint signal status. Independent membership tests include unrelated neighbors and six/eight-point windows.

The three prominent comparison presets use seed42 to hold random draws constant. X̄ axes remain44–56 mm and R axes0–16 mm across all three. Capability density axes remain35–65 mm and0–1/mm across them. Extreme values expand frames only as needed. Browser comparison confirmed identical tick arrays while the plotted point positions and curve shapes change.

| Example | Seed | X̄ / R signal endpoints | Explicit feature |
| --- | ---: | --- | --- |
| In control & capable | 42 | 0 / 0 | Centered μ50, σ1; Cpk1.333, observed outside0% |
| In control, off-center | 42 | 0 / 0 | μ53.5, σ0.5; Cpk0.333, observed outside16.8% |
| In control, too much variation | 42 | 0 / 0 | μ50, σ3; Cpk0.444, observed outside19.2% |
| Mean shift, wide specs | 5 | 25 / 0 | Monitoring mean52; observed items all within specs |
| More variation | 5 | 7 / 23 | Monitoring σ3, historical σ1 |
| One unusual measurement | 8 | 1 / 1 | Only subgroup38 highlighted on both charts; no coincident run/trend |
| Run within limits | 1 | 14 / 0 | All21 points in overlapping windows26–46 highlighted |
| Trend within limits | 28 | 1 / 0 | All6 points42–47 highlighted, all inside limits |

The trend preset is explicitly described as a selected random sample that triggers a trend by chance; it does not invent an underlying drift generator. Short lesson copy identifies each preset's intended observation. Candidate outlier seed7 was rejected after browser inspection found a coincident trend; final seed8 isolates the limit violation.

Capability now has a **Current model: capable/not capable** badge according to the adjustable modeled Cpk goal, and a separate **Control charts: in/out of control** assessment with rule counts, historical/current parameter comparison and View signals action. Conditional long-run interpretation remains in the information dialog; a high current-model Cpk is not presented as proof of in-control history. Contaminated-reference warning remains visible independently.

Reproduced owner screenshot in the browser: seed10, μ50, σ0.25, LSL39.8, USL61.7. Cp14.600/Cpk13.600 and current-model capable; historical charts19X̄/18R endpoints, with lower current spread versus historicalσ1 explicitly explained. View signals preserves seed10 andσ0.25; return to Capability preserves inputs. New explanatory help opens/closes with Escape. Final screenshot inspected, error/warning logs empty.

Final checks: **89 Node + 7 Python = 96 passing**, including17SPC model tests. New tests verify membership, stronger comparison presets, selected trend seed and screenshot reproduction. Previous offline/cross-browser/full-keyboard limitations remain. No latest download execution claim.

## Scope and sources

Two linked tabs, original normal length measurements, historical/monitoring subgroups, X̄/R charts, frozen reference limits, explicit selected-prefix recalculation and modeled Cp/Cpk. Known model μ/σ drive capability; fitted reference σ and observed conformance remain separate. See [brief and primary references](../specs/spc.md). In control is owner-required terminology.

Both charts evaluate strict beyond-limit points, eight consecutive points strictly on one side of the centerline, and six strictly monotonic points. Equality breaks a run/trend. Signals occur at qualifying endpoints; overlapping windows can yield successive signals. A highlighted window supplies context without retroactively flagging earlier points. Counts are endpoints, not independent incidents. Other pattern/zone rules are not automated. A random process can signal; no signal is not proof of control.

## Automated evidence

`python3 scripts/manage.py build` and `check` passed: **85 Node + 7 Python checks (92 total)**. Thirteen SPC model tests cover:

- Exact NIST A2/D3/D4 and official Minitab d2 table, n2–10.
- Independently worked n5 subgroups: center50.5, Rbar4, X̄ limits48.192/52.808, R limits0/8.46, sigma estimate1.7196904557.
- Independent Cp1/Cpk2/3 reference, normal-CDF/tail values and negative Cpk.
- Specs, target and goal cannot change measurements/control limits; moving μ/σ does not move historical reference limits.
- Original six cases retain intended signal/capability behavior; explicit contaminated snapshot persists until replaced.
- Seed reproducibility, subgroup size, input isolation and invalid/boundary values.
- Strict beyond-limit boundary; eight-point upper/lower runs only signal at completing endpoints; equality/side changes reset the window.
- Six-point rising/falling fixtures entirely inside limits; ties/reversals/only five points do not signal.
- Combined rules, overlapping windows and prefix invariance (no future data).
- Run-within-limits seed1: 14 mean-chart signal endpoints, zero range signals, zero beyond-limit points and zero observed outside-specification readings.

JavaScript syntax and `git diff --check` passed. Packaging remains offline-compatible by static gate; that does not prove detached-file execution.

## Desktop browser evidence

CUA in-app browser on macOS, engine version not reported, HTTP preview port8776. Desktop only, following owner direction.

- Default charts: zero signals on both charts. Screenshot checked aligned four-column equations, vertically rotated y-axis labels, shared symbol/key styling and aligned sidebar controls. Replaced unsupported double-overbar Unicode with a CSS double overbar.
- Run within limits: Out of control, 14 X̄/0 R endpoints; details list groups26–33 as the first eight-above run. Inspect33 selects33, gives the rule reason and highlights the eight-point segment. Every point remains inside limits (independent model check).
- Capability retains μ50.50 and the selected subgroup when switching tabs; observed outside0.0000% with an out-of-control capability warning. Off-center preset: In control, modeled Cp2.667/Cpk0.667.
- All19 key entries (control9, capability6, subgroup4) clicked: nonempty exact symbolic and numeric equation counterparts all highlighted. Keys are derived from actual displayed formula symbols, not a global inventory.
- Invalid LSL55 gives a visible bound/specification error; Reset restores valid rendering.
- Mean-shift case reference-end50 selection alone leaves limits unchanged. Recalculate produces a contaminated-reference warning and snapshot1–50; Original reference restores exact prior limits. n10 starts reference1–25; New sample changes seed42→43.
- Mean slider keyboard Right changes50.00→50.10. Help opens; Escape closes. Complete keyboard/help coverage not claimed.
- Final screenshot: run-within-limits case, selected33, signal details open; no document overflow at normal desktop viewport. Saved locally as a review artifact, not distributed.
- Captured warning/error logs empty. No instrumented network-failure coverage claimed.

## Limits and next validation

Not tested: latest actual HTML download/save, detached file execution with network blocked, cross-browser, full keyboard coverage, every help dialog, reduced-motion override. Existing browser file-URL policy restriction remains; no workaround attempted. No narrow/mobile optimization, per owner. No empirical production-data validation or capability confidence intervals. Owner tests draft next; release/download catalog generation waits for approval.
