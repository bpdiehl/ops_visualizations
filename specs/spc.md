# O7 — Quality: SPC & Capability

Status: local owner-review draft, November 9, 2026. Catalog slug: spc. Recommended build wave: 3.

Derived from the owner's MBA Interactive Learning Lab planning specification v1.0, 2026-10-30. Read SHARED_REQUIREMENTS.md and ../DESIGN.md alongside this brief. The original documents remain in the private workspace. Class anchors below are inherited, unverified references; their source files were not supplied in this setup. Numerical tests are proposed targets to recompute independently, not evidence that an implementation exists.

The full brief preserves future modes. For a pilot, deliver the simplest faithful mode first and explicitly document deferred scope.

## O7 — Quality: Accuracy, Precision, SPC & Capability

**One-sentence promise:** “A process can be in control and still miss customer specifications—and the reverse snapshot can also occur.”

**Class anchors:** 10.26 Polaroid: accuracy vs precision quadrants, finger-weight data, X-bar control-chart interpretation, and **in-control** versus **capable** matrix. User additionally requests X-bar and R charts, capability and process shifts.

**Learning outcomes:** Distinguish bias from variation; distinguish **control limits** from **specification limits**; read X-bar and R charts; recognize special-cause signals; assess capability *conditionally on an in-control process*.

**Main view:** Synchronized (1) histogram / individual observations against target, LSL and USL, (2) X-bar chart of subgroup means with UCL/CL/LCL and (3) R chart of within-subgroup ranges with limits. An optional four-quadrant accuracy/precision target view is an introductory tab.

**Controls:** Process true mean, within-process SD, target, LSL/USL, subgroup size `n`, number of subgroups, seed, shift time and shift magnitude, one-time outlier, increased-variability period. Include a “recalculate control limits from selected baseline” action and warn when using contaminated data.

**Model:** Draw individual observations from an explicitly chosen distribution, normally distributed in basic mode. For each subgroup `i`, `xbar_i = mean(x_ij)` and `R_i = max(x_ij)-min(x_ij)`. For standard X-bar/R charts with constant subgroup size n in the supported range (typically n=2…10), use tabulated `A2`, `D3`, `D4` constants:

```
Grand mean = mean(xbar_i)
Rbar = mean(R_i)
Xbar CL = grand mean
Xbar UCL/LCL = grand mean ± A2 × Rbar
R CL = Rbar
R UCL = D4 × Rbar; R LCL = max(0, D3 × Rbar)
Within-process sigma estimate ≈ Rbar / d2
Cp  = (USL − LSL) / (6 × sigma_within)
Cpk = min(USL − mean, mean − LSL) / (3 × sigma_within)
```

Provide vetted constants per subgroup size; include tests against a published reference table. For capability, report a clear **“unreliable while out of control”** warning when control signals appear. A process can temporarily sit inside specifications while lacking statistical control. Clearly distinguish a capability index from realized percentage within specs. Baseline chart limits should preferably be set on a known in-control historical period; don't automatically recenter after every newly generated outlier.

**Outputs:** Subgroup means/ranges, control limits, number and identity of signals, estimated process center and within SD, Cp/Cpk with control-status warning, estimated percentage out-of-spec (if normality assumed), relative accuracy/precision display.

**Presets:** (1) in control and capable; (2) in control but off-center/not capable; (3) sudden mean shift (out of control); (4) spread increase (R chart signal); (5) inaccurate but precise versus accurate but imprecise.

**Tooltips:**
- **Accuracy:** “How close results are to the intended target. A consistently off-center process can be very precise but inaccurate.”
- **Precision:** “How tightly repeated results cluster. Tight clustering does not guarantee that the center is correct.”
- **X-bar chart:** “Tracks the average of a small subgroup over time. It helps reveal shifts in the process center.”
- **R chart:** “Tracks the range within each subgroup, a simple measure of short-term variability. It can reveal changes in process spread.”
- **Control limits:** “Statistical boundaries estimated from process behavior. Signals outside the limits suggest that something about the process may have changed.”
- **Specification limits:** “The lower and upper values the customer or design requires. They are externally defined and do not automatically equal control limits.”
- **In control vs capable:** “In control describes predictability over time. Capable describes ability to satisfy specifications with sufficiently small, centered variation. Evaluate capability carefully when a process is out of control.”

**Challenges:** “Shift the mean without changing spread; which graph reacts?” “Keep all measurements inside specs but introduce a time shift; is the process in control?” “Broaden specs without changing the process; does control status change?”

**Out of scope:** Full Western Electric/Nelson rule library in MVP; attribute charts p/c/u; multivariate SPC; Gage R&R.

