# gstack

Use the `/browse` skill from gstack for **all** web browsing. Never use `mcp__claude-in-chrome__*` tools.

Available gstack skills:

- `/office-hours` — talk through a new idea before building
- `/plan-ceo-review` — review a plan from a CEO/product lens
- `/plan-eng-review` — review a plan from an engineering lens
- `/plan-design-review` — review a plan from a design lens
- `/design-consultation` — get design direction on a problem
- `/design-shotgun` — generate many design options at once
- `/design-html` — produce HTML design mockups
- `/review` — code review
- `/ship` — ship the current work
- `/land-and-deploy` — land the change and deploy it
- `/canary` — canary a deploy
- `/benchmark` — run benchmarks
- `/browse` — web browsing (use this instead of any Chrome MCP tool)
- `/connect-chrome` — connect to the gstack browser
- `/qa` — QA the app end to end
- `/qa-only` — QA without the surrounding workflow
- `/design-review` — review implemented UI against design intent
- `/setup-browser-cookies` — set up authenticated browsing
- `/setup-deploy` — configure deploys
- `/setup-gbrain` — install/configure gbrain
- `/retro` — retrospective on completed work
- `/investigate` — investigate a bug or unknown
- `/document-release` — write release documentation
- `/document-generate` — generate documentation
- `/codex` — run work through Codex
- `/cso` — chief security officer review
- `/autoplan` — plan automatically from a goal
- `/plan-devex-review` — review a plan from a developer-experience lens
- `/devex-review` — developer-experience review
- `/careful` — slow, high-care mode for risky changes
- `/freeze` — freeze files against modification
- `/guard` — guard invariants during changes
- `/unfreeze` — release a freeze
- `/gstack-upgrade` — update gstack to the latest version
- `/learn` — capture a lesson back into gstack

Teammates: gstack itself is not vendored here. Install it once with
`git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack && cd ~/.claude/skills/gstack && ./setup`
(requires `bun`).
