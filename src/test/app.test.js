import { describe, it, expect, vi, afterEach } from "vitest";
import request from "supertest";
import { app } from "../app.js";
import { Product } from "../models/product.models.js";

describe("Backend API & Controller Test Suite", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // 1. Health Check
  describe("GET / (Health Check)", () => {
    it("should return 200 with status message and JSON header", async () => {
      const response = await request(app).get("/");

      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toMatch(/application\/json/);
      expect(response.body).toHaveProperty("statusCode", 200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body.message).toContain("Backend is running successfully");
    });
  });

  // 2. User Authentication & Registration Validation
  describe("POST /api/v1/users/register (Validation)", () => {
    it("should return 400 error when request body is empty", async () => {
      const response = await request(app)
        .post("/api/v1/users/register")
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("All fields are required");
    });

    it("should return 400 error when required fields are missing", async () => {
      const response = await request(app)
        .post("/api/v1/users/register")
        .send({
          firstname: "John",
          lastname: "Doe",
          // email, mobNumber, password missing
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("All fields are required");
    });
  });

  // 3. User Login Validation
  describe("POST /api/v1/users/login (Validation)", () => {
    it("should return 400 error when neither email nor mobile number is provided", async () => {
      const response = await request(app)
        .post("/api/v1/users/login")
        .send({
          password: "mysecretpassword",
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Email or Number is required");
    });
  });

  // 4. Product Creation Validation
  describe("POST /api/v1/products (Validation)", () => {
    it("should return 400 error when product title is missing", async () => {
      const response = await request(app)
        .post("/api/v1/products")
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Product title/name is required");
    });
  });

  // 5. Protected Routes & verifyJWT Middleware
  describe("Protected Routes & verifyJWT Middleware", () => {
    it("should return 401 when accessing protected route /api/v1/users/logout without token", async () => {
      const response = await request(app).post("/api/v1/users/logout");

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/unauthorized/i);
    });

    it("should return 401 when accessing /api/v1/products without token", async () => {
      const response = await request(app).get("/api/v1/products");

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/unauthorized/i);
    });

    it("should return 401 when providing an invalid/malformed token", async () => {
      const response = await request(app)
        .post("/api/v1/users/logout")
        .set("Authorization", "Bearer invalid-token-xyz");

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  // 6. Database Mocking Unit Tests (Mongoose)
  describe("Product Controller with Database Mocking", () => {
    it("should return 200 with product details when product exists in DB", async () => {
      const mockProduct = {
        _id: "660c1e8a9f1b2c001f3e4d5a",
        title: "Wireless Noise Cancelling Headphones",
        price: 199,
        category: "Electronics",
        stock: 50,
      };

      // Mock Mongoose Product.findById method to return mockProduct
      vi.spyOn(Product, "findById").mockResolvedValue(mockProduct);

      const response = await request(app).get(
        `/api/v1/products/${mockProduct._id}`
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(mockProduct.title);
      expect(response.body.data.price).toBe(199);
    });

    it("should return 404 when product is not found in DB", async () => {
      // Mock Mongoose methods to return null (not found)
      vi.spyOn(Product, "findById").mockResolvedValue(null);
      vi.spyOn(Product, "findOne").mockResolvedValue(null);

      const response = await request(app).get(
        "/api/v1/products/660c1e8a9f1b2c001f3e4d5a"
      );

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Product not found");
    });
  });

  // 7. Unmatched Routes (404)
  describe("Unmatched Routes (404)", () => {
    it("should return 404 for unknown endpoints", async () => {
      const response = await request(app).get("/api/v1/unknown-endpoint-xyz");

      expect(response.status).toBe(404);
    });
  });
});
