# O6 — Inventory Decisions

Status: ready v0.1; owner authorized commit/push November 9, 2026. Catalog slug: inventory. Recommended build wave: 2.

Derived from the owner's MBA Interactive Learning Lab planning specification v1.0, 2026-10-30. Read SHARED_REQUIREMENTS.md and ../DESIGN.md alongside this brief. The original documents remain in the private workspace. Class anchors below are inherited, unverified references; their source files were not supplied in this setup. Numerical tests are proposed targets to recompute independently, not evidence that an implementation exists.

The full brief preserves future modes. For a pilot, deliver the simplest faithful mode first and explicitly document deferred scope.

## O6 — Inventory Decisions: EOQ & Critical Fractile

**One-sentence promise:** “Discover why the best order size depends on the costs of ordering, holding, running short and carrying leftovers.”

**Class anchors:** 10.19 Inventory notes: sawtooth replenishment graph, reorder point, EOQ `sqrt(2KD/h)`-type relationship, continuous versus single-period inventory decisions and the critical fractile. The note's point is that different costs imply different optimal decisions.

**Two modes, clearly separated** because the assumptions and objectives differ.

### Mode A — EOQ (repeated replenishment)

**Visualization:** A sawtooth inventory-versus-time chart linked to three cost-versus-order-quantity curves: annual ordering cost, holding cost and total relevant cost. Cursor shows Q and the optimum `Q*`.

**Controls:** Annual demand `D` (units/year), fixed order/setup cost `S` ($/order), holding cost `H` ($/unit/year), order quantity `Q`, optionally constant lead time and reorder point. Use clear unit conversions.

**Core deterministic formulas, under constant demand and instant replenishment:**

```
Annual ordering cost = (D / Q) × S
Annual cycle-stock holding cost = (Q / 2) × H
Total relevant annual cost = DS/Q + HQ/2
Economic order quantity Q* = sqrt(2DS/H)
Ordering frequency D/Q; cycle duration Q/D years
Reorder point (without safety stock) = demand rate × lead time
```

**Info buttons:**
- **EOQ:** “The repeat order quantity balancing the cost of placing orders with the cost of keeping extra inventory. It assumes stable demand, replenishment rules and the holding/setup costs shown.”
- **Order/setup cost:** “The fixed expense incurred each time an order or production run is started. Ordering smaller quantities more often means paying this cost more times.”
- **Holding cost:** “The cost of carrying one unit for one year—space, capital, insurance, shrinkage or similar. Bigger average stocks increase holding cost.”
- **Reorder point:** “The inventory position at which you trigger a new order so stock arrives after lead time. With perfectly known demand and lead time, reorder point equals demand during lead time; uncertainty needs safety stock.”

**Presets:** Small setup cost vs large setup cost; low vs high holding cost; a lead-time example with ROP indicated.

**Acceptance tests:** D=1000 units/year, S=$50/order, H=$2/unit/year → Q*=sqrt(50,000)=223.6068 units; ordering and holding costs equal at optimal Q (apart from rounding). If S quadruples, Q* doubles, holding cost unchanged assumptions. If Q doubles from Q*, ordering cost halves while holding cost doubles. Reject D<0, S<0, H<=0 for finite optimum. Safety stock is **not** included in basic EOQ.

### Mode B — Critical fractile / single-period newsvendor

**Visualization:** A continuous or discrete demand distribution, with a vertical draggable order-quantity line. Shaded tail regions indicate overstock and understock probability, and a curve shows **expected mismatch cost** versus ordered quantity. Display expected leftover units and expected shortages.

**Controls:** Demand distribution and its parameters (simple normal demand as default with nonnegative-demand caveat; optional bounded uniform/discrete example); unit underage cost `Cu`; unit overage cost `Co`; order quantity `Q`. An optional price/cost/salvage builder calculates `Cu`/`Co` but labels assumptions explicitly.

**Core rule for continuous demand:**

```
Critical fractile p* = Cu / (Cu + Co)
Choose Q* so that P(demand <= Q*) = p*
Expected underage units = E[max(Demand − Q, 0)]
Expected overage units = E[max(Q − Demand, 0)]
Expected mismatch cost = Cu × E[underage] + Co × E[overage]
```

For discrete demand, choose the smallest feasible Q for which cumulative probability meets/exceeds the critical fractile (with tie policy explained). Do not confuse marginal shortage cost with unit selling price; lost goodwill may need separate assumptions.

