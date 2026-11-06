# O5 — M/M/1 Queueing — v0.2

Status: owner accepted v0.2 and explicitly authorized commit/push on 2026-10-31. Catalog status is ready with the release coverage exception below; it means available for sharing, not that omitted checks passed.

- Date: 2026-10-31 (America/Denver).
- Reviewer: Codex implementation/browser checks; owner reviewed and accepted v0.2.
- Environment: Codex in-app browser on macOS. Exact engine/version not recorded. Layout checks at 1280×800 and 360×800; temporary viewport override reset afterward.
- Source: uncommitted working changes based on Operations main at 3d8417a09af3551e9f4bfa17dd4f80a586dc9ee6.
- Owner-review artifact before removing the Draft footer: 68,844 bytes, SHA-256 `17b0a97258fa9fc525f99b61689191efba7775770a668e102e437a3d6be9eb1c`.
- Release artifact: `docs/downloads/mm1.html`, 68,838 bytes, SHA-256 `63be1e24cd0a2ec146dbabb8ca0848aede8d4f234fa40736bdc22db211084ec9`. The generated preview is byte-identical.
- Scope: theoretical Lq/Wq chart toggle; six worked equations; Poisson counts and exponential arrival/service distributions; optional seeded FIFO sample, warm-up, scrubbing and playback. No multi-server or empirical mode.
- Assumptions: independent Poisson arrivals and exponential service, constant rates, one FIFO server, unlimited waiting room, no abandonment. Illustrative numbers, not an exact case reproduction.

## Numerical and packaging checks

Final `python3 scripts/manage.py preview mm1`, `build`, and `check` succeeded. Twenty Node model tests and six Python packaging tests pass; JS syntax and deterministic catalog output also pass. `git diff --check` passes. No npm/runtime dependency was added.

- Independent 8/10 per-hour reference: 80% utilization; Wq 24 minutes; W 30 minutes; Lq 3.2; L 4.
- Moderate 4/8: Wq 7.5 minutes, Lq 0.5. Near capacity 9.5/10: Wq 114 minutes, Lq 18.05.
- Equal/overloaded arrivals: Wq/W/Lq/L null; actual busy time remains bounded by 100% in the sample.
- Zero arrivals, invalid/blank/out-of-range values, Little's Law, time decomposition, doubled-rate scaling, line-length curve monotonicity and endpoint checked.
- Poisson mean-one exact probabilities, mass/mean/variance, and essentially full mass at mean 120 checked. Exponential quantile/CDF, means and numerical density integrals checked.
- Changing μ preserves arrival distributions; changing λ preserves service-time distribution. Window t changes probabilities but no queue performance metric.
- Fixed-seed repeatability, independent arrival/service streams, FIFO, conservation, nonnegative queues, snapshots at boundaries, and a hand-built exact-integral sample checked.
- A 20,000-hour seeded run, discarding 1,000 hours, is within 4% of the independent 80% reference for utilization, counts, waits and throughput. This is one deterministic regression check, not a general confidence statement.

## Browser evidence

Local HTTP preview: `http://127.0.0.1:8771/mm1.html`. Successful HTTP 200 confirmed. The server serves only the ignored preview folder. It was retained for owner review; the public page replaces it after deployment.

Observed:

- Default line length 3.20 customers; toggle shows wait 24.00 minutes without changing λ or μ. Moderate/near-capacity presets, overload, Reset and numerical substitution checked.
- μ 10→12: Poisson count SVG and arrival-gap SVG were byte-for-byte unchanged; service plot changed. Default λ=8 with μ=12 gives a 10-minute wait.
- Info button opened by Enter; Escape closed it and restored focus to its trigger. Markov/Poisson/exponential explanation and final chart help inspected.
- μ=0 showed a specific error, suppressed numbers/charts and disabled download. λ=0 showed no arrivals and no finite arrival-gap mean while queue size remained zero.
- Two-decimal exact fields and sliders agree. ArrowRight changed λ from 8.00 to 8.01. Input editing highlighted the matching equation terms; release/blur removed active highlights. CSS specifies a 0.75-second fade.
- Equation-token bounding boxes were identical at λ=8.00 versus 8.10 on laptop and at λ=9.00 versus 9.10 on 360 px. Results use fixed-width no-wrap slots, including minute units.
- No horizontal page overflow at 360 px, including λ=120, μ=0.01, t=60 and a 5,804-person sample queue. The visible queue caps its person icons and reports all additional customers explicitly; no modeled customers are lost.
- Sample defaults (seed 42, 48 h, warm-up 4 h) displayed Wq 17.60 min, Lq 2.46, busy time 77.02%, 366 completed post-warm-up customers, four unfinished excluded. These are samples, distinct from theory.
- Scrubbing to 48 h showed three waiting plus one in service. Playback at 16× advanced the clock; pausing worked and full-run statistics stayed unchanged. Seed 43 changed the sample. Warm-up equal to horizon showed an error and hid sample results.
- Final artifact reloaded and reset to line-length view, λ=8.00, μ=10.00, t=10.00, sample disclosure closed. Final help and results rechecked. Browser warning/error log was empty.
- Reduced-motion styling is present and the sample starts paused for everyone. An alternate reduced-motion media setting was not forced in this browser; no claim of that runtime test is made.
- Screenshot evidence retained outside the public checkout; no private notes, screenshots, or local absolute paths are included in the distributable HTML.

