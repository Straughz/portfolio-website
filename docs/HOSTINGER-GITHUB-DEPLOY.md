# Hostinger VPS + GitHub Actions: first-time deploy runbook

Use this when wiring **any** Node/Next (or similar) app to **Hostinger Docker Manager** with **push-to-deploy** via the **Hostinger API** from GitHub Actions. Goal: avoid the issues that only show up on the VPS (`.build.log`), not in local dev.

---

## Quick checklist (do in order)

- [ ] **Repo** has a working `Dockerfile` and `docker-compose.yml` at the paths you will reference.
- [ ] **Default branch** name matches what Hostinger resolves for `https://github.com/owner/repo` (often **`master`** or **`main`**—Hostinger docs historically mention `master`; confirm in GitHub **Settings → General**).
- [ ] **Docker Manager** project name is known (e.g. `my-app`) and matches what you send as `project_name` in the API.
- [ ] **Hostinger**: API key from **hPanel → Profile → API**; **VM ID** = digits from `srvNNNNNN.hstgr.cloud` or from the VPS overview URL.
- [ ] **GitHub → Settings → Secrets and variables → Actions**:
  - [ ] Secret: `HOSTINGER_API_KEY`
  - [ ] Variable *or* secret: `HOSTINGER_VM_ID` (digits only, e.g. `1568010`)
  - [ ] Any **runtime** secrets the app needs in production (e.g. `RESEND_API_KEY`).
- [ ] **Workflow** triggers on the correct branch and calls the Hostinger API with **`content: https://github.com/<owner>/<repo>`** (full repo for `build: .`—not only a raw compose URL).
- [ ] **`docker-compose`** passes production env to the **running** container (Compose / Hostinger “Environment”). Do **not** assume those vars exist during **`docker build`** unless you add `ARG`/`ENV` build args on purpose.
- [ ] **No SDK clients at module top level** that **throw** when env is missing (see [Build-time vs runtime](#build-time-vs-runtime) below).
- [ ] **`.dockerignore`** present: ignore `node_modules`, `.next`, `.git`, `.github`, `.env*`, editor folders, large non-app assets.
- [ ] After first deploy: read **`/docker/<project-name>/.build.log`** on the VPS if the site is wrong or Actions is green but the image failed.

Copy this file into another repo’s `docs/` (or keep a personal template) and tick the boxes per project.

---

## GitHub Actions ↔ Hostinger API

### What “green” means

- A green job means the **API accepted** the request and (if you poll) the **orchestration action** Hostinger exposes may show `success`.
- The **real** compile is on the VPS. Always trust **`.build.log`** when debugging image/build failures.

### `content` field (important)

Per Hostinger’s API model, `content` can be:

- **`https://github.com/owner/repo`** — Hostinger resolves **`docker-compose`** on the **default branch** and uses the **full repository** for `build: context: .`. Use this for typical Docker builds.
- **Raw compose URL** — only the YAML file is fetched; **not** enough if your compose uses **`build: .`** (no Dockerfile/source on the server from that URL alone).

### Secrets vs variables

- `HOSTINGER_API_KEY` → **Secret**.
- `HOSTINGER_VM_ID` → **Variable** is fine (not secret); if you only create a **secret** with the same name, the workflow must read **`secrets.HOSTINGER_VM_ID`**, not only `vars`.

### Public vs private GitHub repo

- **Public**: HTTPS clone from Hostinger works without extra keys.
- **Private**: follow Hostinger’s **deploy key on VPS + repo** docs so the server can clone over SSH/HTTPS. **SSH keys on your personal GitHub profile** are for *your* laptop, not for Hostinger’s clone.

---

## Build-time vs runtime (common “works locally, fails on VPS” cause)

| Phase | Has `.env.local`? | Has production secrets? |
|--------|-------------------|---------------------------|
| **Your machine** `npm run build` | Often **yes** (gitignored) | Sometimes |
| **`docker build` on VPS** | **No** | **No**, unless you add `ARG`/`ENV` in Dockerfile |

So:

- Do **not** call **`new ThirdPartySDK(apiKey)`** at **top level** in route modules if the SDK **throws** when the key is missing (e.g. Resend). Use **lazy init** inside the handler, or pass a dummy **build-only** `ARG` you document and never use in production (lazy init is cleaner).
- Anything that runs at **`import` / module load** during `next build` must survive with **empty** production env vars.

---

## Docker hygiene

- **`.dockerignore`**: keeps context small and avoids sending `.git`, `node_modules`, `.next`, secrets, and IDE folders into the daemon.
- **`COPY . .`**: still copies everything *not* ignored—get `.dockerignore` right before relying on CI.

---

## Where to look when something is wrong

1. **GitHub → Actions** — workflow logs; if you poll Hostinger actions, note the final **state** and any JSON error body.
2. **VPS** (Hostinger browser terminal or SSH):  
   `cat /docker/<project-name>/.build.log`  
   — shows `docker build` / `npm run build` / `npm ci` failures with line numbers.
3. **Docker Manager → project → Logs** — runtime container logs after the image exists.

---

## Optional: workflow behavior this repo uses

- Deploy step posts to  
  `POST https://developers.hostinger.com/api/vps/v1/virtual-machines/{VM_ID}/docker`  
  with JSON: `project_name`, `content` (GitHub repo URL), `environment` (newline-separated `KEY=value`).
- Polls  
  `GET …/virtual-machines/{VM_ID}/actions/{actionId}`  
  until a terminal state (so “green” is closer to “orchestration finished”—build failures may still appear in `.build.log` if Hostinger stages them separately).

Copy or adapt **[`.github/workflows/deploy-hostinger.yml`](../.github/workflows/deploy-hostinger.yml)** in this repository as a starting point for other apps (change `project-name`, branch list, and `environment-variables`).

---

## References

- [Deploy to Hostinger VPS using GitHub Actions](https://www.hostinger.com/support/deploy-to-hostinger-vps-using-github-actions/)
- [Hostinger: private GitHub + Docker Manager](https://www.hostinger.com/support/how-to-deploy-from-private-github-repository-on-hostinger-docker-manager/)
- [Troubleshooting Docker Manager](https://www.hostinger.com/support/12040867-troubleshooting-common-docker-manager-issues/) (includes `.build.log` path pattern)
- Hostinger API / action models (for polling): [hostinger/api-python-sdk](https://github.com/hostinger/api-python-sdk) — `VPSDockerManagerApi`, `VPSActionsApi`