**Info buttons:**
- **Critical fractile:** “The target probability of having enough units on hand in this one-period ordering decision. It is the underage cost divided by underage plus overage cost. More expensive shortages push the optimal order higher.”
- **Underage cost:** “The economic loss from stocking one unit too few when demand exceeds supply: generally lost margin and any other specified consequences.”
- **Overage cost:** “The cost of having one extra unsold unit after demand occurs, such as purchase cost minus salvage value, plus other specified disposal/holding costs.”
- **Demand variability:** “Demand might be near its average or far from it. The same mean with more spread generally increases the importance of choosing a stocking level based on shortage and leftover costs.”

**Presets:** Equal Cu/Co → median; expensive underage → order high quantile; expensive overage → low quantile; narrow vs broad demand distribution.

**Acceptance tests:** Cu=$8, Co=$2 → p*=.8. Cu=Co → p*=.5. Normal demand mean 100, SD 20, p*=.5 → Q*=100. For a continuous symmetrical distribution and equal mismatch costs, median is optimal. Verify expected mismatch costs numerically for discrete cases via sum over demand states.

**Out of scope:** Continuous-review stochastic inventory, multi-item constrained budgets, capacity allocation and supply-chain network optimization.


## Implemented pilot — November 9, 2026

Two modes: positive-input deterministic EOQ and normally distributed single-period newsvendor demand. EOQ uses D/S/H/Q, cost curves, optimal-order action, and three-cycle sawtooth with days=365Q/D. Single period now uses mean μ, positive standard deviation σ, Cu/Co and Q. Replaced the initial uniform-demand implementation at owner direction. Critical fractile p*=Cu/(Cu+Co), z*=Φ⁻¹(p*), Q*=max(0,μ+σz*). Full untruncated normal distribution is used for expected costs/probabilities, including its negative tail. Help explains this approximation; negative-tail probability above0.1% is flagged in view. Zero underage cost choosesQ0; zero overage cost has no finite optimum under unbounded normal demand, disables optimal action and explains the cost lower bound.

Quantity slider and cost graph now have identical domain endpoints: EOQ starts0.10, singleperiod0, maximum based on model range and any larger manually enteredQ. Bounds round outward to0.01 and do not grow merely because the slider reaches its endpoint. Larger values can be entered numerically. Numerical ratios/probabilities are decimal in equations; numerical values align under symbols with fractions. Types above scoped examples, Equations collapsed with nested key. Charts/assumptions and chosenQ slider remain linked. Desktop focus.

Normal/discrete alternative distribution selectors, lead time/ROP, safety stock, price/cost/salvage builder, integer rounding and zero-demand/zero-setup EOQ limit cases deferred. Seven original examples. No commit/push authorized. See verification/inventory.md.

Owner notation refinement: EOQ square root now uses a scalable radical and overbar spanning the entire fraction, without parentheses. Applied to both symbolic and numerical rows while retaining shared atom widths/alignment and accessible square-root text. Desktop screenshot inspected; source syntax, preview/build and whitespace checks pass.

Owner sawtooth refinement: replenishment chart now holds time/inventory scales fixed while inputs change (default365 days/500 units). SmallerQ visibly makes lower, more frequent teeth; greaterD increases delivery frequency. Fit view deliberately frames three current cycles and1.25Q height; further input changes keep those fitted scales. Reset restores default view. Cycles beyond visible height/time are explicitly indicated; very dense cycles use a labeled0–Q envelope to bound rendering. Order/holding costs only alter the optimalQ, not current depletion untilQ changes; help explains this. Desktop browser:Q125 gives8cycles/year and45.63days atD1000 with axesunchanged; D2000 gives22.81days withsameaxes; Fit view becomes68.44days/156.25units; Reset restores365/500 and91.25day cycle. Desktop screenshot inspected; build/check79pass.

Owner example refinement: selecting any example now applies its full-precision optimalQ; mode baselines, Reset and initial load do the same. Example selection remains active when Q matches its computed optimum and clears on manual changes. Browser verified starting EOQ223.61/cost447.21 and expensive-shortage normalQ116.83/cost55.99/probability80%. Optimal-action button is filled blue. Build/check79pass before final initialization-only change; latest preview/build/whitespace verified.

Owner approved release November9: initial/examples/mode defaults use optimalQ; normal-demand singleperiod; fixed sawtooth scales with Fit view; filled optimal action; radical overbar. Standalone download/catalog generated.


## Local review refinement

Keep comparable scales across examples/edits. Expand only when needed, retain expanded frames until Fit view or Reset, show frame readouts and keep quantity slider aligned with plot bounds. See ../verification/ops-review-refinements.md.