## Download, offline and release limits

The in-page Download HTML button was clicked successfully and initiated its Blob/link flow. A matching saved `mm1*.html` was not found in the local Downloads folder, so successful browser saving is **not verified**. The status text instructs saving rather than claiming a completed save.

Owner acceptance permits generation of docs/downloads/mm1.html and its catalog download. Final catalog checks and artifact hash are recorded below. The preview passes static single-file packaging checks; those do not prove actual offline execution.

Detached `file://` execution with network blocked remains untested: the app browser's previously established URL policy forbids local-file navigation, and no bypass was attempted. No runtime network-blocking instrumentation was available in this test interface. Source and packaging checks reject external runtime assets/requests; full network-capture evidence remains absent.

Other browser engines, physical phones and owner/classmate detached-file testing remain pending. The owner explicitly approved commit/push after reviewing v0.2 and the disclosed testing limits.


## Owner feedback revision — v0.2, 2026-10-31

Earlier v0.1 browser observations above are retained as historical checks. The following checks cover the revised source and current artifact hash.

- Reproduced the default sample/model gap: seed 42, λ=8, μ=10, 48 h with 4 h warm-up gives Lq=2.4596 versus theoretical 3.2. Across seeds 42–44 and loads 0/8/9.5/11, direct sums of customer interval overlaps agree with event-integrated Lq, L and busy time to below 1e-9. The gap is not a counting/integration defect in these cases. Added that independent regression.
- Exploratory runs show seed and finite-window variation; a longer individual run can move farther from the expectation. At 80% load, seed 42 over 20,000 hours with 1,000-hour warm-up gives Lq≈3.0928; the existing long-run regression remains within 4%. At 95%, substantial variation persists much longer; no universal convergence-speed guarantee or fabricated confidence interval is presented.
- Equations precede the workspace in DOM and rendered order; distribution section follows the workspace with 12 px between sections. Defaults and slider-driven plot updates work after the reorder. λ=8.10 gives Lq=3.45, changes count/gap plots, and preserves the service plot.
- All five vertical titles have SVG rotate(-90) transforms along the left margin. Bounding boxes remain inside their SVGs at laptop and 360 px widths. No horizontal page overflow at 360 px, including the open sample table.
- Near-capacity preset displays Lq=18.05; wait toggle displays Wq=114.00. The sample chart now retains its theoretical Lq line even when its observed maximum is lower.
- Full-run caption and Sample average column checked. New difference help opened with Enter; Escape closes it and restores focus. The text distinguishes the moving snapshot from full-period averages, explains seeds/duration/startup, and retains the unfinished-customer caveat.
- Duration 240 h with unchanged 4 h warm-up displayed the 4.00–240.00 h window and sample Lq=4.11 versus theory 3.20, illustrating that an individual extension need not be closer. No values were tuned to match theory.
- Final 20 Node model tests + 6 Python packaging tests pass. Browser warning/error logs and final screenshot are checked before handoff. The saved-file/offline and cross-engine limitations above remain open; owner acceptance and release authorization are recorded below.


## Owner acceptance and release — 2026-10-31

Owner reviewed the visualization, requested revisions through v0.2, then explicitly instructed: “this looks great! commit and push it!” The release removes only the Draft footer label; calculations and accepted interactions are unchanged. No private notes, source scans or personal paths are exported.

Release exception: the requested saved-download/file:// tests cannot be fully completed through the app browser's local-file policy and download tooling. These limits were disclosed before acceptance and remain explicit. The user-approved educational visualization is made available with strong model, single-file packaging and HTTP browser evidence, following the same documented exception used for the WACC pilot. This is not a claim that offline execution or saving was verified, and no browser restriction was bypassed.

No public reuse license was selected or changed. Public source and sharing remain as authorized by the owner.


### Final catalog and artifact checks

- Generated ready catalog and HTML, rebuilt the preview, and passed all 20 model plus 6 packaging tests after the final footer/status change.
- Catalog copied to the ignored local preview root and opened over HTTP. It reports 1 of 7 available. Open and Download HTML both point to downloads/mm1.html; the download attribute is present.
- Clicked the catalog Download action, then Open. The final HTML renders v0.2, default Lq=3.20, equations before controls, and the wait-time toggle gives 24.00 minutes. Reset works; warning/error logs are empty.
- No matching mm1 HTML appeared in the local Downloads folder, so saving remains unverified. The button action and correct target are verified, not an actual saved download or offline execution.
- Reviewed 37 public candidate files for private paths, key/token signatures, original course/Office/archive files and symlinks. No findings. Personal originals and screenshots remain outside the repository. No new license or shared Finance change was made.
- Remote main matched the local base before committing. The authorized push and Pages deployment will be verified externally after this release commit.

Local equation presentation update: see [equation alignment and fraction review](equation-layout-review.md) for cross-demo browser measurements and limits. Uncommitted; published release evidence above remains historical.

## November 6, 2026 — Accepted consistency release

Owner authorized commit and push of the reviewed revisions. Final equation alignment, amber glow/notation/graph-legend checks and catalog evidence are in [the shared release review](equation-layout-review.md). Prior draft-only restrictions are historical. Saved-file/offline and browser-coverage limits remain explicit there and above.
