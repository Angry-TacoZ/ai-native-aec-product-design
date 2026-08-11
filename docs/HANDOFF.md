# Goal

Create a speculative, hiring-manager-facing founding-PM product artifact for an AEC AI platform.

# Current status

Interactive local prototype created. It models an architect's collaborative concept review, proposal-first approvals, and 3D handoff using simulated data only.

# Decisions

- Visual source: the warm review-first Option 3 concept.
- Collaboration rule: a proposal is non-live until two distinct simulated editors approve it; the existing decision remains unchanged until then.
- Product posture: preserve existing studio review rituals and treat Rhino/Speckle/Revit interoperability as core; BIM/CAD stays the system of record.
- GitHub Pages slug: `ai-native-aec-product-design`; local development retains `/` while Actions builds use the repository subpath.
- Public repository: `https://github.com/Angry-TacoZ/ai-native-aec-product-design` on `main`.
- No model, CAD, file, network, or persistence integrations are implemented.

# Changed files

- React/Vite prototype under `src/`
- Generated visual asset under `public/assets/`
- Product exercise contents embedded in the Brief panel.

# Verification

- `npm.cmd install` completed with no reported package vulnerabilities.
- `npm.cmd run build` passed.
- Browser-tested the proposal creation, separate Maya/Liam approvals, and handoff-ready transition at `http://127.0.0.1:4174`.
- Browser console was clean after adding the favicon reference; visual QA passed in `design-qa.md` with side-by-side capture evidence under `output/playwright/`.
- The canonical verifier passed with `PYTHONIOENCODING=utf-8` set for the Windows console.
- Added a GitHub Pages Actions workflow; it will become active only after the repo is pushed and Pages is configured to use Actions.
- GitHub Pages was enabled with the Actions source. Workflow run `31489619813` passed build and deploy; live fetch returned HTTP 200 with the expected subpath asset URLs.

# Next task

Optionally add distinct generated images for each alternative before using this in a live interview.

# Risks or blockers

- The artifact is explicitly speculative and has no claims about a real company's roadmap, customers, integrations, or metrics.
- A plain verifier invocation can fail on this machine because its console uses CP-1252; UTF-8 output avoids that environment-only failure.
