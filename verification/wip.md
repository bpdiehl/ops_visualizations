# WIP & Buffer Dynamics v0.1 — owner-review draft

November 9, 2026. Desktop release authorized by owner for commit and push; catalog ready. Original illustrative examples only. Source src/wip/; preview generated with manage.py preview wip.

## Model and scope

One shared buffer with one to six independent streams; each stream has an input/output direction and one to twelve nonoverlapping, independently timed constant-rate segments. Schedules may extend beyond the observation horizon. Events include schedule changes and exact empty/full boundary crossings. Inventory never becomes negative or exceeds finite storage. Empty output is supply limited; excess input at full storage is blocked, counted, and never queued or retried. Stream rates share constrained supply/capacity proportionally. Continuous divisible identical units; hours throughout; no conversion, random variability or multistage networks.

Equations display the inventory balance and actual accumulation rate with current numerical substitution. A collapsed symbol key uses the shared amber selection/editing style. Inventory and actual input/output/net-rate graphs share a time cursor. Finite capacity and initial inventory are editable. Full-horizon results include peak/time, storage needed without blocking (counterfactual unlimited run), minimum/end inventory, admitted/completed/blocked/unmet units, empty/full durations and average inventory via exact area integration. Four discovery presets cover staggered feeds, fill/drain, plateau and finite storage. General unit switching, stream enable switches, animation and multiple connected buffers are deferred; stream schedules/rates provide the stop/start behavior.

## Automated evidence

Final build and check passed: 65 Node model tests and 7 Python packaging tests (72 total), including nine new WIP tests. Independent reference cases assert staggered-feed vertices 0/8/10/31/30/18, area153 and average19.125; triangle area40/mean10; plateau area60/mean12; supply-limited output3 vs requested5; finite-storage blocked16/admitted44/completed42/end2; empty-boundary split; simultaneous events; conservation/bounds/area grid; initial-full buffer; invalid/overlapping inputs. Draft remains outside public downloads.

## Desktop browser evidence

macOS in-app browser, HTTP preview at localhost8776/wip.html. Desktop screenshots inspected; no mobile work intended.

- Default t3 shows Q17 = 0 +29−12; accumulation7=13−6. Network shows inputs8/5 and output6.
- Limited storage at t3 shows full Q15, total actual inflow6 split3.69/2.31, output6, slope0. Full-horizon results show peak15 at2.71, needed without blocking31, end2, admitted44, completed42, blocked16, full duration2.29, average10.84.
- Cursor8 shows end inventory2=44−42 and rates0 after all segments end.
- Fill/drain preset at t3 shows Q10=20−10, slope−10; average10=area40/horizon4. Adding input segment2 from2–3 at5 changed Q(t3) to15, end inventory5 and area47.50. Editing its start to1 produced an overlap validation message and cleared stale values/graphs. Reload restored defaults.
- Latest source renders derivative as a stacked fraction and provides an accessible name for exact time entry. Schedule fields align and both graph axes use vertical left-side labels.

## Limits

Browser stream addition/removal, direction menus, all presets/controls, key pinning, keyboard navigation, graph clicks, help dialogs and error recovery beyond reload were not fully exercised. Console/network diagnostics, detached file:// offline execution, download completion and cross-browser behavior remain unverified. Owner review completed; release authorized with these coverage limits retained.

Owner layout refinement: moved the time slider and exact time entry directly below the inventory graph. Work in the buffer now appears below Flow schedules in a native disclosure, collapsed by default. Reloaded desktop preview confirms section order; slider at5 updates inventory balance31=55−24 and slope−1=5−6. Build and all72 checks pass.

Owner layout refinement: Flow schedules now has fixed Inputs (left) and Outputs (right) columns. Switching direction moves the card immediately, preserves its schedule and color, recalculates the model, and restores focus to its selector. Empty columns remain labeled. Browser verified Stream A input→output→input, including matching balance changes and desktop screenshot. Build/check pass (72 checks).

Latest owner layout: Work in the buffer is a collapsed disclosure within Flow schedules, above its Inputs/Outputs columns. Equations is now a collapsed disclosure above the main graphs. Browser reload confirmed both default closed and the buffer diagram expands in the intended position. Preview/build and whitespace checks passed.

Release layout check: Flow schedules moved before inventory/assumptions and made a native disclosure, initially open. Buffer diagram stays nested at its top and closed by default; equations closed by default. Browser stream creation confirmed a new Input D card; removal and final disclosures checked during release.

Final owner direction: Flow schedules stays below the graphs/main assumptions and does not collapse. Its nested Work in the buffer and the separate Equations sections remain collapsible. This supersedes the preceding schedule-position/disclosure note.
