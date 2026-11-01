# Editorial notes

## 2026-10-30 — Setup

The owner's latest instruction selects two public distribution repositories and one private intake workspace. This replaces the original specification's proposed combined repository. docs/downloads/ replaces its generic dist/ path; docs/index.html is each subject's catalog.

The input files are planning documents. Their internal statement that prior notes were reviewed describes an earlier planning pass, not a review performed in this setup. No original lecture-note PDFs, case readings or finance schedule screenshots were supplied here. Exact course-number verification remains pending.

F6's inherited tests include the contradictory sentence “No negative initial investment is allowed as data” alongside negative-initial-investment examples. The working F6 brief corrects this to permit signed cash flows including a negative initial investment; unusual patterns must be labeled. Its approximately 15% IRR example must be independently recomputed and tested with a stated tolerance rather than rounded to an exact identity.

No completed demos are included in this setup. All catalog statuses start planned. This records organization and engineering conventions, not a numerical validation of fourteen domain models.


## 2026-10-31 — M/M/1 pilot

The pilot distinguishes Poisson counts over a fixed interval from exponential gaps between arrivals and exponential service times. “Markov” describes the memoryless queue model, not a separate count/time distribution. λ and μ use customers/hour; displayed times use minutes, with conversions visible in equations. Fractional Lq/L are expected counts; the sample snapshot remains integer valued. At λ ≥ μ the rate ratio can exceed one, but actual busy time cannot exceed 100% and no finite steady-state Lq/L/Wq/W is shown. Numerical examples are illustrative and checked independently of the inherited planning brief. The local draft is awaiting owner review; no public download is generated.
