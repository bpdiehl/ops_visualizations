# O1 — Process Flow Fundamentals

Status: ready v0.3; owner approved commit and push November 7, 2026. Catalog slug: process-flow. Recommended build wave: 1.

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


## Earlier v0.1 pilot scope — November 6, 2026

Three fixed FIFO stations, one machine each; continuous exact time, equally spaced arrivals, unlimited waiting and immediate transfers. Arrivals occur in [0,60) starting at0; every admitted unit is scheduled through completion. Four main assumptions: arrival rate and three machine Cycle Times. The main view links a live process snapshot, one chosen unit’s complete journey and local exit-spacing ticks. Starts paused with Play, Next event, Restart and scrubbing. Core rate/CT/TPT/conservation equations are visible, numerically paired and linked to a collapsed key. Shared attention/legend conventions apply.

Optional complete-run averages use all units and one empty-to-empty observation window (at least60 minutes), including startup/draining. The exact finite-cohort area identity is distinguished from a steady-state Little’s Law estimate; overloaded arrivals visibly warn of growing queues. No stochastic queue model is implied. Zero arrivals suppress undefined CT/TPT.

Original defaults CT_A2, CT_B4, CT_C3 min/unit and a15 units/hour: line capacity15 units/hour, CT4min/unit and no-wait TPT9min. Faster A reduces TPT to8 without changing CT4. With a24, unit5 has TPT15 including6 waiting; the queue grows. These are illustrative examples, not reproduced case data.

Private reading glossary pages20–21 was visually checked for CT/TPT/output-rate/WIP terminology. Original source remains private. Independent public support for consistent average inventory/rate/time boundaries: [MIT2.810 introductory lecture, slide42](https://web.mit.edu/course/2/2.810/www/files/lectures/lec1-intro-2018.pdf). The terminology here follows the owner; other references may use cycle time for time in system.

Deferred: variable station count in the UI, parallel machines, initial WIP, alternate process boundaries and steady-state warm-up estimation. Dedicated bottleneck, batching and M/M/1 demos cover related topics. No new commit/push/public download until owner review.


## Owner-directed v0.2 redesign — November 7, 2026

Supersedes the overview/timeline UI above. The primary experience now has two observational modes: Follow a unit (TPT) and Watch a point (CT). One amber dot moves continuously with a selected unit's processing progress and pauses for its waiting; its stopwatch runs from entry to exit. In CT mode, a fixed marker starts the stopwatch at one selected crossing and stops at the next. Paired symbolic/numeric difference equations remain visible. Events are labeled Upcoming/Observed relative to playback.

Marker placement uses diagram click/drag, an accessible slider and boundary buttons. Logical process coordinates are independent of View zoom (whole/A/B/C), so zoom cannot change crossing times. An offscreen marker/unit is explicitly reported and can be brought into view. A processing interior point corresponds to its fraction of station work; an integer boundary corresponds to arrival before downstream waiting. These are progress coordinates, not physical travel distance; transfers remain instantaneous.

The selected local CT can differ upstream/downstream while queues build. Example arrival24/hour: after A / before B has2.50-minute crossing gaps, while mid-B and the exit have4.00-minute gaps. Do not claim constant CT at arbitrary points during accumulation. Default15/hour gives4.00-minute gaps everywhere and9.00-minute TPT. Playback runs only on explicit Play, stops at the selected measurement end, supports speed/step/replay and preserves the exact schedule.

The detailed station table is collapsed below the main interaction. Main controls and shared attention/key styling remain. New pure crossing/position queries have independent tests for exact timestamps, boundary semantics, monotonicity and overload. This remains an uncommitted/unpublished review draft.


## Owner-directed v0.3 steady-state redesign — November 7, 2026

Supersedes v0.2 measurement design. The dominant element is now the process diagram, placed before the equations. The stream runs in steady state from the outset; the focal unit and fixed-point crossing timers loop on Play. The followed-unit replay holds its dot at the exit until the next release scheduled on the CT line cadence, rather than teleporting early to the entrance. No numbered finite cohort, arrivals, queue growth or transient startup is part of this view.

The model uses one to six serial processes, with a configurable processing time per process. Default times are p_A=2, p_B=4, p_C=1 min/unit. There is ample work, no intermediate WIP storage, no waiting buffers and no variability. Units transfer directly; processes work on different units simultaneously. They are released at the bottleneck pace: CT_line=max(p_i)=4 min/unit, while one unit's TPT=sum(p_i)=7 min. At any fixed point, successive units pass at interval CT_line; the phase shifts along the route. Faster processes may be idle between units.

The key is two columns: TPT, t_exit and t_entry on the left; CT, t_2, t_1, process-time and utilization symbols on the right. Capacity utilization is U_i=p_i/CT_line, shown as stacked fractions with live values. The diagram glows in each process color while that process is occupied and is plain during idle time. The diagram supports zoom and a movable fixed observation point. Add/remove controls support one to six processes. A further owner-directed pass moved the diagram full width above a full-width Equations disclosure (collapsed by default), followed by full-width Main assumptions. TPT and CT equations appear side by side, with station utilization in an automatic column grid below. Capacity utilization U_i=p_i/CT_line appears as aligned symbolic and numerical fractions. Owner approved v0.3 for release November 7; the catalog provides Open and Download links.

Owner refinement, November 7: use side-by-side TPT and CT equations within the full-width disclosure, and an automatic column grid for station utilization; wrap utilization as process count/window space requires. Desktop remains the target.
