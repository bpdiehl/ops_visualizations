# O2 — Bottlenecks — v0.3.4 owner-review draft

Status: **draft, not published**. November 3, 2026. Reviewed by the coding assistant; owner review pending.

Source base: Operations main at f8b25d9f65d6f6c5e387b5c0526cb9ae81cdbe9a plus the O2 draft changes recorded below. Current development preview: bottlenecks.html, 58,369 bytes, SHA-256 `650e47833d0bc24110e2f01fc2ccd7bca77adfce006d1826927478eebd91e659`. The preview is ignored by Git and not under the public docs directory. M/M/1's released download is unchanged.

## Scope and assumptions

Exactly three serial stations, one product, deterministic usable per-resource rates, independent identical parallel resources, sufficient materials, coordinated release, nonrestrictive buffers, 100% yield and no other losses. r_out is the ideal line output rate after startup, not observed completions. Queue lengths, waiting times, startup animation, more stations, yield/mix conversion, layouts and costs are deferred. Examples are illustrative. Public capacity/utilization definitions were checked against the CSUN study guide linked in the brief and in-app References; no course-case data is claimed.

## Numerical and packaging evidence

- `node --test tests/bottlenecks.test.cjs`: 18/18 passed.
- `python3 scripts/manage.py preview bottlenecks`: passed, including the static standalone packaging gate.
- `python3 scripts/manage.py build`: passed. Catalog marks O2 draft; no O2 public download exists.
- `python3 scripts/manage.py check`: passed, 38 Node tests (18 O2 and 20 M/M/1) plus 6 Python packaging tests, source syntax and ready-output synchronization.
- `git diff --check`: passed. Focused scan of new source, model tests and brief found no private filesystem paths/source-dump identifiers.

Independent numerical targets: 12/8/10 with demand14 gives C=X=8 and utilization66.666…%,100%,80%; B→11 gives C=X=10, a gain2 rather than3. A→24 leaves output8. Tied8/8/12 flags A and B; improving just one cannot raise capacity. Demand6 gives X6,C8, B utilization75%. Two B resources give B capacity16 and output10. Zero demand idles positive-capacity stations; a stopped B gives output0 and undefined B utilization. Invalid/missing/nonfinite/out-of-range values are rejected. Grid invariants, scaling, permutation and precision/input-isolation tests passed.

## Initial v0.1 browser checks

Environment: Codex in-app browser on macOS through supported CUA controls; engine/version not reported. Served development preview over local HTTP on port8774.

- Starting case: X8.00, B limits output, substitutions and station table agree.
- Every preset: Improve B→10.00, constraint C; tied case flags A and B at8.00; low demand→6.00 with demand label; middle case and Reset restore starting inputs.
- Exact entry: A24 leaves X8.00; then B11 moves constraint to C at10.00. Save current case sets comparison gain to0.00. Demand0 gives0.00 and No demand.
- Stopped B shows0.00 throughput and — utilization only at the zero-capacity station. B31 and blank B show a visible input error, clear chart/worked metrics and disable save/download; Reset recovers.
- Parallel resources: B2 produces capacity16.00 and throughput10.00. Expanded resource field and info-button columns align at360px (all inputs104px wide, identical x positions).
- Keyboard slider: right-arrow B8.00→8.01, worked rate changes and soft editing feedback appears; it subsequently clears. Numeric substitution slots retain fixed widths. A more precise8.123 entry remains8.123 after blur, while rendered output is8.12.
- Key: one symbol per row, collapsed initially. Clicking index i highlighted all9 subscripts in the core equations (generic i and station A/B/C), including nested station/system expressions. Keyboard Enter on C highlighted only system C and its numerical values, not station C_i. Escape cleared all highlights.
- Information dialog opened by click and keyboard Enter; Escape closed it and restored focus to its source button. Utilization help explicitly explains0/0.
- Layout:360×800 and1280×900 had no horizontal document overflow. At360px paired input rows share y coordinates; resources align. At laptop width all four primary fields share x and width. The vertical chart title is rotated along the left axis. Main equations and the complete capacity plot are visible together at laptop height; station table continues below.
- Full-page screenshot inspected; retained privately with the owner-review record. Temporary viewport override reset before handoff. Preview tab retained for owner use.
- Captured browser warning/error logs were empty after final reload and interactions. Comprehensive request instrumentation was not available; static packaging rejects runtime network dependencies. This is not a claim of observed zero requests while offline.

