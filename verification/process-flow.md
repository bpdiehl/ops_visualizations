# Process Flow v0.3 — steady-state cycle time and throughput time

Owner approved desktop-focused v0.3 for commit and push November 7, 2026. Catalog status is ready and the standalone artifact is generated for publication. This draft replaces the v0.2 model and interface described below.

## Scope and model

The model assumes a steady supply of work, deterministic processing, serial stations, instant transfers, and no intermediate WIP storage or variability. Station processing times default to A=2, B=4, C=1 min/unit. The governing relations and current substitutions are available in a full-width, collapsed-by-default Equations disclosure; the main assumptions remain in a separate full-width panel. CT, TPT and other core quantities remain visible in the main result area.

The line cycle time is set by its slowest station: `CT_line = max(p_i) = 4.00 min/unit`. Throughput time for one unit is the sum of station processing times: `TPT = Σp_i = 7.00 min`. Output rate is `r_out = 60/CT_line = 15.00 units/hour`. Station utilization is `U_i = p_i/CT_line`, giving 50%, 100%, and 25%. Preset `[2,2,4]` demonstrates a 2-minute station on a line with a 4-minute cycle time.

There are one to six processes. Users can add or remove processes and change processing times. The process diagram is first and uses a distinct title color for each process; a soft matching glow indicates processing, and idle stations stay plain. The unit-following animation repeats against the actual CT-paced release schedule. At the exit, the followed unit waits for its next scheduled entrance, so it does not duplicate a unit or move upstream early. CT mode measures the interval between successive crossings at a selected process point.

## Verification

Measurement slider fix: its HTML minimum was 1 (after process A), excluding the entrance and process A interior. Changed the minimum to 0 in markup and process-count setup; maximum remains the current process count. Reloaded desktop preview and exercised slider values 0 (Entrance), 0.5 (mid A), 2.5 (mid C), and 3 (Exit), confirming marker labels and diagram positions. Build and all 63 checks passed.

Latest layout refinement: TPT and CT equations sit side by side, with station utilization equations in a separate automatic column grid below. The expanded desktop preview was reloaded and visually checked; default utilization shows three columns. Build and all 63 checks passed again.

- `python3 scripts/manage.py build` succeeded; only ready demos are distributed.
- `python3 scripts/manage.py check` passed: 56 Node tests and 7 Python packaging tests (63 total), including 10 Process Flow tests. `git diff --check` passed.
- `node --check src/process-flow/app.js` and `node --test tests/process-flow.test.cjs` passed.
- In-app desktop preview confirmed the default A=2/B=4/C=1, TPT=7, CT=4, output rate=15/hour, and utilization=50%/100%/25%. The `[2,2,4]` preset changed the bottleneck and updated TPT/utilization; adding and removing a process updated calculations and diagram.
- CT at the point after A displayed `4.00 = 6.00 − 2.00`. Playback was observed with station-colored activity glows. Follow-one-unit playback at 4× showed the unit at the exit waiting for its actual next entry at minute 8, without a duplicate at the entrance.
- Reset restored defaults, TPT mode, whole-process view, speed 1×, and collapsed equations. The desktop preview viewport was used; no mobile optimization is intended.

## Limits

Browser drag gestures were not directly exercised. Offline `file://` download execution and cross-browser coverage are unverified. Release is owner-authorized; these verification omissions remain documented.

---

# Process Flow v0.2 — two observation clocks

Local owner-review draft, November7,2026. No commit/push or public download. This redesign supersedes the v0.1 interface documented below.

## Scope and evidence

Two modes share one deterministic FIFO schedule. Follow a unit animates an amber unit across processing progress and pauses it for waiting, with a stopwatch from entry to exit. Watch a point holds a marker fixed and times the first selected unit's crossing to the next selected unit's crossing. Two prominent aligned difference equations, a collapsed six-row key and explicit Upcoming/Observed event tiles connect both clocks to absolute model times. Stage controls retain exact fields/sliders, shared amber feedback and aligned units/info columns. Process details moved into a disclosure.

