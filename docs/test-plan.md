# ShopEase Software Test Plan

## 1. Project overview
ShopEase is a React 19, TypeScript and Vite e-commerce application. It provides a DummyJSON product catalogue and uses browser storage for simulated users, sessions, carts, wishlists and orders.

## 2. Testing objectives
- Verify authentication and protected-route behavior.
- Verify catalogue search, categories, sorting and product details.
- Verify cart, wishlist, checkout and order workflows.
- Verify account profile behavior and browser-state persistence.
- Verify the main end-to-end journeys.
- Detect defects and document limitations honestly.

## 3. Scope
The scope covers home, shop, categories, product details, login, registration, forgot password, cart, wishlist, checkout, order success/history/details, account, navigation and localStorage/sessionStorage behavior.

## 4. Features out of scope
- Real identity provider or password recovery email.
- Real payment processing.
- Real shipping providers.
- Security testing of an intentionally demo-only password implementation.
- DummyJSON backend internals.
- Visual cross-browser/device certification.

## 5. Testing approach
The primary framework is Playwright with TypeScript and Chromium. Tests use stable `data-testid` attributes plus accessible labels and roles. Independent tests reset ShopEase storage through `/dev/reset`. Real DummyJSON requests are used for normal catalogue tests; network failures are mocked only in dedicated error-handling tests.

## 6. Test environment
- Local Vite server: `http://127.0.0.1:5173`
- Browser: Chromium
- Catalogue API: `https://dummyjson.com`
- Demo account: `demo@shopease.test` / `Demo@1234`
- State: localStorage and sessionStorage
- Operating system: Windows

## 7. Tools and technologies
- Playwright Test
- TypeScript
- Chromium
- Vite
- React 19
- DummyJSON
- HTML and list reporters

## 8. Entry criteria
- Dependencies installed.
- Production build succeeds.
- Vite server starts successfully.
- Internet access is available for real catalogue tests.

## 9. Exit criteria
- No unresolved High-priority defect.
- The complete Playwright suite is executed.
- Module-wise results and defects are recorded.
- Build and HTML report are generated.
- Limitations are documented.

## 10. Risks and limitations
- DummyJSON availability can affect catalogue tests.
- Browser storage is not a real backend.
- Test account state can persist unless reset.
- Chromium is the primary committed browser; additional browsers would require later configuration.
- Password recovery is simulated and does not send email.
