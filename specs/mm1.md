# O5 — M/M/1 Queueing

Status: owner-approved release v0.2.1, November 6, 2026. Catalog slug: mm1. Recommended build wave: 1.

Derived from the owner's MBA Interactive Learning Lab planning specification v1.0, 2026-10-30. Read SHARED_REQUIREMENTS.md and ../DESIGN.md alongside this brief. The original documents remain in the private workspace. Class anchors below are inherited, unverified references; their source files were not supplied in this setup. Numerical tests are proposed targets to recompute independently, not evidence that an implementation exists.

The full brief preserves future modes. For a pilot, deliver the simplest faithful mode first and explicitly document deferred scope.

## O5 — M/M/1 Queueing & Utilization

**One-sentence promise:** “Find out why a nearly fully utilized server can have a very long line.”

**Class anchors:** 10.21 Paramount: a fast-casual process, server pooling, arrival rates, service rates, queue lengths and customer experience; 10.7 Variability: random processing and connected processes. User specifically requested the full M/M/1 calculation set.

**Learning outcomes:** Interpret utilization and stochastic waiting; distinguish waiting *in queue* from time *in system*; use M/M/1 assumptions; see why finite random simulation differs from theoretical averages; understand that `lambda >= mu` has no steady-state finite expected queue in the standard model.

**Main view:** Animated customers arriving at **one server** and joining a first-in/first-out queue. Next to it, a chart of theoretical average waiting time versus utilization and a second chart of observed queue length over time. A marker indicates the current utilization; a time-scrubber or Pause/Resume allows inspection.

**Controls:** Arrival rate `λ`; service rate `μ`; simulation speed; random seed; run duration; warm-up time if displaying observed long-run averages. Option to adjust variability **only as a different model labeled M/G/1 or an empirical variant**—not while still claiming the M/M/1 closed forms apply. To keep MVP accurate, stay with exponential service and Poisson arrivals.

**Theoretical outputs for λ < μ:**

```
rho = λ / μ                       server utilization
L   = λ / (μ − λ)                 expected number in system
Lq  = λ² / (μ(μ − λ))             expected number waiting
W   = 1 / (μ − λ)                 expected time in system
Wq  = λ / (μ(μ − λ))              expected waiting time in queue
1/μ                               expected service time
Little's Law check: L = λW, Lq = λWq
```

Show units and dimensional consistency. The distribution of simulated waits should be labeled “sample,” not “exactly equal to Wq.” For `λ >= μ`, show the system as unstable; do **not** report finite theoretical `L`, `Lq`, `W`, `Wq`. The finite animation can still run to show how backlog grows.

**Presets:** (1) moderate load (λ=4/h, μ=8/h); (2) 80% utilization (λ=8/h, μ=10/h); (3) 95% utilization (λ=9.5/h, μ=10/h); (4) overloaded (λ=11/h, μ=10/h).

**Tooltips:**
- **Arrival rate λ:** “Average customers or jobs entering the queue per unit time. In an M/M/1 model, arrivals are random and follow a Poisson process.”
- **Service rate μ:** “Average jobs the single server can complete per unit time while busy. Individual service times are random, with an exponential distribution in this model.”
- **Utilization ρ:** “The fraction of time the server is busy *in the stable long run*: arrival rate divided by service rate. It can be close to 100% and still technically below capacity, but waiting can become very large.”
- **Wq vs W:** “Wq is time waiting *before* service. W includes both waiting and service; the difference in expected values is 1/μ.”
- **Lq vs L:** “Lq counts people waiting; L also includes the person in service. These are long-run average counts, not a snapshot of today's line.”
- **M/M/1:** “The first M represents random Poisson arrivals, the second M exponential service times, and 1 means one server. The formulas depend on those assumptions.”

**Challenges:** “At λ=8/h and μ=10/h, how long is the expected queue wait? Change arrivals to 9.5/h and compare.” “Why can the observed queue be empty for a while even when the expected queue is several people?”

**Model specifics:** Generate exponential interarrival and service times with `-ln(U)/rate` for a fixed seed; maintain a single-server FIFO event queue; record arrivals, service starts, departures, individual waiting times and time-weighted queue lengths. For theory vs observation, observed throughput over a finite period may differ from requested arrival rate. Compute sample summary from measured events, disclose warm-up and any right-censoring at the simulation horizon.

