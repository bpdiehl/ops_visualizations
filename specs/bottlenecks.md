# O2 — Bottlenecks & Production Design

Status: local owner-review draft v0.2. Catalog slug: bottlenecks. Recommended build wave: 1.

Derived from the owner's MBA Interactive Learning Lab planning specification v1.0, 2026-10-30. Read SHARED_REQUIREMENTS.md and ../DESIGN.md alongside this brief. The original documents remain in the private workspace. Class anchors below are inherited, unverified references; their source files were not supplied in this setup. Numerical tests are proposed targets to recompute independently, not evidence that an implementation exists.

The full brief preserves future modes. For a pilot, deliver the simplest faithful mode first and explicitly document deferred scope.

## O2 — Bottlenecks & Production System Design

**One-sentence promise:** “Find the system constraint, improve it, and watch the next constraint take over.”

**Class anchors:** 9.9 Donner and 9.29 Scharffen Berger (common-unit capacity comparisons); 10.5 Toshiba (job shop vs assembly line, flexibility, overall pace); 10.12 Stonehaven (labor, machine and process capacity). Also user-described lessons about cells, conveyor belts, nearby bottlenecks and resource utilization economics.

**Learning outcomes:** Identify effective capacity, distinguish utilization from capacity, see why maximizing every station's utilization can hurt system performance, understand migrating bottlenecks, compare product-layout tradeoffs, and choose whether to prioritize worker or machine time depending on cost constraints.

**Main view:** 3–6 station process flow with visual bottleneck highlight, station capacity bars and labeled queues. A single “system throughput” bar reacts to changes. On a constraint improvement, animate the highlight moving to the new bottleneck. If two stations tie, flag both; don't arbitrarily force one winner.

**Controls:** Processing time or rate per station; parallel resources; demand rate; optional product mix and yield per stage (advanced); preset layout (job shop, cell, paced line); in economics mode, worker hourly cost, machine hourly cost, transfer/handling cost and staffing requirement.

**Outputs:** Comparable capacities in units/hour or common kilograms/hour; system capacity, actual throughput, utilization, binding stations; throughput gain from a proposed change; optional effective labor/machine cost per good unit and TPT estimate under a clearly stated layout model.

**Modes:**
1. **Constraint lab:** deterministic serial process; improvement amount and constrained-resource identification.
2. **Layout comparison:** stylized job shop, cell and line with *declared* route/setup/transfer rules. Treat changes to staffing, routings and transfer time as explicit; do not assert one layout always dominates.
3. **Worker vs. machine economics:** compare two provided policy options based on labor cost, machine cost, throughput and utilization. Use monetary assumptions in the example, not vague judgments about which country should keep whom busy.

**Presets:** (1) 12–8–10 units/hour line: middle bottleneck; increase it to 11 and third becomes bottleneck; (2) two equally constrained stations; (3) excess capacity under low demand; (4) flow line versus flexible job shop with a high-variety product mix.

**Tooltips:**
- **Bottleneck:** “The resource or step limiting the output of the process *under the current product mix and available capacity*. Improving another step may not raise output.”
- **Utilization:** “How much of a resource's available capacity is being used. Being busy is not itself the goal: a high-utilization non-bottleneck may create WIP and delays.”
- **Common unit:** “Convert each stage to the same output unit before comparing rates. If yields differ, measure all capacities in terms of **finished good output** or another consistent equivalent.”
- **Process cell:** “A group of machines and/or workers organized around a family of products. It can reduce transfer, handoffs and WIP at the cost of some specialization or flexibility.”
- **Paced line:** “A line where products advance at a specified takt or conveyor pace. The line is constrained by work content, staffing, timing and transfer rules, and may experience blocking or starvation.”

**Model:** Use deterministic station capacities and a transparent product-flow conversion. If processing yields are below 100%, convert upstream nominal input rates to eventual finished-good rates. Takt (available time/customer demand) is **a demand pace**; do not use it as though it is always the line's achieved CT. Layout effects are **scenario parameters**, not universal savings factors. Worker/machine economics must calculate total cost and output across alternatives, and should label idle time/paid time consistently.

**Discovery challenges:** “Make Station B 20% faster; why does capacity increase less than 20%?” “Can two stations simultaneously be bottlenecks?” “When does paying an extra worker save total cost?”

**Out of scope:** General combinatorial line-balancing optimization, detailed multi-product scheduling, arbitrary reentrant networks.

**Acceptance tests:** 12/8/10 yields capacity 8, changing 8→11 yields 10. Demand 6 yields actual throughput 6 with capacity still 8. Two 8-capacity stages are both binding. Rate conversion and yields produce correct comparable finished-unit limits.

## Implemented pilot — November 3, 2026

The constraint lab uses exactly three serial stations, one product and one shared finished-unit basis. Four main controls are three machine rates r_i (units/hour), or equivalent machine Cycle Times CT_i (minutes/unit), and demand d. A Rate / Cycle Time (CT) toggle preserves the full-precision underlying rates. Collapsed **Parallel machines** inputs n_i sit directly beneath the main assumptions. C_i = n_i r_i = n_i × 60/CT_i, C = min(C_A,C_B,C_C), r_out = min(d,C). The station/system equations, substitutions, utilization relation and interactive symbol key are together in one collapsed disclosure under the top/preset section. The chart compares station capacity, demand and line output rate; a table gives utilization r_out/C_i. The line CT at capacity is 60/C. An interactive key defines one symbol per row, including CT_i and station index i, and targets nested subscripts.

This is an ideal deterministic steady-flow calculation, not an event simulation or observed output. It assumes sufficient materials, coordinated release, nonrestrictive buffers, identical independent parallel resources, 100% yield, and no setup/transfer/failure losses. No queue lengths are fabricated. A zero-rate station stops the line; its 0/0 utilization is undefined. Low demand limits output while capacity bottlenecks still identify the minimum capacity.

Presets: middle constraint, B improved to 11, two tied stations, low demand. Presets restore the original baseline and retain the chosen input view; Save current case replaces the baseline. Reset restores initial inputs, rate view and baseline. Machine rates allow 0–30 units/hour, parallel machines integer 1–6, demand 0–60 units/hour. Equivalent finite times must be at least 2 minutes/unit (the 30-unit/hour maximum). A stopped machine has rate 0 and time ∞; its time slider is disabled until a finite time is entered. Finite time sliders start at 2–60 minutes and expand to accommodate larger entered times. Full precision is retained in canonical rates; displayed values use two decimals, machine counts integers.

Cycle Time (CT) for one machine is its interval between completions while working. The station's interval becomes CT/n_i with n_i identical parallel machines; the line CT is set by capacity. The UI avoids presenting the machine CT as whole-line CT. Throughput Time (TPT) measures how long an item spends in the entire process, including waits, and belongs in O1 Process Flow Fundamentals, where WIP and time in system can be taught together. This capacity pilot does not model TPT.

Deferred: 4–6 stations, queue/flow animation, yield and mix conversion, layout comparison and economics. These are future modes, not claims supported by the pilot. No course-case reproduction is included.

Definitions independently checked against [Asef-Vaziri, CSUN, Business Process Flow Engineering, Chapter 2](https://www.csun.edu/~aa2035/CourseBase/Chapters/Process_Flow_Engineering.pdf) (PDF pages 21–23). The pilot uses its own symbols and original numerical examples, and explicitly omits variability. See verification/bottlenecks.md for observed checks and coverage limits. Draft remains outside public downloads pending owner review and release authorization.
