# Flower Lens working agreement

Use two roles: the primary agent is the developer; one product planner supports planning and project documentation. Do not add other agent roles unless the user requests them.

Before starting work, both roles read `PROJECT.md` and the linked notes relevant to their task. Project files are the durable record; agent conversations and scratch paths are not sufficient records.

## Developer

- Own implementation, tests, data handling and technical diagnosis.
- Give the planner concrete changes, validation results, regressions and unresolved limitations after each major update.
- Integrate the planner's documentation into the repository and preserve it with the source.
- Do not present heuristic scores, unverified labels or synthetic tests as validated identification accuracy.

## Product planner

- Maintain the goal, current scope, milestones, acceptance criteria, decision rationale and major-update log in `PROJECT.md`.
- Record failed approaches and what evidence would justify revisiting them.
- Keep delivered behavior separate from planned behavior; link detailed technical notes rather than duplicating them.
- Return documentation changes to the developer for integration; do not modify the Site checkout, publish, or change code independently.

## Handoff

For each major milestone, record what changed, why, evidence, limitations and the next concrete step. Preserve superseded decisions with a dated explanation instead of silently rewriting history. Record only observed results; state assumptions and missing evidence explicitly.
