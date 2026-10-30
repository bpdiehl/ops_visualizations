# O4 — WIP, Storage & Buffer Dynamics

Status: planned. Catalog slug: wip. Recommended build wave: 2.

Derived from the owner's MBA Interactive Learning Lab planning specification v1.0, 2026-10-30. Read SHARED_REQUIREMENTS.md and ../DESIGN.md alongside this brief. The original documents remain in the private workspace. Class anchors below are inherited, unverified references; their source files were not supplied in this setup. Numerical tests are proposed targets to recompute independently, not evidence that an implementation exists.

The full brief preserves future modes. For a pilot, deliver the simplest faithful mode first and explicitly document deferred scope.

## O4 — WIP, Storage, Multiple Flows & Buffers

**One-sentence promise:** “Watch inventory rise or fall as several processes start, stop, and change rates at different times.”

**Class anchors:** 9.30 Cranberry has a branching process flow, several temporary holding locations, inflow/outflow rates and an inventory-versus-time sketch; 10.7 Variability compares connected random steps with decoupling buffers; 10.12 Stonehaven tracks WIP among stages. The class notes provide a clear foundation for conservation and storage dynamics, while the multi-stream event editor below is a **requested extension**.

**This is a required generalization, not a fixed trapezoid demo.** The graph must support arbitrarily many slope changes, stair-step **rate** curves, and arbitrary **piecewise-linear inventory** curves. A triangle and a trapezoid are only two examples.

### O4.1 Main screen and interactions

Display three linked elements:

1. **Flow network:** Multiple named input processes feed one shared buffer; optionally two downstream processes draw from the same buffer. Arrows show instantaneous rate and run/idle status. Simple mode starts with one input and one output; advanced mode lets users add/remove streams (limit ~6 total for readability).
2. **Rate schedule:** Each stream is a small schedule row with independently editable **start time, end time, constant rate, optional subsequent segments, on/off switch**. Show input rate as positive and requested output rate as negative, with a combined net-rate step chart.
3. **Buffer content graph:** WIP/inventory versus time. Plot exact **linear segments between events**, with corner points whenever a source changes, the buffer empties, or capacity is hit. Highlight the currently selected segment and show its slope in units/time.

Provide a time scrubber: at time `t`, the flow diagram, active streams, inventory graph cursor, capacity use and explanations must agree. Option to display a running clock is optional; scrubbing alone is sufficient.

**Controls:** Each stream's direction, units/time, start/stop, zero or more additional rate segments; initial inventory; simulated horizon; finite storage capacity (default unlimited); optional buffer downstream policy; optional supply-limited output; optionally a multistage/buffer placement preset. Preserve all units and allow a global time-unit switch.

**Outputs:** Inventory `Q(t)` at cursor, simultaneous total effective inflow and outflow, **net accumulation rate `dQ/dt`**, peak inventory, time of peak, lowest inventory, time spent empty/full, first overflow time, total units admitted, total units completed, unmet requested output or overflow/blocking if relevant, and **time-average inventory** (area under Q(t) divided by horizon). Report maximum needed buffer size.

### O4.2 Mathematical contract

For nonnegative inventory, requested streams `i` have piecewise-constant rates `r_in,i(t)` and `r_out,j(t)`; units must agree. The unconstrained net flow is

```
net_requested(t) = sum_i(r_in,i(t)) - sum_j(r_out,j(t))
Q_unconstrained(t) = Q0 + integral_0^t net_requested(s) ds
```

**Physical constraints:** Never allow `Q(t) < 0`. If storage has no inventory and an output process requests more than is available from inventory + current inflow, reduce **actual outgoing rate** to supply. If storage is finite and incoming flow exceeds outgoing capacity when full, declare exactly what happens: **blocked upstream**, **overflow/lost units**, or **held in upstream WIP**. Default to *unlimited storage* in simple mode and provide one clear finite-capacity policy in advanced mode. Never silently discard flow. At the boundary, re-evaluate rates so `Q(t)` remains between 0 and capacity.

**Event-based algorithm:**

