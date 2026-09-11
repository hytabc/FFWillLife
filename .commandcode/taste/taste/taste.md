# Taste
- Writes prompts in Chinese; expects deliverables, PRDs, and explanations in Chinese. Confidence: 0.8
- Gives very short follow-ups ("继续", "继续推进") and expects the agent to keep momentum on the current workstream without re-asking scope. Confidence: 0.7
- Explicitly grants latitude to change things himself/itself ("可以直接调整"), i.e. prefers the agent to make reasonable edits and report them rather than stopping to ask for permission on every decision. Confidence: 0.7
- Prefers PRD-first development: read the requirement docs (txt) in the repo, produce a full requirements/design PRD, then implement the code against that PRD. Confidence: 0.75
- Cares about narrative/content quality criteria being explicit and defended: details must "经得起推敲" (hold up under scrutiny) and pacing must be coherent and stable. Confidence: 0.65
- Prefers Chinese names over English abbreviations in player-facing content (e.g. write 跨服通讯贝 / 部队 / 角色内·角色外 instead of CWLS / FC / IC·OOC); abbreviations may remain only as glossary aliases. Confidence: 0.75
- Wants no repeated dialogue lines: each short story/scene should be entirely fresh, with every line belonging to its own letter/scene rather than being reused across them. Confidence: 0.7
- Uses verification as a gate: runs a `/verify` command and expects changes to be validated empirically (tests/type checks clean, with pass/fail counts and any pre-existing failures called out as unrelated). Confidence: 0.65
- Deploys web projects as static sites behind nginx, wrapped in a docker-compose service exposed on the public IP at port 80. Confidence: 0.6
