# O5 — M/M/1 Queueing

Status: planned. Catalog slug: mm1. Recommended build wave: 1.

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