**Out of scope:** Multiple servers (M/M/c), balking/reneging behavior, psychological perception of waits as a quantitative model. Paramount can be an optional qualitative case vignette rather than pretending it is accurately represented by one M/M/1 server.

**Acceptance tests:** λ=8/h, μ=10/h → ρ=.8, L=4, Lq=3.2, W=.5 h (30 min), Wq=.4 h (24 min). λ=9.5/h, μ=10/h → ρ=.95, W=2 h, Wq=1.9 h. λ≥μ flags unstable and hides invalid steady-state metrics. Long seeded runs should approach theoretical values within a **tolerance**, not exact equality.


## Implemented pilot — v0.1, 2026-10-31

- Default theoretical chart: average customers waiting Lq versus utilization. Toggle to Wq (minutes waiting) without changing the scenario. Queue excludes the customer in service; a composition bar shows queue plus service equals the whole system.
- λ and μ controls pair exact two-decimal entry with sliders. Rates are customers/hour; times are minutes. Observation window t (1–60 minutes) changes distribution probabilities only.
- All six theoretical results have visible equations and current substitution. A factor of 60 makes the hourly-rate/minute-time conversion explicit. Results retain two decimal places and fixed-width numeric slots; related equation terms highlight during editing and fade afterward.
- Three always-visible probability plots: Poisson count in t minutes, exponential interarrival gap, and exponential service time. Independent time axes, marked means, and shaded cumulative probability; density height is not presented as a point probability. No third “Markov distribution” is invented.
- Four presets, Reset, keyboard/touch help, and a paused-by-default seeded FIFO sample. Seed, duration, warm-up, speed and scrubber are under the sample disclosure. Statistics use the full simulation horizon, separate from playback time.
- Sample queue/system sizes and busy time are time-weighted over [warm-up, horizon]. Wait averages use only post-warm-up arrivals completed by the horizon; unfinished cohort members are counted and excluded with an explicit downward-bias caveat. Measured throughput includes all departures in that interval. The sample does not claim finite-window Little's Law equality.
- λ ≥ μ suppresses finite steady-state means; λ/μ is then labeled a load ratio rather than an achievable busy-time percentage. λ = 0 gives no finite interarrival mean; W is hypothetical service time for an arrival to an empty system.
- Illustrative examples, original graphics/copy. Course references remain private; no original notes or case screenshots are embedded.
- Deferred: multiple servers, alternate distributions, empirical fitting, wait histogram, confidence intervals and replication controls. No general-purpose queueing package or dependency was added.
- Owner accepted v0.2 and authorized commit/push on 2026-10-31. See ../verification/mm1.md for completed checks and the explicit saved-file/offline coverage exception.

Mathematical references checked 2026-10-31: [MIT OpenCourseWare, M/M/1 Queue](https://ocw.mit.edu/courses/2-854-introduction-to-manufacturing-systems-fall-2016/resources/mit2_854f16_mm1queue/) and [NIST, homogeneous Poisson process](https://itl.nist.gov/div898/handbook/apr/section1/apr171.htm).


## Owner feedback — v0.2

The equation section precedes the main chart and rate controls. Distributions immediately follow the controls, with no equation section between them. All five vertical-axis titles are rotated −90 degrees along the left edge, with reserved margins. Sample statistics are explicitly full-run averages, distinct from the playback snapshot. A “Why do they differ?” information control explains finite random samples, seed variation, empty-start transients, warm-up limitations, slow settling near capacity, and existing unfinished-customer exclusions. Longer does not imply closer on every individual extension. The sample plot scale includes the theoretical Lq line even when a short run stays below it.

The queue calculations and sample measurement conventions are unchanged. An independent regression integrates each customer's queue/service/system intervals to check the event-based time averages across seeds 42–44 and arrival rates 0, 8, 9.5 and 11 per hour.

## November 6, 2026 — v0.2.1 release

Owner authorized the reviewed changes for commit and publication. Includes aligned symbolic/numerical equations, textbook fractions, matching amber editing/selection feedback and consistent notation/graph legend styling. Prior draft restrictions above are historical. See verification/mm1.md and verification/equation-layout-review.md for evidence and limits.


## Local review refinement

Owner requested initially collapsed core equations using a native disclosure. See ../verification/ops-review-refinements.md.