Marker coordinates are stored independently of whole-process/station zoom. Interior positions mean processing progress; integer boundaries mean arrival before downstream waiting. Position graphics do not invent travel time. Marker can be placed by diagram click/drag, keyboard slider or boundary buttons; offscreen marker/unit is disclosed with a Show action. Touch permits vertical page scrolling and distinguishes a horizontal marker drag from a tap.

Fifteen model tests now include independent crossing timestamps, entrance/exit/boundary states, position inversion, monotonic motion, invalid queries and buildup. Default unit5 entry16/exit25 gives TPT9; default crossing gaps4 at all tested points. With arrivals24/hour, afterA/beforeB gives2.50 while midB/exit give4.00. This local difference is explicitly explained; arbitrary-point CT is not claimed invariant during queue buildup.

Final repository checks:61 Node tests and7 Python checks passed (68 total); preview packaging, JS syntax and diff whitespace passed. No ready downloads changed.

## Browser audit — macOS in-app browser

- Default TPT event steps: clock16→18→22→25, elapsed0→2→6→9, status A→B→C→exit. Explicit Play advanced the dot/clock together and automatically stopped at25 with elapsed9 and Play restored.
- CT playback at midB automatically stopped at clock24 with elapsed4.00, both crossings Observed and Play restored. Reset restored TPT, unit5, whole view, marker at exit and elapsed0; checked by keyboard and stable-layout mouse click.
- CT at exit: starts at24 waiting for unit5; event step25 starts interval at0, step29 stops at4.00 with both crossings Observed. Clicking the diagram placed marker at50% throughB (later mobile click51% due pixel rounding), with independent first/second timestamps20/24. ArrowRight51% changed them to20.04/24.04 and preserved4.00 gap.
- Changing View toB preserved marker position, clock and crossing times exactly. Growing-queue afterA marker showed12/14.50 (gap2.50). ViewC preserved the measurement while reporting marker offscreen; Show marker brought it back into view without changing time. Exit then showed25/29 (gap4).
- All illustrative presets exercised: slow arrivals TPT9/CT10; fasterA TPT8/CT4; buildup unit5 TPT15/exitCT4. Zero arrivals suppresses both undefined measurements and disables Play. One-unit arrival rate0.5 retains TPT9 while explaining that CT needs two units. Blank arrival suppresses stale values with validation.
- Help Escape closes the dialog and restores its trigger's focus. Key t1 highlights the exact symbolic/numeric terms, with shared RGB255/241/199 wash and16.32px key buttons.
- At360×850 and1280×850, no horizontal page overflow or symbolic/numeric term-column mismatch. Main numeric/info/unit columns align. Dots and station labels adapt to viewport width. A first compact-diagram version let the marker line extend below the SVG; its line/clip bounds were corrected to the selected diagram height. Temporary viewport overrides reset after inspection.
- Captured browser warning/error logs empty during audited loads. Laptop/phone screenshots inspected. Actual pointer drag gestures and reduced-motion emulation were not exercised; click, keyboard marker placement and code-level capture/scroll handling were checked. Download/file:// completion and cross-browser coverage remain unverified; prior delivery limits below still apply.


---

## Historical v0.1 evidence

# Process Flow v0.1 — local owner-review draft

November6,2026. Not committed/pushed or included in public downloads. Preview generated by `python3 scripts/manage.py preview process-flow` and served from .preview/ at localhost8776. Source in src/process-flow/; draft catalog status does not create a download. All examples and diagrams are original illustrations.

## Delivered scope and model evidence

