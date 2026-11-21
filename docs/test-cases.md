# ShopEase Test Cases

Actual status and results are updated after automated execution.

## Final execution update

- Executed on 2026-11-21 with Chromium through Playwright.
- Automated suite: 54 tests executed, 54 passed, 0 failed, 0 skipped.
- Production build completed successfully before test execution.
- Test cases backed by an exact automated test are marked Pass in the module execution summary below.
- A separate row for password recovery UI is limited by the app; `/forgot-password` is outside the automated module set.

## Module execution summary

| Module | Automated tests | Passed | Failed | Skipped |
|---|---:|---:|---:|---:|
| Authentication | 10 | 10 | 0 | 0 |
| Product catalogue | 11 | 11 | 0 | 0 |
| Cart | 10 | 10 | 0 | 0 |
| Wishlist | 4 | 4 | 0 | 0 |
| Checkout | 5 | 5 | 0 | 0 |
| Orders | 4 | 4 | 0 | 0 |
| Account | 5 | 5 | 0 | 0 |
| End-to-end | 5 | 5 | 0 | 0 |

| Test Case ID | Module | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Actual Result | Status | Priority |
|---|---|---|---|---|---|---|---|---|---|
| AUTH-001 | Authentication | Valid login | Demo user exists | Open /login; enter demo credentials; submit | demo@shopease.test / Demo@1234 | User signs in and can access account | Pending execution | Not Executed | High |
| AUTH-002 | Authentication | Invalid email login | Clean session | Submit unknown email and a password | missing@shopease.test / Demo@1234 | Invalid credentials alert appears | Pending execution | Not Executed | High |
| AUTH-003 | Authentication | Incorrect password | Demo user exists | Submit demo email with wrong password | demo@shopease.test / Wrong@123 | Invalid credentials alert appears | Pending execution | Not Executed | High |
| AUTH-004 | Authentication | Empty login form | Clean session | Submit login with both fields empty | Empty | Required field messages appear | Pending execution | Not Executed | High |
| AUTH-005 | Authentication | Invalid login email format | Clean session | Enter malformed email and password; submit | invalid-email / Demo@1234 | Valid email message appears | Pending execution | Not Executed | Medium |
| AUTH-006 | Authentication | Password visibility toggle | On /login | Enter password; activate its visibility toggle | Demo@1234 | Password input changes text/visibility state | Pending execution | Not Executed | Medium |
| AUTH-007 | Authentication | Remember-me session persistence | Demo user exists | Enable remember me; login; refresh | Demo account | Session remains authenticated after refresh | Pending execution | Not Executed | High |
| AUTH-008 | Authentication | Session-only session persistence | Demo user exists | Leave remember me off; login; refresh | Demo account | Session remains authenticated after refresh | Pending execution | Not Executed | High |
| AUTH-009 | Authentication | Logout | Logged-in demo user | Open account menu and logout | Demo account | Session clears and navigation becomes guest | Pending execution | Not Executed | High |
| AUTH-010 | Authentication | Protected account route | Logged out | Navigate directly to /account | None | Redirect to /login with notice | Pending execution | Not Executed | High |
| AUTH-011 | Authentication | Protected wishlist route | Logged out | Navigate directly to /wishlist | None | Redirect to /login with notice | Pending execution | Not Executed | High |
| AUTH-012 | Authentication | Protected checkout route | Logged out | Navigate directly to /checkout | None | Redirect to /login with notice | Pending execution | Not Executed | High |
| AUTH-013 | Authentication | Valid registration | Clean users data | Complete registration form and submit | qa.user.timestamp@example.test / Qa@12345 | Account is created and login success notice is shown | Pending execution | Not Executed | High |
| AUTH-014 | Authentication | Existing email registration | Demo user exists | Register with demo email | demo@shopease.test | Duplicate email message is shown | Pending execution | Not Executed | High |
| AUTH-015 | Authentication | Weak password length | Clean session | Enter valid details and 7-character password | Abc123! | Minimum length message appears | Pending execution | Not Executed | High |
| AUTH-016 | Authentication | Weak password complexity | Clean session | Enter valid details and lowercase-only password | abcdefgh | Complexity message appears | Pending execution | Not Executed | High |
| AUTH-017 | Authentication | Password mismatch | Clean session | Enter different confirmation | Qa@12345 / Qa@12346 | Passwords do not match message appears | Pending execution | Not Executed | High |
| AUTH-018 | Authentication | Empty registration form | Clean session | Submit empty registration | Empty | Required and terms validation messages appear | Pending execution | Not Executed | High |
| PROD-001 | Product catalogue | Homepage loads | Application running | Open / | None | Hero and featured sections are visible | Pending execution | Not Executed | High |
| PROD-002 | Product catalogue | Product listing | Internet/API available | Open /shop | None | Product cards and result count are shown | Pending execution | Not Executed | High |
| PROD-003 | Product catalogue | Product details | A product exists | Open first product card | None | Title, description, price, availability and gallery appear | Pending execution | Not Executed | High |
| PROD-004 | Product catalogue | Product search | API available | Search for phone | phone | Matching product cards or result count appear | Pending execution | Not Executed | High |
| PROD-005 | Product catalogue | No search results | API available | Search impossible term | zzznoresult999 | No products found state appears | Pending execution | Not Executed | High |
| PROD-006 | Product catalogue | Category filter | API available | Choose smartphones category | smartphones | URL category and matching category cards update | Pending execution | Not Executed | Medium |
| PROD-007 | Product catalogue | Clear filters | Filters active | Activate clear filters | None | URL filters are removed and all products restore | Pending execution | Not Executed | Medium |
| PROD-008 | Product catalogue | Price low-to-high sorting | API available | Select price-asc | price-asc | Product prices are in ascending order | Pending execution | Not Executed | Medium |
| PROD-009 | Product catalogue | Price high-to-low sorting | API available | Select price-desc | price-desc | Product prices are in descending order | Pending execution | Not Executed | Medium |
| PROD-010 | Product catalogue | Rating sorting | API available | Select rating-desc | rating-desc | Product rating values do not increase in visible order | Pending execution | Not Executed | Medium |
| PROD-011 | Product catalogue | Product navigation | Listing available | Click product title | None | Browser opens corresponding /product/:id route | Pending execution | Not Executed | High |
| PROD-012 | Product catalogue | Invalid product route | API available | Navigate to product/999999 | 999999 | Product not found state appears | Pending execution | Not Executed | Medium |
| PROD-013 | Product catalogue | API failure handling | Route intercept available | Abort DummyJSON requests; open /shop | Blocked API | Shop error state and retry button appear | Pending execution | Not Executed | High |
| PROD-014 | Product catalogue | Product API empty handling | Route intercept available | Return empty product list | `{products:[],total:0}` | No products found state appears | Pending execution | Not Executed | Medium |
| PROD-015 | Product catalogue | Pagination navigation | More than 12 products | Open page 2 | page=2 | Second-page products and results count appear | Pending execution | Not Executed | Medium |
| PROD-016 | Product catalogue | Category image/data navigation | Categories available | Open categories page | None | Category cards navigate with category query | Pending execution | Not Executed | Medium |
| CART-001 | Cart | Add product | Clean cart | Open /shop; add first product | First product | Item count and cart item increase | Pending execution | Not Executed | High |
| CART-002 | Cart | Add multiple products | Clean cart | Add two distinct products | First two products | Cart contains two distinct items | Pending execution | Not Executed | High |
| CART-003 | Cart | Add same product twice | Clean cart | Add first product twice | First product | Quantity becomes 2 rather than duplicate row | Pending execution | Not Executed | High |
| CART-004 | Cart | Increase quantity | One item in cart | Open cart; click increase | Quantity 1 | Quantity becomes 2 and line total increases | Pending execution | Not Executed | High |
| CART-005 | Cart | Decrease quantity | Two units in cart | Open cart; click decrease | Quantity 2 | Quantity becomes 1 and line total decreases | Pending execution | Not Executed | High |
| CART-006 | Cart | Remove product | One item in cart | Open cart and remove item | One item | Cart becomes empty | Pending execution | Not Executed | High |
| CART-007 | Cart | Clear cart | Multiple items in cart | Click clear cart | Multiple items | Cart empty state appears | Pending execution | Not Executed | High |
| CART-008 | Cart | Cart total calculation | Item in cart | Read subtotal, discount, shipping and total | One item | Summary fields match the app calculation rules | Pending execution | Not Executed | High |
| CART-009 | Cart | Free shipping boundary | Cart total close to $100 | Build cart and compare shipping | $100 discounted total | Shipping is free at or above $100 | Pending execution | Not Executed | Medium |
| CART-010 | Cart | Cart persistence | Item in guest cart | Refresh page | Guest cart | Item remains in cart | Pending execution | Not Executed | High |
| CART-011 | Cart | Quantity boundary minimum | Item in cart | Decrease at quantity 1 / clear input | 1 | Decrease remains disabled or validation appears | Pending execution | Not Executed | Medium |
| CART-012 | Cart | Quantity boundary maximum | Item in cart | Enter 999 or click increase repeatedly | 999 | Quantity cannot exceed stock/10 boundary | Pending execution | Not Executed | Medium |
| CART-013 | Cart | Empty cart behavior | No cart items | Open /cart | None | Empty cart state and continue-shopping action appear | Pending execution | Not Executed | High |
| CART-014 | Cart | Guest cart merges on login | Guest cart has item | Login demo account | Guest item + demo | Guest item appears in demo account cart | Pending execution | Not Executed | High |
| WISH-001 | Wishlist | Guest wishlist access blocked | Logged out | Open /wishlist | None | Redirect to login with wishlist notice | Pending execution | Not Executed | High |
| WISH-002 | Wishlist | Add product to wishlist | Logged in | Open product and toggle wishlist | One product | Saved state appears and wishlist count increases | Pending execution | Not Executed | High |
| WISH-003 | Wishlist | Remove from wishlist | Saved item exists | Open wishlist and remove item | One item | Wishlist becomes empty | Pending execution | Not Executed | High |
| WISH-004 | Wishlist | Wishlist persistence | Saved item exists | Refresh wishlist page | One item | Saved item remains | Pending execution | Not Executed | High |
| WISH-005 | Wishlist | Empty wishlist | Logged in/no items | Open /wishlist | None | Empty wishlist state appears | Pending execution | Not Executed | High |
| WISH-006 | Wishlist | Move product to cart | Saved item exists | Click move to cart | One item | Item leaves wishlist and appears in cart | Pending execution | Not Executed | High |
| WISH-007 | Wishlist | Toggle off on details page | Product already saved | Click saved wishlist button again | Saved product | Wishlist item is removed | Pending execution | Not Executed | Medium |
| CHECK-001 | Checkout | Empty checkout blocked | Logged in, cart empty | Navigate to /checkout | None | Empty-cart state appears | Pending execution | Not Executed | High |
| CHECK-002 | Checkout | Checkout access with item | Logged in, cart item exists | Open cart and proceed | One item | Checkout form and summary appear | Pending execution | Not Executed | High |
| CHECK-003 | Checkout | Required fields validation | Cart item exists | Submit checkout with empty fields | Empty required fields | Required field messages appear | Pending execution | Not Executed | High |
| CHECK-004 | Checkout | Invalid email validation | Cart item exists | Enter malformed checkout email | invalid-email | Valid email message appears | Pending execution | Not Executed | High |
| CHECK-005 | Checkout | Invalid phone validation | Cart item exists | Enter 9-digit phone | 123456789 | 10-digit phone message appears | Pending execution | Not Executed | High |
| CHECK-006 | Checkout | Invalid postal code | Cart item exists | Enter 4-digit postal code | 1234 | 5 or 6 digit message appears | Pending execution | Not Executed | Medium |
| CHECK-007 | Checkout | Address validation | Cart item exists | Enter address shorter than 5 characters | 123 | Address minimum message appears | Pending execution | Not Executed | Medium |
| CHECK-008 | Checkout | Successful COD checkout | Cart item exists, all fields valid | Submit COD checkout | Valid delivery details | Order success page appears | Pending execution | Not Executed | High |
| CHECK-009 | Checkout | Successful demo-card checkout | Cart item exists, all fields valid | Select demo card and submit | Valid delivery details | Order success page records demo card payment | Pending execution | Not Executed | High |
| CHECK-010 | Checkout | Cart clears after order | Item in cart | Complete checkout | Valid order | Cart becomes empty | Pending execution | Not Executed | High |
| CHECK-011 | Checkout | Order success details | Checkout completed | Review success page | Created order | Order ID and total appear | Pending execution | Not Executed | High |
| ORDER-001 | Orders | Empty order history | Logged in/no orders | Open /orders | Demo account | No orders yet state appears | Pending execution | Not Executed | High |
| ORDER-002 | Orders | View newly created order | Order placed | Open order history | Created order | New order appears in list | Pending execution | Not Executed | High |
| ORDER-003 | Orders | View order details | Order exists | Click view details | Created order | Details page displays items and delivery | Pending execution | Not Executed | High |
| ORDER-004 | Orders | Verify order total | Order exists | Compare list total with details | Created order | Order totals are consistent | Pending execution | Not Executed | High |
| ORDER-005 | Orders | Verify order item quantity | Order exists | Open details | Created order | Quantity and line total match checkout cart | Pending execution | Not Executed | High |
| ORDER-006 | Orders | Advance order status | Dev tools enabled | Open order details and advance status | Processing order | Status changes to Shipped/Delivered | Pending execution | Not Executed | Medium |
| ORDER-007 | Orders | Order not-found handling | Logged in | Open unknown order URL | unknown-order | Order not found state appears | Pending execution | Not Executed | Medium |
| ACC-001 | Account | View account details | Logged in | Open /account | Demo account | Name and email appear | Pending execution | Not Executed | High |
| ACC-002 | Account | Update profile | Logged in | Change name, phone and address; save | QA Shopper / 1234567890 / Test Address | Profile success and updated summary appear | Pending execution | Not Executed | High |
| ACC-003 | Account | Invalid optional phone | Logged in | Enter 9-digit phone; save | 123456789 | Phone format message appears | Pending execution | Not Executed | Medium |
| ACC-004 | Account | Change password successfully | Logged in | Enter demo current and valid new password | Demo@1234 / Qa@12345 | Password success message appears | Pending execution | Not Executed | High |
| ACC-005 | Account | Wrong current password | Logged in | Enter wrong current password | Wrong@123 | Current password incorrect message appears | Pending execution | Not Executed | High |
| ACC-006 | Account | Password confirmation mismatch | Logged in | Enter mismatched confirmation | Qa@12345 / Qa@12346 | Passwords do not match message appears | Pending execution | Not Executed | Medium |
| ACC-007 | Account | Logout from account menu | Logged in | Open menu and click logout | Demo account | User is signed out | Pending execution | Not Executed | High |
| E2E-001 | End-to-end | Register, shop, cart and checkout | Clean state | Register; login; add product; checkout; view success | Unique QA user / valid details | Complete journey succeeds and cart clears | Pending execution | Not Executed | High |
| E2E-002 | End-to-end | Login, search, wishlist, move cart and checkout | Demo account | Login; search; save product; move to cart; checkout | phone / valid details | Checkout order is created | Pending execution | Not Executed | High |
| E2E-003 | End-to-end | Cart quantity update and removal | Demo account/cart | Login; add two products; update quantities; remove one | Two products | Remaining quantity and totals are correct | Pending execution | Not Executed | High |
| E2E-004 | End-to-end | Place order and view details | Demo account/cart | Login; place order; open orders; open details | Valid delivery details | Order details match successful order | Pending execution | Not Executed | High |
| E2E-005 | End-to-end | Logout blocks protected page | Logged in | Logout; open /account | Demo account | Redirect to /login | Pending execution | Not Executed | High |
