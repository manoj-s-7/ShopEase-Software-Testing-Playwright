# ShopEase

ShopEase is a modern e-commerce web application built with **React 19, TypeScript, Vite, Material UI and Tailwind CSS**. It includes product browsing, search and filtering, authentication, a persistent shopping cart, wishlist, checkout, order history and account management.

The project is part of a software-testing mini-project and includes a complete Playwright + TypeScript automation suite.

## Project information

| Item | Details |
|---|---|
| Project name | ShopEase |
| Application type | E-commerce web application |
| Frontend | React 19 + TypeScript |
| Build tool | Vite |
| UI libraries | Material UI, Tailwind CSS, Lucide React |
| Routing | React Router |
| Forms | React Hook Form |
| Product API | DummyJSON |
| Local data | Browser localStorage and sessionStorage |
| Test framework | Playwright Test |
| Test language | TypeScript |
| Primary test browser | Chromium |
| Test directory | `tests/` |
| Test reports | HTML and list |

## Features

### Storefront

- Responsive home page
- Featured, trending and best-seller sections
- Product catalogue
- Product search
- Category filtering
- Sorting by price and rating
- Pagination
- Product details, images, reviews and related products
- Category browsing
- Newsletter subscription UI

### Authentication and account

- User registration
- Demo-account login
- Email and password validation
- Password visibility controls
- Remember-me sessions
- Logout
- Protected routes
- Profile update
- Password change
- Account summary and order count

### Shopping

- Add products to cart
- Guest cart support
- Cart merging after login
- Increase and decrease quantity
- Remove or clear cart items
- Cart total and shipping calculation
- Cart persistence
- Wishlist for authenticated users
- Move wishlist products to cart
- Simulated checkout and order placement

### Orders

- Cash-on-delivery and demo-card payment options
- Order confirmation
- Order history
- Order details
- Delivery and payment information
- Order status progression
- Test-only order-status simulation

## Demo account

Use the built-in demo account for testing:

```text
Email: demo@shopease.test
Password: Demo@1234
```

This account is recreated automatically by the application reset helper.

## Prerequisites

Install the following before running the project:

- Node.js 20.19 or newer
- npm
- Git
- Internet access for the DummyJSON product API
- A Chromium-compatible environment

Check the installed versions:

```powershell
node --version
npm --version
git --version
```

## Installation

Clone the repository:

```powershell
git clone https://github.com/<your-github-username>/<repository-name>.git
cd <repository-name>
```

Install dependencies:

```powershell
npm install
```

Install the Playwright Chromium browser:

```powershell
npx playwright install chromium
```

## Environment configuration

The application includes `.env.test` and `.env.example`.

The standard API configuration is:

```env
VITE_API_BASE_URL=https://dummyjson.com
VITE_ENABLE_DEV_TOOLS=true
```

Create a `.env` file only when custom environment values are needed:

```powershell
Copy-Item .env.example .env
```

Development mode enables the `/dev/reset` test helper and `window.shopeaseDev` reset tools.

## Run the application

Start the Vite development server:

```powershell
npm run dev
```

Open:

```text
http://localhost:5173
```

Create and preview a production build:

```powershell
npm run build
npm run preview
```

Preview URL:

```text
http://localhost:4173
```

To include the development/test helpers in a production-style preview:

```powershell
npm run preview:test
```

## Available npm scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and create a production build |
| `npm run preview` | Preview the normal production build |
| `npm run preview:test` | Build and preview with test helpers enabled |
| `npm run typecheck` | Run TypeScript type-checking only |
| `npm test` | Run the complete Playwright test suite |
| `npm run test:headed` | Run tests with a visible Chromium browser |
| `npm run test:ui` | Open Playwright UI mode |
| `npm run test:report` | Open the latest HTML report |

## Automated testing

The Playwright framework tests the actual React application and does not rebuild or replace it.

Tests use:

- Existing `data-testid` attributes
- Accessible labels and roles
- Independent browser contexts
- Reset data between tests
- Real DummyJSON catalogue requests
- Mocked API failures only for dedicated error-handling tests
- Synthetic checkout and registration data
- No real payment or external backend

### Test structure

```text
tests/
├── fixtures.ts
├── auth/
├── products/
├── cart/
├── wishlist/
├── checkout/
├── orders/
├── account/
└── e2e/
```

