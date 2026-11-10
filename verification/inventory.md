# Inventory Decisions v0.1 — release

November9,2026. Owner approved commit and push; catalog ready and standalone HTML generated. Owner requested normal demand and quantity slider bounds matching the graph, superseding the initial uniform implementation.

## Updated model and automated evidence

Normal demand with mean100 and SD20 by default. Standard normal CDF uses a deterministic approximation with maximum absolute error approximately8e−8; inverse uses bisection. Expected shortages and leftovers use normal loss functions. Costs/probabilities use full distribution, not just plotted range. NonnegativeQ constraint. A conditional note flags negative-demand probability above0.1%; default tail is negligible. Zero underage cost chooses0; zero overage cost correctly reports no finite optimum instead of inventing a finite maximum.

Build/check passed:72 Node+7Python=79 tests. Seven inventory tests include EOQ reference/scaling, independent normal quantiles (Python statistics reference), standard-normal CDF references, analytic expected cost compared with independent numerical density integration, quantile-neighborhood minimum, wider-spread response, zero-cost endpoints and invalid inputs. Forμ100/σ20/Cu8/Co2:Q*116.83242467, underage2.23275347, overage19.06517815, cost55.99238408. Equal costs5/5 atQ100 give expected shortage/leftovers7.97884561 each and cost79.78845608.

## Updated browser evidence — desktop in-app browser

- Normal mode exposes μ100/σ20 controls, bell curve, shaded demand≤Q/>Q probabilities and normal-quantile equations. Equal-cost baseline showed cost79.79, expected units7.98 each and probabilities50/50.
- Quantity slider End reaches180 at the normal baseline, matching the graph's right endpoint180. Final graph range no longer expands by20% merely because Q reaches its right endpoint. EOQ graph/slider both start0.10 and share the upper bound; quantity resolution0.01.
- Current desktop screenshot inspected with live edited inputs, including the bell curve, quantity marker, normal target/service probability and expected cost; no runtime stale-value error observed. Owner was actively editing, so later preset checks stopped to preserve user changes.
- EOQ defaults/optimal action, invalid range/reset and aligned fraction rendering were browser-tested before the normal update (historical details below). Browser normal preset/endpoint/help/key/invalid extremes not exhaustively exercised.

## Limits

Normal untruncated approximation can assign negative demand; the model deliberately discloses this and does not censor or renormalize silently. Normal/discrete selector, leadtime/ROP/safety stock, integer procurement and stochastic samples deferred. Offline file opening, download completion, console/network diagnostics and cross-browser behavior unverified. Desktop target; no mobile testing. Owner accepted this release with the coverage limits recorded.

---

## Historical uniform pilot evidence (superseded for single period)

# Inventory Decisions v0.1 — local owner-review draft

November 9, 2026. Desktop target. Catalog draft; not committed, pushed or publicly downloadable. Original illustrative examples; no inherited course case data reproduced.

## Scope and calculations

EOQ: strictly positive D/S/H/Q; deterministic annual demand, fixed order expense, cycle-stock annual holding expense, instantaneous replenishment and no shortages. Relevant annual cost excludes constant unit purchase expense. EOQ reference223.6068; holding and ordering costs equal there. Three-cycle sawtooth shows on-hand stock, cycle-time days using365 days/year, and average Q/2.

Single-period: uniform continuous demand on nonnegative[a,b], shortage penaltyCu, leftover penaltyCo; choose once before demand. Analytic integrals for expected shortage/overage, exact quantile rule and cost curve. One zero mismatch penalty supported; both zero rejected as a flat/undefined target. Shading reports probabilities, separately from expected units. No samples or sampling seeds. Normal/discrete demand, lead time/ROP, safety stock, cost builder and integer rounding deferred. Zero-demand/zero-order-cost EOQ limiting cases outside pilot.

## Automated checks

Build/check pass:72 Node tests +7 Python packaging tests=79, including7 new independent model tests. Independent EOQ reference, cost reciprocity, setup-cost scaling, exact uniform expectations/quantiles, zero-penalty/beyond-support cases, numerical quadrature cross-check, minimum-neighborhood checks, invalid inputs and isolation. Syntax/diff whitespace pass. Draft excluded from public downloads.

## Desktop browser evidence

macOS in-app HTTP preview localhost8776/inventory.html. Desktop screenshots inspected; no mobile work.

- EOQ defaultsD1000/S50/H2/Q250: annual ordering200/holding250/total450; optimum223.61/minimum447.21, cycle91.25days. Annual-demand field and slider1000 agree.
- Use optimal quantity displaysQ223.61, cost447.21, ordering/holding223.61 each, cost above minimum0; model retains precision. Quantity field/slider show matching223.61 after changing slider resolution to.01. Cost curves and three-cycle sawtooth inspected.
- Equations expand with nested symbol disclosure and aligned symbolic/numeric fractions; single-period p*=Cu/(Cu+Co), expected-cost identity and uniform quantile substitutions inspected.
- Switching to single period shows only its four examples and own assumptions. Equal costs5/5, demand60–140 andQ100 give p*.5, total100, expectedshortage10/leftovers10 and probability50/50.
- Expensive-shortage8/2 example givesp*.8/Q*124. Use optimal setsQ124, expectedcost64, shortage1.6, leftovers25.6, probability80/20. Model and graph legend agree.
- Setting maximum demand50 below minimum60 rejects and clears outputs/graphs. Reset stays in single-period mode and restores equal-cost baseline100/50%.

## Limits

EOQ high-cost presets and all single-period examples, chart clicking, help/Escape, key hover/pin and all input extremes were not fully browser-tested. Console/network diagnostics, downloaded file:// execution, download completion and cross-browser behavior unverified. Final page left at EOQ optimum for owner inspection. Preview server8776 needed restart; standard local socket permission used. No claim of release readiness.

Owner notation refinement: EOQ square root now uses a scalable radical and overbar spanning the entire fraction, without parentheses. Applied to both symbolic and numerical rows while retaining shared atom widths/alignment and accessible square-root text. Desktop screenshot inspected; source syntax, preview/build and whitespace checks pass.

Owner sawtooth refinement: replenishment chart now holds time/inventory scales fixed while inputs change (default365 days/500 units). SmallerQ visibly makes lower, more frequent teeth; greaterD increases delivery frequency. Fit view deliberately frames three current cycles and1.25Q height; further input changes keep those fitted scales. Reset restores default view. Cycles beyond visible height/time are explicitly indicated; very dense cycles use a labeled0–Q envelope to bound rendering. Order/holding costs only alter the optimalQ, not current depletion untilQ changes; help explains this. Desktop browser:Q125 gives8cycles/year and45.63days atD1000 with axesunchanged; D2000 gives22.81days withsameaxes; Fit view becomes68.44days/156.25units; Reset restores365/500 and91.25day cycle. Desktop screenshot inspected; build/check79pass.

Owner example refinement: selecting any example now applies its full-precision optimalQ; mode baselines, Reset and initial load do the same. Example selection remains active when Q matches its computed optimum and clears on manual changes. Browser verified starting EOQ223.61/cost447.21 and expensive-shortage normalQ116.83/cost55.99/probability80%. Optimal-action button is filled blue. Build/check79pass before final initialization-only change; latest preview/build/whitespace verified.

Final release: repository build/check79 pass after all source changes, diff whitespace/private-path/credential-pattern scan pass. Inventory public artifact generated and catalog updated. Deployment verification follows push.


## Local owner-review refinement — November 9, 2026

Uncommitted review changes; public deployment is unchanged. See [Operations review evidence](ops-review-refinements.md).