**Acceptance tests:** Subgroup mean/range math correct for fixed tiny arrays; all limits from the same chosen baseline; LSL/USL changes must not change UCL/LCL; increasing SD with same specs reduces ideal Cp/Cpk; shifting the mean away from midpoint reduces Cpk but does not directly alter Cp; out-of-control state shows capability warning.


## Implemented pilot — November 9, 2026

Two linked tabs: Control charts and Capability. Fifty independent normal subgroups; historical groups 1–25 and monitoring groups 26–50. Current mean/SD and one reading disturbance affect only monitoring. Seed and subgroup size changes start new reference experiments. Limits remain frozen until explicit selected-prefix recalculation; known changed-process reference data trigger a warning. Eight original examples include runs and a trend that never cross the limits. In control is the owner-selected terminology.

Both charts check: strict LCL/UCL violations, eight points strictly above/below the centerline, and six strictly increasing/decreasing points. A signal is marked at the completing endpoint, with each later qualifying endpoint also marked. Equality breaks a run/trend. Selecting an endpoint highlights its qualifying window; Signal details lists chart, interval and reason. Counts are signal endpoints, not independent incidents or distinct root causes. Additional zone, alternating and cyclic-pattern tests are deferred. Random samples can signal; no detected signal is not proof of control.

Capability uses **known current normal generator parameters**, clearly labeled modeled Cp/Cpk, rather than presenting fitted estimates as population truth. Reference within-SD estimate is shown separately. Histogram/observed out-of-spec proportion use actual monitoring readings; specifications apply to individual output, never subgroup means. One out-of-spec item is not itself a process-capability estimate. Conditional modeled indices remain visible with an out-of-control warning. No 1.5-sigma shift. Target changes bias, not limits or indices. The 1.33 goal is illustrative.

Core equations remain visible with aligned numerical substitutions; the key is collapsed and generated only from displayed equations. Deferred from the full brief: bullseye tab, arbitrary shift timing/count, data upload, sample-estimated capability confidence intervals and full rule library. No private case data or artwork is distributed.

Primary mathematical sources: [NIST X̄/R formulas and constants](https://www.itl.nist.gov/div898/handbook/pmc/section3/pmc321.htm), [NIST signal rules and control/specification distinction](https://www.itl.nist.gov/div898/handbook/pmc/section3/pmc32.htm), [NIST capability](https://www.itl.nist.gov/div898/handbook/pmc/section1/pmc16.htm), [official Minitab d2 table](https://support.minitab.com/en-us/minitab/help-and-how-to/quality-and-process-improvement/control-charts/how-to/variables-charts-for-individuals/individuals-chart/methods-and-formulas/methods-and-formulas-for-individuals-chart/). The supplied private reading was visually checked for its eight-point rule and control/specification distinction; the six-point trend threshold is from NIST, not a numerical claim made by the reading.


### Owner refinement v0.2

Fixed common chart frames across comparison examples prevent auto-rescaling from hiding mean/spread differences; expand only for extreme values. The three in-control presets are prominent, use the same seed42, and visibly separate centered/capable, off-center (μ53.5/σ0.5), and excessive variation (σ3). Eight examples have explicitly verified seeds and short learning cues. A clean single-outlier sample uses seed8; a six-point chance trend uses seed28 and discloses that origin. Highlight every participating point in a completed pattern, retaining endpoint diamonds and causal endpoint timing. Capability's current-model goal assessment is independent of historical-control status; the historical/current parameter comparison explains why reduced spread can improve modeled capability while producing control signals. See verification/spc.md for exact outcomes and evidence.


### Tab scope and specifications

Show the three in-control comparison presets only on Capability, and the five signal/change presets only on Control charts. Preserve parameters and reference snapshot during tab switches; scope lesson copy to visible presets. Keep an optional, initially collapsed individual-reading specification plot beneath the control charts. Draw LSL/USL on individual measurements, not subgroup means or ranges. Selecting a reading selects its subgroup throughout the control view.


### Owner-requested presentation refinement

Use identical example button/grid styling on both tabs. Control charts includes an In control baseline as its first/default preset, aliasing the centered seed42 process used by In control & capable. Thus Control charts has6 visible presets and Capability3. On explicit owner request, core equations are now a collapsible panel initially closed; its symbol key remains nested and initially closed. This is the local presentation override for SPC.


### X̄ specification reference overlay — owner request

Draw individual-item LSL/USL as purple dotted reference lines on X̄, labeled individual items and distinguished from statistical control limits. Include them in the plot's frame bounds. They do not govern subgroup-mean control status or establish individual conformance. R remains without specification lines; the raw measurement plot remains available. Preserve example styling, as the owner explicitly requested no further change to the buttons.