Three dedicated FIFO stations with fixed processing times, unlimited queues and instant transfers. Regular arrivals in [0,60), first at0; schedule continues until every unit exits. Playback consumes the pure schedule and cannot alter outcomes. CT/r_out describe sustained pace while supply continues, distinct from individual TPT and startup/drain averages. UI has three station CT sliders and an arrival slider, exact entry, four presets, Reset, unit selection, Play/Pause, Next event, Restart and clock scrubbing. Main equations, station capacity and total processing calculations are paired in shared grids; core relations stay visible. Collapsed key uses separate i/j/t rows and amber exact-occurrence highlights.

Eleven Node tests cover independent two-station2/3 schedule (capacity20, CT3, first TPT5), default15/hour with2/4/3 times (CT4, TPT9), sparse arrivals, overloaded queues, nonconstraint speedup, a single station, zero arrivals, exact boundaries/no arrival at60, FIFO/machine exclusivity, snapshot conservation and invalid inputs. Independent step-function occupancy integration matches full cohort residence area. Complete-run Little identity uses the same cohort, time units and observation window; it is explicitly not a steady-state estimate. Sparse/NaN/coerced/invalid arrays reject. Pure model supports1–4 stations; UI deliberately fixes3.

Default:15 units, first exit9, unit5 enters16 and exits25, last exit65, average WIP27/13, average output180/13 units/hour, mean TPT9. Overload24/hour: unit5 TPT15 with6 waiting, last of24 exits101, mean TPT26.25. Faster A: CT4 unchanged, TPT8. These values are independently asserted rather than copied from display.

## Browser verification

In-app browser on macOS; engine version unavailable. Laptop1280px and phone360×850.

- All four presets exercised: slow arrivals CT10/TPT9; growing queue CT4/TPT15 for unit5 with visible overload warning; faster A CT4/TPT8; reset CT4/TPT9. Unit10 selection moved clock to40 and journey36→45.
- Default clock20 snapshot3=6−3; Next event21 snapshot2=6−4; clock25 snapshot2=7−5. Restart/Next and numeric clock inputs update actual schedule state. Clock1000 showed a range message and retained the last valid snapshot.
- Playback advanced from20 to21.75, later reached65, automatically paused and showed0=15−15. Opening help pauses playback; Escape closes dialog and restores focus to its trigger.
- Zero arrivals: empty diagram,0 WIP, undefined CT/TPT suppressed, no tracked unit, Play disabled. Blank arrival: descriptive validation and stale numerical values/diagrams cleared. Input0.001 rounded to the supported two input decimals on blur and correctly became an empty run.
- ArrowRight on stationA changed2→2.25, updated total processing9.25 and corresponding plot/equation/table feedback. Fourteen edited elements were visible immediately; feedback later cleared to0. Key buttons use shared16.32px symbol type and selected RGB255/241/199. CT_i highlights station equations/current numbers; i targets indices and j highlights the two equation subscript occurrences, excluding unrelated key rows.
- Symbolic/numerical column measurements: no mismatches at1280 or360. At360, document width360; process diagram scrolls within its region, journey/exit charts redraw to readable width. Clock label/field/unit were aligned after an initial mobile wrap was corrected. Number/info control columns align at laptop width. Temporary viewport reset.
- Captured warning/error logs empty in audited loads. Screenshots inspected at laptop/full-page and phone widths. Reference link is optional; no runtime resources are needed by packaging validation.

## Verification limits

Full browser download completion and isolated file:// execution with network blocked were not repeated: the prior environment file policy and catalog download-event timeout remain known limits. Packaging is not proof of offline browser execution. Cross-browser and reduced-motion emulation were not performed. CSS disables transitions/animations for reduced motion, playback starts paused and all event/scrub controls remain available. No claim that every possible numeric combination was browser-tested. This is an owner-review draft; public readiness still requires acceptance and the remaining delivery checks.

## Source boundaries

Owner-selected CT/C/r_out notation, privately checked glossary terminology and an independent public average-system-boundary reference: [MIT2.810 introductory lecture, slide42](https://web.mit.edu/course/2/2.810/www/files/lectures/lec1-intro-2018.pdf). No private course text, screenshots, case figures or personal notes are distributed.
