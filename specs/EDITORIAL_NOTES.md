# Editorial notes

## 2026-11-03 — Cycle time and Throughput Time

Owner prefers the term Throughput only in Throughput Time (TPT). In the O2 product UI, rename the capped output to **Output rate** and reserve “throughput” for the definition of TPT in help. The Rate / Cycle Time toggle refers to the interval between completions for one continuously working machine. For this ideal model, one-machine Cycle Time CT_i converts by r_i=60/CT_i, station interval is CT_i/n_i, and capacity-limited line CT is60/C. TPT is elapsed time for a unit through a whole system and can include waits; it is a separate O1 Process Flow measure and should not be inferred from station capacity alone.

## 2026-11-03 — Rate/time presentation refinement

Owner found “per resource” and “resources” too abstract. The pilot now displays units/hour and calls the station count Parallel machines; help/key specify that r_i is the rate of one machine. Cycle Time CT_i is in minutes/unit, so the reciprocal relation is r_i=60/CT_i, not a numerical 1/r_i in minutes. “Cycle Time” means one machine’s interval between completions and is distinct from the line's intercompletion time. Zero rate corresponds to infinite cycle time; zero cycle time is invalid. Presentation changes do not round-trip rounded fields through the model.

## 2026-11-03 — Cycle Time notation

Owner selected **CT_i** as the symbol for one machine's cycle time. Use CT_i consistently in the input label, equation, worked values, help and symbol key; retain C for capacity.

## 2026-11-03 — Line output notation

The personal Operations notes reviewed in sources/operations/derived/OUTPUT_RATE_NOTATION_REVIEW.md did not establish a letter for system output rate. Owner chose **r_out** for line output rate. Use r_out = min(d, C) and u_i = r_out/C_i in the visualization; keep r_i for one-machine rate and C for capacity. This is a local teaching notation, not a claimed course-standard symbol.

## 2026-11-03 — Bottlenecks pilot

O2's first mode is an ideal deterministic three-station capacity lab. The phrase “actual throughput” in the inherited brief is presented as line Output rate r_out: a model rate after startup, not observed completions. Demand is a requested output rate, not an uncontrolled arrival process; coordinated release avoids claiming that a stable queue exists under excessive arrivals. Capacity bottlenecks remain identified under low demand, while demand can be the current output limit. No queue lengths are shown without a queue model. Parallel resources multiply per-resource usable rates; all units use every station once with 100% yield. Yield/product mix and layout/economics are deferred, so their inherited acceptance targets are not claimed as covered.

Basic capacity/utilization definitions were checked against Asef-Vaziri's public CSUN Process Flow Engineering study guide, Chapter 2. The illustrative 12/8/10 migration/tie/low-demand examples were recomputed independently and tested. No original course cases or personal notes were used in the public implementation.

## 2026-10-30 — Setup

The owner's latest instruction selects two public distribution repositories and one private intake workspace. This replaces the original specification's proposed combined repository. docs/downloads/ replaces its generic dist/ path; docs/index.html is each subject's catalog.

The input files are planning documents. Their internal statement that prior notes were reviewed describes an earlier planning pass, not a review performed in this setup. No original lecture-note PDFs, case readings or finance schedule screenshots were supplied here. Exact course-number verification remains pending.

F6's inherited tests include the contradictory sentence “No negative initial investment is allowed as data” alongside negative-initial-investment examples. The working F6 brief corrects this to permit signed cash flows including a negative initial investment; unusual patterns must be labeled. Its approximately 15% IRR example must be independently recomputed and tested with a stated tolerance rather than rounded to an exact identity.

No completed demos are included in this setup. All catalog statuses start planned. This records organization and engineering conventions, not a numerical validation of fourteen domain models.


## 2026-10-31 — M/M/1 pilot

The pilot distinguishes Poisson counts over a fixed interval from exponential gaps between arrivals and exponential service times. “Markov” describes the memoryless queue model, not a separate count/time distribution. λ and μ use customers/hour; displayed times use minutes, with conversions visible in equations. Fractional Lq/L are expected counts; the sample snapshot remains integer valued. At λ ≥ μ the rate ratio can exceed one, but actual busy time cannot exceed 100% and no finite steady-state Lq/L/Wq/W is shown. Numerical examples are illustrative and checked independently of the inherited planning brief. The local draft is awaiting owner review; no public download is generated.


## November 9, 2026 — SPC & Capability draft

Owner requires “in control” terminology and signals for runs/trends as well as limit violations. The private reading's page 4 explicitly uses eight same-side points; its Exhibit 5 illustrates drift without a numerical trend threshold. The implemented six-point monotone rule follows NIST pmc32. Eight same-side points deliberately follows the supplied reading rather than silently substituting another convention. Equality breaks a run/trend; endpoints are marked when evidence becomes available, without backdating signals. Investigation signals can arise by chance.

NIST A2/D3/D4 constants are used verbatim, including D4=2.575 for n3 and 2.115 for n5; d2 is from the official Minitab table. Capability uses known model μ/σ; fitted reference σ is separate. Current modeled normal capability and observed conformance are different outputs. A one-off observation outside specifications need not establish overall process incapability. Original 50 mm examples replace private case figures. See spc.md and ../verification/spc.md for scope, sources and evidence.


## November 9 — SPC owner refinements v0.2

Auto-rescaling had visually normalized different in-control mean/spread cases; use common frames and a shared seed for causal comparison. Strengthened off-center/high-variation cases and validated each preset's signal/conformance feature. Selected random trend seed28 demonstrates a statistical signal can occur by chance; it is not a simulated drift cause. All contributing points now highlighted separately from signal endpoint counts. Screenshot reproduction Cp14.6/Cpk13.6 meets the current model's goal despite reduced spread versus historical reference triggering control signals; show both assessments, with long-run caveat in help and contaminated-reference warnings retained.