## v0.2 owner refinements — observed browser evidence

Rate units now read **units/hour**. Help/key define the rate of one machine; counts are labeled **Parallel machines** with station-specific machine fields. Added p_i in minutes/unit, minute/hour conversion, and a Rate / Time per unit toggle. The symbolic station-capacity equation shows both forms; worked values follow the selected input view. Three stations retained. Model conversion tests cover 12↔5, 8↔7.5, 30↔2, two parallel machines, nonterminating reciprocals, invalid/zero times and infinite time for a stopped machine. Full check command now passes44 checks (38 Node and6 Python).

Observed with CUA in the same in-app browser:

- Starting times5.00,7.50,6.00 preserve throughput8.00. Rate11 becomes time5.45 in display; five complete rate/time round trips preserve the entire utilization table and restore rate11.00, proving the display is not round-tripped as model input.
- Time12 at B lowers throughput to5.00; time5 raises it to10.00 with constraint C. Time0 gives an explicit minutes/unit error and suppresses results. Entering∞ yields throughput0.00, the expected worked denominator∞ and a disabled time slider; Rate then shows0.00. A finite time restarts the station.
- Keyboard right-arrow time7.50→7.51 changes throughput to7.99; soft glow targets p_i and its current time value. Two parallel B machines then give B capacity15.98 and system output10.00. Renamed help opens and Escape closes.
- All four presets retain the selected time view and correct results; ties/low-demand rechecked. Saved low-demand case remains at zero comparison change when switching views. Reset restores Rate and the starting example.
- The new p_i key targets all four core p terms (symbol and three substitutions), with no incorrect r highlights. Every subscript in the updated core equations has its index marker; the earlier index/key checks remain recorded above.
- At360×800 and1280×900 there is no document/equation overflow. Paired mobile rows align; all four laptop fields have equal x positions and104px widths. Normal viewport restored afterward. Screenshot inspected and retained privately with owner review record; retained preview shows Time per unit and expanded Parallel machines.
- Captured warning/error logs remained empty. No saved-file/download retry was made; prior environment limits still apply.

## Limits and decision

Clicking Download HTML triggered the expected save notice, but the supported download-event capture timed out. The actual saved file and filename were not observed. The same environment previously rejected file:// navigation; detached-file/network-blocked execution is still **unverified**, not inferred from the static gate. No download is available from the public catalog while O2 is draft. Reduced-motion CSS inherits the shared no-transition/no-animation rule and was inspected in source; a live reduced-motion override and cross-browser/device tests were not performed.

Owner may test the local draft now. Keep draft status until feedback/release approval. No commit, push, deployment or license selection occurred.

## Owner review notation update — 2026-11-03

Replaced the displayed cycle-time notation p_i with CT_i across the equation, substituted values, input labels, help and key; kept C for capacity. Refreshed the local preview. This notation-only revision was visually inspected in the browser; the automated suite was not rerun. Earlier v0.2 browser and model evidence above predates this revision.

## Owner review output notation update — 2026-11-03

Owner selected r_out for line Output rate after discussing alternatives. Replaced displayed X and the interim OR with r_out in the live equation/result, comparison, help, utilization relation and notation key. Model calculations remain unchanged. The regenerated 8775 preview was visually inspected with equations expanded and r_out selected in the key; r_out and its numerical values highlighted in the equation, result and utilization examples. Automated tests were not rerun for this notation-only revision.

## Owner review layout update — 2026-11-03

Added live utilization values and its information button as a fourth equation column beside station capacity, system capacity and line output rate. Matched the DCF disclosure style with a native left-side arrow and concise “Station & system capacity” heading. The refreshed 8775 preview was inspected collapsed and expanded; the four equations and substitutions, including the utilization values, were visible above the notation key. `git diff --check` passed; automated tests were not rerun for this layout-only change.