### Run all tests

Start the test run directly:

```powershell
npm test
```

Playwright automatically starts Vite and stops or retains it according to the server configuration.

### Run tests in headed mode

```powershell
npm run test:headed
```

### Run tests with Playwright UI

```powershell
npm run test:ui
```

### Run one test module

```powershell
npx playwright test tests/auth/auth.spec.ts
npx playwright test tests/products/products.spec.ts
npx playwright test tests/cart/cart.spec.ts
npx playwright test tests/wishlist/wishlist.spec.ts
npx playwright test tests/checkout/checkout.spec.ts
npx playwright test tests/orders/orders.spec.ts
npx playwright test tests/account/account.spec.ts
npx playwright test tests/e2e/userJourneys.spec.ts
```

### Run one test by title

```powershell
npx playwright test -g "valid demo credentials"
npx playwright test -g "successful COD checkout"
npx playwright test -g "E2E-004"
```

### Run Chromium explicitly

```powershell
npx playwright test --project=chromium
```

## Test coverage

The project documents **64 test cases** and has **54 executable Playwright test cases**.

| Module | Automated test count | Final result |
|---|---:|---|
| Authentication | 10 | 10 passed |
| Product catalogue | 11 | 11 passed |
| Shopping cart | 10 | 10 passed |
| Wishlist | 4 | 4 passed |
| Checkout | 5 | 5 passed |
| Orders | 4 | 4 passed |
| Account | 5 | 5 passed |
| End-to-end journeys | 5 | 5 passed |
| **Total** | **54** | **54 passed** |

Final execution summary:

```text
54 automated tests executed
54 passed
0 failed
0 skipped
Test browser: Chromium
Execution date: 2026-11-21
```

Covered categories include:

- Valid and invalid login
- Registration and validation
- Logout and protected routes
- Session persistence
- Product listing and details
- Search, category filtering and sorting
- API failure and empty-state handling
- Add, update, remove and clear cart items
- Cart persistence and total calculations
- Wishlist add, remove and move-to-cart
- Checkout validation and simulated payment
- Order creation and history
- Profile and password changes
- Complete end-to-end user journeys

## View test cases and reports

Test documentation:

- [Test plan](docs/test-plan.md)
- [Test cases](docs/test-cases.md)
- [Testing documentation](docs/testing-documentation.md)

Open the latest HTML report:

```powershell
npm run test:report
```

The report is generated in:

```text
playwright-report/
```

Failure screenshots, videos and test artifacts are stored in:

```text
test-results/
```

The report server may open in the default browser. If it does not open automatically, open `playwright-report/index.html` or serve the directory with any static server.

## Reset application test data

To reset users, sessions, carts, wishlists and orders:

```text
http://localhost:5173/dev/reset
```

This helper is available in Vite development mode and in test builds. It resets ShopEase localStorage/sessionStorage data and recreates the demo account.

## Browser storage

ShopEase stores application data using these key patterns:

```text
shopease:users
shopease:session
shopease:cart:guest
shopease:cart:<userId>
shopease:wishlist:<userId>
shopease:orders:<userId>
```

Auth sessions created with Remember Me use localStorage. Sessions created without it use sessionStorage.

## Production build

Run:

```powershell
npm run build
```

The production files are written to:

```text
dist/
```

The build was executed successfully during testing.

## Push to GitHub

Initialize the repository if it is not already initialized:

```powershell
git init
git add .
git commit -m "Complete ShopEase application and Playwright test suite"
git branch -M main
git remote add origin https://github.com/<your-github-username>/<repository-name>.git
git push -u origin main
```

If GitHub already contains the repository:

```powershell
git remote set-url origin https://github.com/<your-github-username>/<repository-name>.git
git push -u origin main
```

Review the files before committing:

```powershell
git status
git diff --stat
```

## Known limitations

- Authentication is a browser-based simulation, not a secure real authentication backend.
- Password recovery is simulated and does not send real email.
- Payment and shipping flows are demonstrations only.
- DummyJSON availability can affect real catalogue tests.
- The committed Playwright project primarily validates Chromium.
- Chromium, cart, wishlist and order state are browser-specific.

## License

Add a license to the repository if distribution is intended. This project is currently suitable for academic, training and demonstration purposes.
