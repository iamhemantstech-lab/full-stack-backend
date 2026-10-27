# Backend Testing Mastery & Interview Guide (Node.js + Express + Vitest / Supertest)

A practical, interview-ready guide on how to test Node.js & Express REST APIs, controllers, middlewares, and databases.

---

## 📑 Table of Contents
1. [Frontend vs Backend Testing: The Mental Shift](#1-frontend-vs-backend-testing-the-mental-shift)
2. [The Industry-Standard Backend Testing Stack](#2-the-industry-standard-backend-testing-stack)
3. [Quick Setup in Your Express Project](#3-quick-setup-in-your-express-project)
4. [Writing Your First API Test (`supertest`)](#4-writing-your-first-api-test-supertest)
5. [The 4 Core Things to Assert in Every API Test](#5-the-4-core-things-to-assert-in-every-api-test)
6. [Testing Protected Routes & Auth Middleware](#6-testing-protected-routes--auth-middleware)
7. [Unit Testing Controllers by Mocking Mongoose (Database)](#7-unit-testing-controllers-by-mocking-mongoose-database)
8. [Database Strategies in Testing: Real DB vs In-Memory vs Mocking](#8-database-strategies-in-testing-real-db-vs-in-memory-vs-mocking)
9. [Top Backend Testing Interview Questions & Answers](#9-top-backend-testing-interview-questions--answers)

---

## 1. Frontend vs Backend Testing: The Mental Shift

| Category | Frontend Testing (React Testing Library) | Backend Testing (Supertest / Vitest) |
| :--- | :--- | :--- |
| **What are you testing?** | User interface & DOM elements | HTTP endpoints, controllers, & middlewares |
| **Inputs** | User clicks, typing, scrolling | HTTP Method (`GET`, `POST`), Headers, Query params, JSON Body, Cookies |
| **Outputs / Assertions** | Text visible on screen, button disabled | **Status code** (200, 400, 401), **JSON payload**, **Cookies** |
| **Environment** | Virtual browser (JSDOM) | Node.js runtime |

---

## 2. The Industry-Standard Backend Testing Stack

1. **Test Runner**: **Vitest** (or **Jest**)
   - Provides `describe`, `it`, `expect`, and `vi.mock()`.
   - In modern Node projects with `"type": "module"` (ESM), **Vitest works out-of-the-box** without complex Babel setup.
2. **HTTP Simulator**: **Supertest**
   - Allows sending simulated HTTP requests (`GET`, `POST`, `PUT`, `DELETE`) directly to your Express `app` without having to start a real server listening on a port.
3. **Database Mocking / In-Memory**:
   - `vi.mock()` / `vi.spyOn()` for pure unit tests.
   - `mongodb-memory-server` for integration tests with a temporary in-memory database.

---

## 3. Quick Setup in Your Express Project

### Step 1: Install dependencies in the backend folder
```bash
npm install -D vitest supertest
```

### Step 2: Add test script in `backend/package.json`
```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest"
}
```

---

## 4. Writing Your First API Test (`supertest`)

In your project, [src/app.js](file:///c:/Users/ADMIN/Documents/FullStack/backend/src/app.js) exports `{ app }`.
Create a test file: `src/test/app.test.js`:

```javascript
import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../app.js";

describe("Root API Endpoint", () => {
  it("GET / should return 200 with welcome message", async () => {
    // Act: Send a GET request to the Express app
    const response = await request(app).get("/");

    // Assert: Verify HTTP status and response body
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain("Backend is running successfully");
  });
});
```

---

## 5. The 4 Core Things to Assert in Every API Test

Whenever you write a test for an endpoint, verify these 4 things:

```text
1. Status Code     👉 Is it 200 (Success), 201 (Created), 400 (Bad Request), 401 (Unauthorized)?
2. Response Body   👉 Does `response.body` have the expected fields and types?
3. Headers         👉 Is `Content-Type` matching `application/json`?
4. Error Handling  👉 When given invalid input, does it return the correct error message?
```

### Example: Testing Validation on `POST /api/v1/users/register`
```javascript
describe("POST /api/v1/users/register", () => {
  it("should return 400 if required fields are missing", async () => {
    // Send empty payload
    const response = await request(app)
      .post("/api/v1/users/register")
      .send({});

    // Expect validation failure
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("All fields are required");
  });
});
```

---

## 6. Testing Protected Routes & Auth Middleware

How do you test routes that require JWT tokens (like `/logout` or `/profile`)?

### Approach 1: Testing Unauthorized Request (No Token)
```javascript
it("POST /api/v1/users/logout should return 401 if user is not logged in", async () => {
  const response = await request(app).post("/api/v1/users/logout");

  expect(response.status).toBe(401);
  expect(response.body.message).toMatch(/unauthorized/i);
});
```

### Approach 2: Testing Authorized Request (With Token or Cookie)
```javascript
it("POST /api/v1/users/logout should succeed when valid JWT is provided", async () => {
  const mockToken = "valid-jwt-token-here";

  const response = await request(app)
    .post("/api/v1/users/logout")
    .set("Authorization", `Bearer ${mockToken}`)
    // Or send cookie:
    .set("Cookie", [`accessToken=${mockToken}`]);

  expect(response.status).toBe(200);
});
```

---

## 7. Unit Testing Controllers by Mocking Mongoose (Database)

In unit tests, you don't want to connect to your real MongoDB cluster. You can mock Mongoose queries using `vi.spyOn`:

```javascript
import { describe, it, expect, vi } from "vitest";
import { User } from "../models/todos/user.models.js";
import request from "supertest";
import { app } from "../app.js";

describe("User Controller Unit Tests", () => {
  it("should return 409 if user email already exists", async () => {
    // Arrange: Mock User.findOne to return a fake existing user
    vi.spyOn(User, "findOne").mockResolvedValue({
      _id: "12345",
      email: "existing@example.com",
    });

    // Act
    const response = await request(app)
      .post("/api/v1/users/register")
      .send({
        firstname: "John",
        lastname: "Doe",
        email: "existing@example.com",
        mobNumber: "9876543210",
        password: "secretPassword123",
      });

    // Assert
    expect(response.status).toBe(409);
    expect(response.body.message).toContain("already exists");

    // Restore original mock
    vi.restoreAllMocks();
  });
});
```

---

## 8. Database Strategies in Testing: Real DB vs In-Memory vs Mocking

| Strategy | When to use | Pros | Cons |
| :--- | :--- | :--- | :--- |
| **Mocking (`vi.spyOn`)** | Unit testing controllers & middlewares | Blazing fast, zero setup, no database needed | Does not test real SQL/Mongoose syntax errors |
| **In-Memory DB (`mongodb-memory-server`)** | Integration tests | Runs real queries against real MongoDB in RAM; auto-resets | Takes a few seconds to boot up in memory |
| **Real Test Database (Staging/Docker)** | End-to-End backend tests | 100% accurate to production | Requires network, slower, must clean up test records |

---

## 9. Top Backend Testing Interview Questions & Answers

### Q1: What is `supertest` and why is it used?
**Answer**: `supertest` is a library for testing Node.js HTTP servers using a fluent API. Instead of booting your server with `app.listen(8000)` and making real network calls with Axios/fetch, `supertest(app)` passes requests directly through the Express middleware pipeline in memory. This makes tests fast and eliminates port conflict issues.

### Q2: What is the difference between a Unit Test and an Integration Test on the backend?
- **Unit Test**: Tests a single controller function or utility without network or database dependencies (database models and services are mocked).
- **Integration Test**: Tests the entire pipeline — routing -> middlewares (CORS, auth, rate limiters) -> controller -> database.

### Q3: How do you handle authentication during API testing?
1. **Mocking Middleware**: Temporarily mock the `verifyJWT` middleware in test setup to inject a fake `req.user`.
2. **Generating a Real Test Token**: Sign a valid JWT using `jwt.sign({ _id: testUser._id }, process.env.ACCESS_TOKEN_SECRET)` and attach it with `.set("Authorization", `Bearer ${token}`)`.
3. **Login First**: Send a `POST /login` in a `beforeAll` hook, store the returned cookie/token, and reuse it across test cases.

### Q4: How do you prevent test data from polluting your production database?
1. Use separate `.env.test` with a dedicated test database URL.
2. Use `mongodb-memory-server` so all data is wiped clean after tests finish.
3. Use `afterEach` or `afterAll` hooks to clean up inserted records:
   ```javascript
   afterEach(async () => {
     await User.deleteMany({});
   });
   ```

### Q5: How do you test error handling middleware in Express?
**Answer**: Send invalid or malformed data that deliberately triggers your custom `ApiError`. Assert that the response matches your standard error structure:
- Proper HTTP status (e.g. 400, 404, 500)
- `response.body.success === false`
- `response.body.message` describes the issue.

---

## 💡 Quick Backend Assertion Cheat Sheet

```javascript
// Check HTTP Status
expect(res.status).toBe(200);

// Check Body
expect(res.body.success).toBe(true);
expect(res.body.data).toHaveProperty("token");
expect(res.body.data.products).toHaveLength(5);

// Check Headers
expect(res.headers["content-type"]).toMatch(/application\/json/);

// Check Cookies
expect(res.headers["set-cookie"]).toBeDefined();
```
