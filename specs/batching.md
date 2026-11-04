# O3 — Batching, Setups & Scheduling

Status: local owner-review draft v0.3. Catalog slug: batching. Recommended build wave: 2.

Derived from the owner's MBA Interactive Learning Lab planning specification v1.0, 2026-10-30. Read SHARED_REQUIREMENTS.md and ../DESIGN.md alongside this brief. The original documents remain in the private workspace. Class anchors below are inherited, unverified references; their source files were not supplied in this setup. Numerical tests are proposed targets to recompute independently, not evidence that an implementation exists.

The full brief preserves future modes. For a pilot, deliver the simplest faithful mode first and explicitly document deferred scope.

## O3 — Batching, Setups & Basic Gantt Scheduling

**One-sentence promise:** “See how longer batches save setup time but can delay other work.”

**Class anchors:** 9.16 Fabritek includes machine, external and internal time, a Gantt chart, and observed versus potential cycle time; 9.29 Scharffen Berger includes batches/process stages; 10.5 Toshiba discusses layout/product variety. User also specifically requested very basic Gantt charts, order-size bottlenecks and job-shop-to-line transitions.

**Learning outcomes:** Distinguish setup time from per-item processing time; see Gantt overlaps, machine idle time, handoffs, batch waiting, and bottlenecks that change with order size; understand why a shorter setup or smaller batch can alter overall lead time even without changing raw machine speeds.

**Main view:** **Editable Gantt chart** for 1–3 machines/resources, with colored bars for Product A, Product B, setup and idle/wait time; optional moving current-time marker. Above it, a 2-stage process picture showing batches waiting for their turn.

**Controls:** Batch size A/B; time per unit at each machine; setup duration and whether sequence-dependent; job priority/sequence from a short menu; number of machines (preset, not arbitrary). Simple mode uses one machine with two product types; advanced mode uses two machines and transfer dependencies.

**Outputs:** Total setup time, makespan, completion time of each batch/order, machine active/idle percentages, average unit completion/throughput time over the modeled orders, achieved units per elapsed time. Note that finite-order makespan-based output rate is not automatically steady-state capacity.

**Presets:** (1) small versus large batches with 20-min changeover; (2) two machines with overlapping activity; (3) one late order that suffers from excessive batching; (4) reduced setup time enabling smaller batches.

**Tooltips:**
- **Setup time:** “Time used to prepare a machine for a different job or product. It may occur once per batch rather than once per unit.”
- **Batch size:** “How many units travel or are processed together before switching. Larger batches dilute setups across more units, but other orders may wait longer.”
- **Gantt chart:** “A time map: each row is a resource and each bar shows what it is doing, when it starts, and when it finishes. Use it to identify overlap, gaps and waiting.”
- **Makespan:** “Time from starting the first modeled job until the last modeled job finishes. This is different from average throughput time for a unit.”
- **Internal vs external time:** “Internal time requires the machine to be stopped; external time can be done while the machine is working, if staffing and rules allow. Moving eligible work outside the stopped period can shorten cycle time.”

**Model:** Deterministic discrete-event scheduler with explicit precedence: a machine cannot process two jobs simultaneously; setup may be required between product types; stage 2 cannot process a unit/batch until it has arrived; a shared worker cannot execute overlapping tasks. Define **transfer-batch policy** (entire batch vs per-unit transfer) and distinguish it from process-batch size. In advanced mode, allow external setup only when rules permit overlapping worker availability. Every Gantt bar represents a real resource activity whose end equals start + duration.

**Discovery challenges:** “Increase the batch size and watch the first unit's time in system.” “Reduce setup time; can smaller batches now make sense?” “Which resource is actually idle?”

**Out of scope:** Full general job-shop solver, automated optimal scheduling, complex calendar/shift management.

**Acceptance tests:** A single machine processing 10 units at 2 min/unit plus one 5-minute setup has 25 min of scheduled processing/setup. No overlapping bars on one exclusive machine. Two machines may overlap legitimately if precedence allows. Altering a sequence can change completion times without changing individual process times.


## Implemented pilot — November 3, 2026

Focused first mode: three serial stations, one machine each, one product. Shared process/transfer batch B (1–60 whole units), setup s_i (0–60 min/batch), processing time t_i (0.1–5 min/unit). Effective CT_i=s_i/B+t_i; C_i=60/CT_i; C=min C_i; u_i=C/C_i at repeating line capacity. Keep raw processing time t_i distinct from effective CT_i. Capacity curves and current outputs consume the same pure model.

Finite order Q (1–600 units) uses whole-batch transfer, immediate transport, setup on arrival, repeated setup at every batch including a partial final batch, exclusive station occupancy and initially available material. Start S_i,b=max(F_i−1,b,F_i,b−1); finish F_i,b=S_i,b+s_i+q_b t_i, with missing predecessors finishing at zero. First-batch completion is at station C; makespan T finishes the whole order; finite-order r_out=60Q/T includes startup. This is not individual-item TPT. No shared workers, outside setup or restricted buffers.

Original illustrative defaults: s=[30,15,0], t=[0.5,1.5,2], B=20, Q=120. Small B5 has bottleneck A and capacity9.2308…; Middle ground B20 has bottleneck B and capacity26.6667…; Large B60 has bottleneck C and capacity30 units/hour. These three presets change only batch size. A/B tie at B15; B/C tie at B30. Default first batch finishes at125 minutes and order at350 minutes; at B60 these increase to285 and405 minutes. Capacity is a steady-state repeating-full-batch limit, whereas the finite schedule includes startup/handoff and the final partial batch.

Deferred: mixed products/sequencing, external setup, parallel machines and optimization. These remain future modes in the inherited brief. No course-case reproduction or exact course notation claim. Owner review precedes commit/push; no public download while draft. See verification/batching.md.


Owner refinement v0.2: every setup/processing input now has a synchronized slider and exact-entry field. The collapsed key contains only the eight symbols present in the four main capacity equations. Removed scheduling recurrence equations, their symbol entries, and the secondary finite-order-rate metric from the UI; the Gantt area focuses on first-batch and whole-order completion. Its precedence/transfer rules remain in the information button and pure model.
