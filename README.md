# Cacao Co: Chocolate E-Commerce Platform

A full-stack chocolate e-commerce platform built with **React** and **Spring Boot**. Customers browse the chocolate collection, build a cart, check out and track their orders. Administrators manage products, stock and order statuses from an admin panel.


---

## Features

**Customers**
- Browse the product collection with prices, stock availability and a "NEW" badge
- Add to cart or "Buy now", change quantities, remove items (cart is kept in the browser between visits)
- Register and log in (JWT based)
- Checkout with name, email, phone and delivery address
- Free shipping on orders of ₹2,500 and above, otherwise a ₹150 shipping fee
- Order confirmation page and an order history page with statuses

**Administrators**
- Admin dashboard with total products, total orders, revenue and low-stock count (stock of 5 or less)
- Create, edit and delete products (name, category, price, stock, image upload, "new" flag)
- View all orders and move them through the statuses: `PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`

**Platform**
- Role-based access (`CUSTOMER`, `ADMIN`) enforced by the backend
- Stock is checked and reduced when an order is placed; orders with insufficient stock are rejected
- Prices, shipping and totals are always calculated by the server, never trusted from the browser
- An admin account is created automatically on first start

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router 7, Vite 8, plain CSS, Oxlint |
| Backend | Java 25, Spring Boot 4.1.1, Spring Web MVC, Spring Data JPA (Hibernate), Spring Security, Bean Validation, Lombok |
| Authentication | JWT (jjwt 0.12.6), BCrypt password hashing, stateless sessions |
| Database | PostgreSQL |
| Build tools | Maven (wrapper included), npm |

---

## Repository structure

```
cacao-co-ecommerce/
├── Backend/
│   └── cacao/              Spring Boot REST API (Maven)
│       ├── src/main/java/com/ecommerce/cacao/
│       │   ├── config/        security, password encoder, admin seeder
│       │   ├── contoller/     REST controllers (auth, products, orders)
│       │   ├── dto/           request and response objects
│       │   ├── entity/        JPA entities and enums
│       │   ├── exception/     custom exceptions and global handlers
│       │   ├── repository/    Spring Data repositories
│       │   ├── security/      JWT service, filter, user details
│       │   └── service/       business logic
│       └── src/main/resources/application.properties
├── Frontend/
│   └── cacao-co/           React single-page app (Vite)
│       ├── public/images/     product and marketing images
│       └── src/
│           ├── api/           fetch wrappers for the backend
│           ├── components/    Header, Footer, ProtectedRoute
│           ├── context/       Auth, Product and Cart state
│           └── pages/         Home, Shop, Cart, Checkout, Admin, ...
└── README.md
```

---

## Architecture

```
React app (Vite, port 5173)
        │  HTTP + JSON, Authorization: Bearer <JWT>
        ▼
Spring Boot REST API (port 8080)
   JwtAuthenticationFilter → SecurityFilterChain
        │
   Controller → Service → Repository → Hibernate
        ▼
PostgreSQL (database "ecommerce")
```

- The frontend is a separate single-page application that talks to the backend only through the REST API.
- The backend holds the business rules: price lookup, stock checks, shipping fee and order totals.
- Authentication is stateless. The login response contains a JWT that the frontend stores and sends with every request.

---

## Getting started

### Prerequisites

- Git
- JDK 25 (the version set in `pom.xml`)
- Node.js and npm (a current LTS release; check Vite's documentation for the minimum version)
- PostgreSQL

### 1. Clone

```bash
git clone https://github.com/NisargMakwana142/cacao-co-ecommerce.git
cd cacao-co-ecommerce
```

### 2. Create the database

```sql
CREATE DATABASE ecommerce;
```

Check the database name, username and password in `Backend/cacao/src/main/resources/application.properties` and change them to match your PostgreSQL setup. Tables are created automatically on first start.

### 3. Run the backend

```bash
cd Backend/cacao
./mvnw spring-boot:run        # Windows: mvnw.cmd spring-boot:run
```

The API starts on `http://localhost:8080`. On first start an admin account is created from the `admin.email` and `admin.password` settings.

### 4. Run the frontend

```bash
cd Frontend/cacao-co
npm install
npm run dev
```

Open `http://localhost:5173`.

### 5. Try it

1. Open the shop, add products to the cart, register an account and place an order.
2. Log out, then log in with the admin account (email from `admin.email`) to manage products and orders at `/admin`.

---

## Configuration

| Setting | File | Purpose |
|---|---|---|
| `spring.datasource.*` | `application.properties` | PostgreSQL connection |
| `jwt.secret`, `jwt.expiration` | `application.properties` | JWT signing key (at least 32 characters) and lifetime in milliseconds (currently 24 hours) |
| `admin.email`, `admin.password` | `application.properties` | Account created on first start |
| API base URL (`http://localhost:8080/api`) | `Frontend/cacao-co/src/api/api.js` and `authApi.js` | Where the frontend sends requests |
| Allowed CORS origin (`http://localhost:5173`) | `SecurityConfig.java` and controllers | Frontend origin the backend accepts |



---

## User roles

| Role | Access |
|---|---|
| Anonymous | Browse products, register, log in |
| `CUSTOMER` | Everything above, plus place orders and view own orders |
| `ADMIN` | Manage products, view all orders, update order status (can also place orders) |

Public registration always creates a `CUSTOMER`. Admin accounts are created only by the seeder.

---

## How an order works

1. The cart lives in the browser (`localStorage`). The checkout sends only product IDs and quantities plus the delivery details.
2. The backend loads each product, rejects the order if stock is too low (HTTP 409), and uses the stored price.
3. Subtotal = sum of price x quantity. Shipping is ₹0 when the subtotal is ₹2,500 or more, otherwise ₹150.
4. Stock is reduced, the order is saved with status `PENDING`, and the order ID is returned.
5. The customer sees the confirmation page and can follow the order in "My Orders". An admin updates the status.

---

## Known limitations and improvement ideas

These were found while reviewing the code. They are good next tasks.

**Bugs to fix**
- Editing a product does not change its category (`ProductService.updateProduct` calls the getter instead of `setCategory`).
- `GET /api/products/category/{category}` takes a `String` while the entity field is an enum, so the query will likely fail. Change the repository method to accept `ProductCategory`.
- Cancelling an order does not return the stock.

**Robustness**
- Two customers ordering the last unit at the same moment can both succeed. Use pessimistic locking or a versioned update for stock.
- Order status can be set to any value in any order. Add allowed transitions (for example `DELIVERED` cannot go back to `PENDING`).
- Orders are returned as raw entities, which include the full product (and its image) for every item. Return a response DTO instead.
- Product images are stored as base64 text in the database and sent with every product list. Store files on disk or object storage and keep only a URL.

**Security and cleanup**
- Remove the debug `System.out.println` logging in `JwtAuthenticationFilter` and `JwtService`, and stop returning internal exception class names in 500 responses.
- Move secrets out of source control (see the warning above) and use separate configuration profiles for development and production.
- The JWT is kept in `localStorage`, which is exposed to cross-site scripting. Consider an httpOnly cookie for production.
- Rename the package `contoller` to `controller`.

**Features and quality**
- Add category filters, search and a product detail page to the shop.
- Add pagination for products and orders.
- Add automated tests (the backend currently has only the default context-load test; the frontend has none).
- Move the API base URL and CORS origin into environment configuration.
- Add Docker Compose for PostgreSQL, backend and frontend, plus screenshots to this README.

---

## Author

Built by [NisargMakwana142](https://github.com/NisargMakwana142).
