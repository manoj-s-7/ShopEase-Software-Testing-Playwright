# ShopEase CI/CD Documentation

## CI and CD

**Continuous Integration (CI)** validates every push and pull request by installing the locked dependencies, building the application, and running the complete Playwright suite. **Continuous Deployment (CD)** publishes validated builds to Vercel preview or production environments.

The project currently uses Vercel's native GitHub integration as its deployment mechanism. GitHub Actions handles validation and reporting.

## Repository setup

### Prerequisites

- GitHub repository containing this project
- Vercel account
- Node.js 22 (the repository `.nvmrc` selects this version)
- npm and the committed `package-lock.json`

### Local setup

```powershell
npm ci
cp .env.example .env
npm run dev
npm run build
npx playwright install chromium
npm test
npm run test:report
```

The `.env` file is ignored by Git. Set optional browser variables through Vercel or GitHub; never commit credentials.

## GitHub Actions architecture

### `.github/workflows/ci.yml`

Triggers:

- Pushes to `main`
- Pull requests targeting `main`

The workflow has read-only repository permissions and a 30-minute job timeout. It:

1. Checks out the repository.
2. Installs Node.js 22 using `.nvmrc` and caches npm dependencies.
3. Runs `npm ci`.
4. Runs `npm run build`.
5. Installs Chromium with `npx playwright install --with-deps chromium`.
6. Runs `npm test`, which executes all existing tests under `tests/`.
7. Uploads `playwright-report` and `test-results` even when testing fails.

CI sets `CI=true`, applies one retry and two workers through the existing Playwright configuration, disables the `only` guard, and prevents a Playwright web server from being reused.

### Playwright integration

The existing `playwright.config.ts` uses:

- Chromium project and Desktop Chrome device settings
- `http://localhost:5173` as the local base URL
- The Vite development server at the same URL
- Screenshots only for failures
- Video retained for failures
- Trace collected on the first retry
- HTML report output in `playwright-report`
- Raw output in `test-results`

Set `PLAYWRIGHT_BASE_URL` to test a separate deployed server. The configuration then disables the local Vite web server and sends all Playwright navigation to that URL.

Example:

```powershell
$env:PLAYWRIGHT_BASE_URL="https://preview.example.com"
npm test
```

Do not run the complete suite against production if tests create or modify user-visible data. The separate smoke workflow is intended for deployed verification.

## Vercel deployment architecture

Vite builds to `dist/`. `vercel.json` declares Vite explicitly, uses `npm run build`, and adds an SPA fallback to `/index.html`. This allows direct loads and refreshes of React Router paths such as `/shop`, `/product/1`, `/cart`, and `/account`.

The application reads the optional Vite variables:

- `VITE_API_BASE_URL`: external product catalogue API
- `VITE_ENABLE_DEV_TOOLS`: enables test/reset helpers only when explicitly set

In Vercel, configure these under **Project Settings > Environment Variables**:

| Variable | Environment | Recommended value |
|---|---|---|
| `VITE_API_BASE_URL` | Production, Preview, Development | `https://dummyjson.com` |
| `VITE_ENABLE_DEV_TOOLS` | Preview only, if test helpers are needed | `true` |
| `VITE_ENABLE_DEV_TOOLS` | Production | unset or `false` |

Vite exposes `VITE_*` variables to browser code. Do not store tokens or private API keys in Vite variables. A browser-visible value is not a secret.

## Connect GitHub to Vercel

1. Sign in to Vercel and select **Add New > Project**.
2. Import `manoj-s-7/ShopEase-Software-Testing-Playwright`.
3. Confirm framework preset `Vite`.
4. Confirm build command `npm run build`, install command `npm ci`, and output directory `dist`.
5. Add public Vite environment variables if needed.
6. Enable the GitHub integration.
7. Configure production branch as `main`.
8. Open **Git > Deploy Hooks** or repository settings in Vercel and confirm automatic deployments are enabled.

Vercel will create preview deployments for pull requests and non-production branches and production deployments for `main`.

This native integration is the **currently active approach**. The optional GitHub Actions deployment workflow is manual and must not be enabled for automatic runs until native Git deployments are disabled or changed to avoid duplicates.

## Optional GitHub Actions deployment

`.github/workflows/deploy-vercel.yml` is an advanced, manual workflow:

