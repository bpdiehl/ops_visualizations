# Operations owner-review refinements — November 9, 2026

Owner requested local changes to Batching, M/M/1, WIP and Inventory Decisions, then review before release. No commit/push.

- Batching: native initially closed Steady-state capacity disclosure, with existing equations and nested key. Setup/processing column headings now place help buttons flush right. Browser expanded and collapsed the equations and confirmed both info-button right edges equal their column edges. Screenshot inspected.
- M/M/1: native initially closed Equations disclosure. Browser expansion shows current80%/6min/24min substitutions; collapse restores compact layout. Model unchanged.
- WIP: a gray zero-rate baseline and explicit0 label supplement the evenly spaced grid. Browser confirmed the line at the correct mapped zero for staggered and fill/drain examples; screenshot inspected with positive and negative net flow. Model unchanged.
- Inventory: persistent per-mode comparison frames replace automatic shrink/recenter on each edit. EOQ quantity0–600/cost0–3000; single-period quantity0–300/cost0–2000, demand−100–300/density0–0.03. All three EOQ and four normal-demand presets retain these scales, while values/curves change. EOQ replenishment retains its prior365-day/500-unit frame. Frames expand when values need more room, never shrink automatically. Each plot reports its frame; Fit view deliberately refits, Reset restores comparison frames. Quantity slider tracks cost-chart bounds. Source help explains the behavior.

Browser verified all7Inventory examples and identical within-mode scales. Raising mean to500 expanded quantity to800/cost4400; returning to100 retained that frame. Cost Fit view produced0–260/cost880.88 and slidermax260; density Fit view produced−60–260/peak0.012. Reset restored the comparison frames. Final screenshot inspected. Warnings/error logs empty across all four previews. Desktop only; no new detached-file/offline/cross-browser claims. Existing coverage limits remain.

Build and repository checks pass:89Node+7Python=96. Pure mathematical models unchanged; no new model tests needed for the presentation changes. Generated HTML remains uncommitted pending owner review.