- Collect all stream starts, stops and rate changes; sort and deduplicate event times in the horizon.
- On each open interval, the nominal rates are constant. Compute actual rates under empty/full inventory constraints.
- Advance to the earliest of (i) next schedule event, (ii) buffer reaching **0**, or (iii) buffer reaching finite **capacity**; add a vertex there, recompute active flow and continue.
- The area under `Q(t)` should be an exact sum of trapezoid areas for the individual segments: `A = Σ (Q_k + Q_{k+1})/2 × Δt`. Average inventory = `A / horizon`. This **integration method** does **not** restrict the shape to one trapezoid.
- Respect rate conservation: `Q_end − Q_start = cumulative_admitted_in − cumulative_actual_out` (with declared loss/block policy accounted for explicitly).
- If all active streams produce zero net rate, the inventory line is flat. Simultaneous independent changes can cancel without a visible slope change; the rate schedule should still display the underlying events.

**Network extension:** For a branch-to-branch process, use explicit upstream/downstream buffers and transfer links if implemented. Never sum rates from different materials into one unit without a **conversion/yield rule**. For MVP, one shared buffer with multiple independent inflows and outflows is enough to convey the intended nuance.

### O4.3 Discovery presets (minimum)

1. **Triangle:** 0–2 h inflow 10 units/h, no outflow; 2–4 h inflow off, outflow 10 units/h. Starts 0; peaks at 20; area 40 unit-hours; mean over 4 h = 10 units.
2. **Trapezoid:** inflow 10 units/h from 0–2 h, then inflow=outflow=5 units/h from 2–3 h, finally output 10 units/h from 3–5 h; illustrates rise/plateau/fall (adjust the underlying schedules so mass balance holds).
3. **Multiple inputs, staggered start/stop (critical preset):** Input A = 8 units/h from 0–5 h; Input B = 5 units/h from 2–6 h; output = 6 units/h from 1–8 h; initial inventory 0. The plot changes slope at **1, 2, 5, 6 h**, and may also hit zero depending on horizon; show rate contributions at each interval. For 0–8 h, Q(0)=0, Q(1)=8, Q(2)=10, Q(5)=31, Q(6)=30, Q(8)=18 (assuming sufficient supply; here it is). This deliberately creates a multi-corner shape.
4. **Finite buffer / bottleneck:** Two feeds intermittently exceed an output station's capacity; compare unlimited and finite storage with explicit overflow/block policy.
5. **Buffer placement (advanced):** Two variable stages with a finite intermediate buffer; show its effect on blocking and starvation, with a fixed random seed.

**Tooltip copy:**
- **Inflow rate:** “How quickly work enters this storage area from one process. Several independent processes can feed the same buffer at once; add their rates only when the units match.”
- **Outflow rate:** “How quickly work *would* leave if enough inventory were available. Actual outflow may be lower when the buffer is empty or the downstream process is blocked.”
- **Storage rate / net accumulation:** “Incoming rate minus actual outgoing rate, in units per hour. It is the **slope** of the inventory graph. A positive slope adds inventory; a negative slope drains it; zero means the amount remains constant.”
- **Start/end times:** “Each process can begin, stop, or change rate independently. Every such event can change the slope of the inventory curve.”
- **Area under the curve:** “Inventory × time. Divide the full area by the duration to get **average inventory**. The overall shape can be made of many straight segments.”
- **Buffer:** “Work held between processes so one step can keep operating even when the other briefly stops. A buffer can reduce starvation/blocking but creates WIP, space requirements, and longer time in the system.”
- **Storage capacity:** “How much can fit physically. If full, the model must say whether incoming work is blocked upstream or lost; the graph must not continue filling above capacity.”

**Challenges:** “Add a second feed that starts two hours late: where does the graph change slope?” “Make three inputs start at different times: how much storage is required?” “Move the buffer before vs after the slow stage: what changes under interruptions?”

**Out of scope:** Arbitrary plant graph editor with unrestricted routing; detailed routing/splitting for materials with different yields; optimizing buffer location across a large line. Can extend later.

**Acceptance tests:** Exact preset-3 vertices above; zero inventory never goes negative; if inflow=3 and requested output=5 on an empty buffer, actual outflow=3 and inventory stays zero; a net +2 units/h for 4 h starting at 5 units gives 13; zero net rate produces flat Q; average WIP matches exact segment areas; simultaneous events with equal/opposite rate changes don't create spurious inventory jumps; finite-capacity policy conserves or explicitly accounts for units.
