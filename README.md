# Fieldline — Decision Continuity Artifact

A speculative, local-only product exercise for a founding product-manager role at an AI-native AEC platform.

## Run

```powershell
npm.cmd install
npm.cmd run dev -- --host 127.0.0.1 --port 4173
```

## Interaction path

1. Open **Propose change** and create a non-live proposal.
2. Approve as **Maya** and **Liam** to record two distinct simulated approvals.
3. Open **3D handoff** once the proposal is approved.

All content and integrations are simulated. No external APIs or data stores are used.

## GitHub Pages

The repository slug is configured as `ai-native-aec-product-design`. Once the
repository is pushed to GitHub and Pages is enabled with **GitHub Actions** as
the source, pushes to `main` or `master` deploy the static build to:

`https://<github-owner>.github.io/ai-native-aec-product-design/`
