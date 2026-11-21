# ShopEase Testing Documentation

## Framework architecture

The test framework uses `@playwright/test` with TypeScript. Browser interaction is centralized in `tests/fixtures.ts`, with module suites organized under `tests/auth`, `tests/products`, `tests/cart`, `tests/wishlist`, `tests/checkout`, `tests/orders`, `tests/account` and `tests/e2e`.

Tests prefer application `data-testid` selectors, with labels and roles used where appropriate. Storage is reset between tests using `/dev/reset`, and independent tests use the demo account or unique registration emails.

## Folder structure

```text
tests/
  fixtures.ts
  auth/
  products/
  cart/
  wishlist/
  checkout/
  orders/
  account/
  e2e/
docs/
  test-plan.md
  test-cases.md
  testing-documentation.md
playwright.config.ts
playwright-report/
test-results/
```

## Playwright configuration

- Browser: Chromium
- Test directory: `tests/`
- Base URL: `http://localhost:5173`
- Web server: `npm run dev`
- Reporters: list and HTML
- Failure screenshots: enabled
- Failure videos: enabled
- Trace: enabled on retry
- Default workers: 4
- Per-test timeout: 60 seconds

## Execution commands

```powershell
npm run build
npm test
npm run test:headed
npm run test:ui
npm run test:report
npx playwright test tests/auth/auth.spec.ts
npx playwright test --project=chromium
```

## Test data strategy

- Demo account: `demo@shopease.test` / `Demo@1234`
- Registration tests create timestamped synthetic email addresses.
- Checkout data is synthetic and never uses real payment details.
- `/dev/reset` clears ShopEase browser storage and re-seeds the demo account.
- Real DummyJSON API requests are used for normal catalogue tests.
- Dedicated tests intercept the API to verify network outage and empty-response handling.

## Coverage by module

| Module | Automated tests | Result |
|---|---:|---|
| Authentication | 10 | 10 passed |
| Product catalogue | 11 | 11 passed |
| Cart | 10 | 10 passed |
| Wishlist | 4 | 4 passed |
| Checkout | 5 | 5 passed |
| Orders | 4 | 4 passed |
| Account | 5 | 5 passed |
| End-to-end | 5 | 5 passed |

## Browser and environment

- Operating system: Windows
- Browser: Desktop Chromium
- Application server: Vite at `http://localhost:5173`
- Catalogue dependency: `https://dummyjson.com`
- State: localStorage and sessionStorage
- Normal production build: successful

## Execution summary

- Total test cases documented: 64
- Total automated test cases: 54
- Passed: 54
- Failed: 0
- Skipped: 0
- Final suite duration: 38 seconds
- Defects discovered in application behavior: none

The initial 54-test run found 6 failures caused by 10-worker API pressure and test locator/assertion issues. The affected suites were rerun after the test fixes, 26/26 passed, workers were reduced to 4, and the complete final suite passed 54/54.

## Known limitations

- Authentication and order storage are browser-side simulations, not real secure backends.
- DummyJSON availability or behavior can affect real API catalogue tests.
- Password recovery is simulated and is not automated in a full email workflow.
- No real browser payment or shipping integration exists.
- Chromium is the committed primary browser; other engines are not configured.

## Viewing the HTML report

After a test run, open the HTML report with:

```powershell
npm run test:report
```

The report is generated in `playwright-report/`. Playwright artifacts for failed runs are stored under `test-results/`.
