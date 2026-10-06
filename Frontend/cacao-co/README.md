# Cacao Co Frontend (React)

The web storefront and admin panel for the Cacao Co chocolate e-commerce platform. Customers browse products, manage a cart, check out and follow their orders. Administrators manage products and orders. The app talks to the Spring Boot backend through a REST API.


---

## Tech stack

| Area | Technology |
|---|---|
| Library | React 19 |
| Routing | React Router 7 (`react-router-dom`) |
| Build tool | Vite 8 with `@vitejs/plugin-react` |
| HTTP | Built-in `fetch` through a small wrapper (`src/api/api.js`) |
| State | React Context (auth, products, cart) |
| Styling | Plain CSS files |
| Linting | Oxlint |
| Currency | Indian rupees (₹), formatted with `toLocaleString("en-IN")` |

There are only three runtime dependencies: `react`, `react-dom` and `react-router-dom`.

---

## Getting started

### Prerequisites

- Node.js and npm (a current LTS release; check Vite's documentation for the minimum version)
- The backend running on `http://localhost:8080` (see `Backend/cacao/README.md`)

### Install and run

```bash
cd Frontend/cacao-co
npm install
npm run dev
```

Open `http://localhost:5173`. The backend only allows this origin by default (CORS), so keep the dev server on port 5173.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run Oxlint (rules of hooks, only-export-components) |

### Backend URL

The API address is currently written directly in two files:

- `src/api/api.js`: `http://localhost:8080/api`
- `src/api/authApi.js`: `http://localhost:8080/api`

To deploy, move it to an environment variable, for example `VITE_API_BASE_URL` in a `.env` file, and read it with `import.meta.env.VITE_API_BASE_URL` in one shared place.

---

## Pages and routes

| Route | Page | Access | Purpose |
|---|---|---|---|
| `/` | Home | Public | Hero, featured selections, story and gifting sections |
| `/shop` | Shop | Public | Product grid with price, stock, "NEW" badge, Add to cart and Buy now |
| `/cart` | Cart | Public | Change quantities, remove items, order summary with shipping |
| `/checkout` | Checkout | Needs login at submit | Delivery form and order placement |
| `/order-success` | Order success | Public | Confirmation with the order number |
| `/login` | Login | Public | Sign in, then return to the page the user came from; admins go to `/admin` |
| `/register` | Register | Public | Create a customer account |
| `/orders` | Order history | Logged in | The user's own orders and their statuses |
| `/admin` | Admin panel | Admin only | Dashboard, products and orders |

`ProtectedRoute` sends visitors who are not logged in to `/login` (remembering where they wanted to go) and redirects non-admins away from admin routes. The header shows "My orders" for customers and "Admin" for administrators.

---

## Features in detail

### Shop and cart
- Products come from the backend (`GET /products`) and are loaded once by `ProductProvider`.
- Out-of-stock products have disabled buttons.
- The cart is stored in `localStorage` (key `cacao-cart`). On load, old entries with non-numeric IDs (from the earlier static data) are discarded.
- Cart totals shown on screen: subtotal, shipping (free from ₹2,500, else ₹150) and total. The backend recalculates everything when the order is placed, so these are for display.

### Checkout
- Fields: name, email, phone, address, city, postal code. Name and email are pre-filled from the logged-in user.
- Only product IDs and quantities are sent, not prices. The address is sent as one string: `address, city, postalCode`.
- Friendly messages for expired session (401), not allowed (403) and not enough stock (409).
- On success the cart is cleared and the user is taken to the confirmation page.

### Authentication
- Login and registration return a JWT plus basic user data, saved in `localStorage` under `cacao_auth`.
- Every API call adds `Authorization: Bearer <token>` when a token exists.
- If the backend answers 401, the stored login is removed and the app logs the user out (through a `cacao-auth-expired` browser event).
- The auth state also re-syncs when another tab changes the stored login or when the tab regains focus.

### Admin panel (three tabs)
- **Dashboard:** number of products, number of orders, total revenue and the count of low-stock products (stock of 5 or less).
- **Products:** add, edit and delete products. Fields: name, category (dark chocolate, milk chocolate, single origin, gift collections), price, stock, image upload (converted to base64 in the browser) and a "new" flag.
- **Orders:** all orders with customer details, items and totals, and a status selector (`PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`).

---

## Project structure

```
Frontend/cacao-co/
├── index.html
├── vite.config.js
├── package.json
├── .oxlintrc.json
├── public/
│   ├── favicon.svg
│   └── images/              product photos, hero and collection images
└── src/
    ├── main.jsx             app entry
    ├── App.jsx              providers and route table
    ├── api/
    │   ├── api.js           request wrapper, productApi, orderApi
    │   └── authApi.js       register and login calls
    ├── components/
    │   ├── Header.jsx       navigation, cart badge, account links
    │   ├── Footer.jsx
    │   └── ProtectedRoute.jsx
    ├── context/
    │   ├── AuthContext.jsx       login, register, logout, role flags
    │   ├── ProductContext.jsx    product list and admin CRUD actions
    │   ├── CartContext.jsx       cart items and totals
    │   ├── *ContextValue.js      context objects
    │   └── useCart.js, useProducts.js   hooks
    ├── pages/               Home, Shop, Cart, Checkout, OrderSuccess,
    │                        Login, Register, OrderHistory, Admin
    ├── data/products.js     old static sample data (no longer imported)
    └── *.css                index.css, App.css, Auth.css, pages/OrderHistory.css
```

Provider order in `App.jsx`: `BrowserRouter` → `AuthProvider` → `ProductProvider` → `CartProvider`.

---

## Data stored in the browser

| Key | Content |
|---|---|
| `cacao_auth` | Login response: token, user id, name, email, role |
| `cacao-cart` | Cart items with quantities |

---

## Improvement ideas

| Area | Suggestion |
|---|---|
| Configuration | Replace the two hard-coded API URLs with one `VITE_API_BASE_URL` setting and a single shared request helper (`authApi.js` duplicates `api.js`) |
| Shop | Add category filters, search, sorting and a product detail page |
| Admin | Replace `alert()` and `window.confirm()` with in-page messages and a confirmation dialog; split the 1,200-line `Admin.jsx` into smaller components (dashboard, product form, order list) |
| Images | Upload files to the server instead of embedding base64 strings in product data |
| Security | The JWT in `localStorage` can be read by injected scripts. For production consider an httpOnly cookie |
| UX | Loading skeletons, empty and error states on the shop, order detail view, cancel order for customers |
| Quality | Add tests (Vitest and React Testing Library), accessibility checks and an `.env.example` file |
| Cleanup | Delete the unused `src/data/products.js`; replace the default Vite README text with this document |

---

## Troubleshooting

| Problem | Likely cause |
|---|---|
| Empty shop or "Failed to load products" | Backend not running, or the API URL is wrong |
| CORS error in the browser console | The dev server is not on `http://localhost:5173` |
| Logged out unexpectedly | The token expired (24 hours) or the backend returned 401 |
| Checkout shows a stock message | Another order reduced the stock; reduce the quantity |
| Old cart items cause errors | Clear the `cacao-cart` key in the browser's local storage |