1. It accepts `preview` or `production`.
2. It runs `npm ci`, build, Chromium installation, and the complete Playwright suite.
3. It installs the Vercel CLI.
4. It pulls Vercel project settings.
5. It builds and deploys prebuilt output.

Before using it, add these repository secrets under **GitHub repository > Settings > Secrets and variables > Actions**:

| Secret | How to obtain |
|---|---|
| `VERCEL_TOKEN` | Vercel Account Settings > Tokens |
| `VERCEL_ORG_ID` | Vercel team or account ID |
| `VERCEL_PROJECT_ID` | Vercel project settings |

Never place these values in source files or `.env.example`.

### Safely enable advanced deployments

1. Keep Vercel native GitHub integration enabled until the manual workflow is tested.
2. Run the workflow manually from **Actions > Optional Vercel Deployment > Run workflow**.
3. Choose `preview` or `production`.
4. Confirm that the chosen Vercel environment receives exactly one deployment.
5. When switching to GitHub Actions, disable Vercel's automatic Git deployments or disconnect automatic GitHub deployment in Vercel.
6. Add automatic push and pull-request triggers to `deploy-vercel.yml` only after native deployment is disabled.
7. Keep the CI job ahead of deployment with `needs: ci`.

For production, require a passing CI run and deploy only after `main` or an explicit protected-environment approval. If automatic preview deployments are needed for every branch, keep preview and production job conditions separate.

## Optional deployed smoke tests

`.github/workflows/deployed-smoke.yml` is a manual workflow that accepts a Vercel HTTPS URL. It:

1. Installs Node.js and dependencies.
2. Installs Chromium.
3. Sets `PLAYWRIGHT_BASE_URL` to the supplied URL.
4. Runs only `smoke-tests/deployment-smoke.spec.ts` through `playwright.smoke.config.ts`.
5. Uploads the HTML report and failure output.

Run it from **Actions > Deployed Playwright Smoke Tests > Run workflow**.

The smoke test is read-only and checks:

- The storefront loads.
- A direct `/shop` route loads.
- A direct `/product/1` route loads.

For local deployed-URL testing:

```powershell
$env:PLAYWRIGHT_BASE_URL="https://preview.example.com"
npm run test:smoke
```

The complete suite is intentionally not used by this workflow.

## Viewing test reports

After a GitHub Actions run:

1. Open the workflow run.
2. Scroll to **Artifacts**.
3. Download `playwright-report-<run-id>`.
4. Extract the archive and open `index.html` in a browser.

For failure artifacts, download `playwright-test-results-<run-id>` or `deployed-smoke-<run-id>`. It contains the Playwright output directory, including screenshots, videos, and traces retained according to `playwright.config.ts`.

Locally:

```powershell
npm run test:report
```

## Troubleshooting

### `npm ci` fails

- Confirm `package-lock.json` is committed and matches `package.json`.
- Review dependency or registry errors in the install step.
- Run `npm ci` locally.

### Build fails

- Run `npm run build` locally.
- Review TypeScript errors before the Vite output step.
- Verify Vite environment variable names use the `VITE_` prefix.

### Playwright cannot start Chromium

- Confirm the workflow ran `npx playwright install --with-deps chromium`.
- Review Linux library and browser installation logs.
- Re-run locally with `npx playwright install --with-deps chromium`.

### Tests fail only in CI

- Download and open the HTML report.
- Inspect screenshots, retained videos, and traces in the failure artifact.
- Check CI's 60-second test timeout and two-worker setting.
- Verify tests are not dependent on a pre-existing local browser state.

### A direct route returns 404 on Vercel

- Confirm `vercel.json` is committed at the repository root.
- Confirm the SPA rewrite is active.
- Redeploy the project and retry with a hard refresh.

### Vercel deployment fails

- Verify framework is Vite and output directory is `dist`.
- Verify build command `npm run build`.
- Check Vercel build logs and Environment Variables.
- Confirm native Git integration is not intentionally disabled.

### Advanced deployment rejects credentials

- Confirm all three GitHub secrets exist.
- Recreate expired or leaked tokens and update the GitHub secret.
- Confirm `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` belong to the same Vercel project.

### Duplicate deployments

The native Vercel integration and GitHub Actions CLI deployment must not both be active. Disconnect or disable one deployment mechanism before enabling the automatic advanced workflow.
