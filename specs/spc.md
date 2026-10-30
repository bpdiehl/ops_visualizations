# O7 — Quality: SPC & Capability

Status: planned. Catalog slug: spc. Recommended build wave: 3.

Derived from the owner's MBA Interactive Learning Lab planning specification v1.0, 2026-10-30. Read SHARED_REQUIREMENTS.md and ../DESIGN.md alongside this brief. The original documents remain in the private workspace. Class anchors below are inherited, unverified references; their source files were not supplied in this setup. Numerical tests are proposed targets to recompute independently, not evidence that an implementation exists.

The full brief preserves future modes. For a pilot, deliver the simplest faithful mode first and explicitly document deferred scope.

## O7 — Quality: Accuracy, Precision, SPC & Capability

**One-sentence promise:** “A process can be in control and still miss customer specifications—and the reverse snapshot can also occur.”

**Class anchors:** 10.26 Polaroid: accuracy vs precision quadrants, finger-weight data, X-bar control-chart interpretation, and **in-control** versus **capable** matrix. User additionally requests X-bar and R charts, capability and process shifts.

**Learning outcomes:** Distinguish bias from variation; distinguish **control limits** from **specification limits**; read X-bar and R charts; recognize special-cause signals; assess capability *conditionally on a stable process*.

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

Provide vetted constants per subgroup size; include tests against a published reference table. For capability, report a clear **“unreliable while unstable”** warning when control signals appear. A process can temporarily sit inside specifications while lacking statistical control. Clearly distinguish a capability index from realized percentage within specs. Baseline chart limits should preferably be set on a known stable historical period; don't automatically recenter after every newly generated outlier.

**Outputs:** Subgroup means/ranges, control limits, number and identity of signals, estimated process center and within SD, Cp/Cpk with stability warning, estimated percentage out-of-spec (if normality assumed), relative accuracy/precision display.

**Presets:** (1) stable and capable; (2) stable but off-center/not capable; (3) sudden mean shift (out of control); (4) spread increase (R chart signal); (5) inaccurate but precise versus accurate but imprecise.

**Tooltips:**
- **Accuracy:** “How close results are to the intended target. A consistently off-center process can be very precise but inaccurate.”
- **Precision:** “How tightly repeated results cluster. Tight clustering does not guarantee that the center is correct.”
- **X-bar chart:** “Tracks the average of a small subgroup over time. It helps reveal shifts in the process center.”
- **R chart:** “Tracks the range within each subgroup, a simple measure of short-term variability. It can reveal changes in process spread.”
- **Control limits:** “Statistical boundaries estimated from process behavior. Signals outside the limits suggest that something about the process may have changed.”
- **Specification limits:** “The lower and upper values the customer or design requires. They are externally defined and do not automatically equal control limits.”
- **In control vs capable:** “In control describes predictability over time. Capable describes ability to satisfy specifications with sufficiently small, centered variation. Evaluate capability carefully when a process is unstable.”

**Challenges:** “Shift the mean without changing spread; which graph reacts?” “Keep all measurements inside specs but introduce a time shift; is the process in control?” “Broaden specs without changing the process; does stability change?”

**Out of scope:** Full Western Electric/Nelson rule library in MVP; attribute charts p/c/u; multivariate SPC; Gage R&R.

**Acceptance tests:** Subgroup mean/range math correct for fixed tiny arrays; all limits from the same chosen baseline; LSL/USL changes must not change UCL/LCL; increasing SD with same specs reduces ideal Cp/Cpk; shifting the mean away from midpoint reduces Cpk but does not directly alter Cp; out-of-control state shows capability warning.
