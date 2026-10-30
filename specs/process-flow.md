# O1 — Process Flow Fundamentals

Status: planned. Catalog slug: process-flow. Recommended build wave: 1.

Derived from the owner's MBA Interactive Learning Lab planning specification v1.0, 2026-10-30. Read SHARED_REQUIREMENTS.md and ../DESIGN.md alongside this brief. The original documents remain in the private workspace. Class anchors below are inherited, unverified references; their source files were not supplied in this setup. Numerical tests are proposed targets to recompute independently, not evidence that an implementation exists.

The full brief preserves future modes. For a pilot, deliver the simplest faithful mode first and explicitly document deferred scope.

## O1 — Process Flow Fundamentals

**One-sentence promise:** “See why the time it takes to make one item differs from how often the process produces items.”

**Class anchors:** 9.2 introductory process notes; 9.9 Donner process diagrams/capacity; 9.21 Doré Doré (throughput, labor utilization, Little's Law, cells); 10.12 Stonehaven (station times, WIP, throughput time). The notes repeatedly distinguish process time/capacity, throughput, and WIP.

**Learning outcomes:** A learner can (a) define step processing time vs system cycle time vs throughput time, (b) find capacity and actual throughput for a simple line, (c) identify queued and processing WIP, (d) use a *consistent unit* to compare process rates, (e) explain Little's Law as an average system relationship.

**Primary visualization:** An animated left-to-right diagram of 1–4 processing steps with workpieces, timestamps for a highlighted workpiece, and small queues between stations. Below it, a timeline displays **the highlighted unit's journey** and a tick mark every time the line completes a unit. Show a capacity/throughput strip with units/time.

**Controls:** Per-step processing time; parallel machines/workers count (simple mode: one per station); customer arrival/demand rate; initial buffer inventory or start-empty; optionally boundary selection (whole system versus one step). All time quantities use a common selected unit.

**Outputs:** Step capacity, bottleneck capacity, actual completion rate, system CT, highlighted unit TPT (processing + waiting), average WIP, utilization by step, and Little's Law check using measured long-run averages if running a simulation.

**Presets:** (1) single station: processing time equals ideal CT; (2) 3-stage paced line: process times add for no-wait TPT while completed items overlap; (3) starving: low arrival rate; (4) queued line: a constrained middle station with accumulating WIP.

**Tooltips:**
- **Processing time:** “How long the station actually spends working on one unit. When different steps overlap, adding their times does not tell you how often the entire line produces a finished unit.”
- **Cycle time:** “The time between completed units in sustained operation. If the line completes one item every 5 minutes, CT is 5 minutes/unit, even if each item travels through the process for much longer.”
- **Throughput time (TPT):** “How long one unit remains in the system from its entry to its exit, including processing and waiting. A long queue adds TPT without necessarily changing the line's capacity.”
- **Capacity:** “The maximum sustainable production rate. Compare step capacities in the *same unit*; the limiting step determines the capacity of a simple serial process.”
- **WIP:** “Units inside the process boundary right now: waiting or being worked on. A pile of work can keep a station busy but also ties up resources and increases flow time.”
- **Little's Law:** “In a stable system, average WIP equals average throughput rate times average TPT. For example, 6 units/hour × 2 hours = 12 units in process on average.”

**Model:** For a simple dedicated serial line with one item per cycle and independent steps, step nominal capacity = parallel servers / processing time, capacity = minimum step rate, actual stable throughput = min(demand/admitted arrival rate, capacity) where there is sufficient supply and other stated assumptions. For transient scenarios, use event simulation and count actual completions. WIP must be counted from queue + active processing, not estimated as CT×TPT at every instant. Use Little's Law for observed time averages after transient/warm-up, and identify start-up effects.

**Discovery challenges:** “Double the speed of a non-bottleneck station — how many more items leave?” and “Add a waiting queue without changing processing times — what changes, CT or TPT?”

**Out of scope:** Realistic finite conveyor transport mechanics, machine failures, arbitrary branching networks, stochastic arrival-service models (O4/O5 cover those).

**Acceptance tests:** Simple two-step times 2 and 3 min/unit yield nominal capacity 1/3 unit/min and ideal CT 3 min, not 5 min; no-wait traversal processing total 5 min. Demand 0.2 unit/min yields throughput 0.2 rather than nominal 1/3. A stable example at 6 units/hour and 2 hours average TPT reports approximately 12 units average WIP, with correct system boundary and run duration.
