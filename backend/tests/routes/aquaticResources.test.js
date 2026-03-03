const request = require("supertest");
const app = require("../../app");

// Mock the database pool
jest.mock("../../src/config/db");
const pool = require("../../src/config/db");

describe("Aquatic Resources Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/aquatic-resources", () => {
    it("should return all aquatic resources", async () => {
      const mockResources = [
        {
          id: 1,
          title: "Swim Basics",
          resource_type: "tutorial",
          difficulty_level: "beginner",
          description: "Learn the basics of swimming",
          url: "https://example.com/swim-basics"
        },
        {
          id: 2,
          title: "Advanced Techniques",
          resource_type: "video",
          difficulty_level: "advanced",
          description: "Advanced swimming techniques",
          url: "https://example.com/advanced-techniques"
        }
      ];

      pool.query.mockResolvedValueOnce([mockResources]);

      const res = await request(app).get("/api/aquatic-resources");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockResources);
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM aquatic_resources");
      expect(pool.query).toHaveBeenCalledTimes(1);
    });

    it("should return an empty array when no resources exist", async () => {
      pool.query.mockResolvedValueOnce([[]]);

      const res = await request(app).get("/api/aquatic-resources");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM aquatic_resources");
    });

    it("should return a 500 error when database query fails", async () => {
      const dbError = new Error("Database connection failed");
      pool.query.mockRejectedValueOnce(dbError);

      const res = await request(app).get("/api/aquatic-resources");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Failed to fetch aquatic resources" });
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM aquatic_resources");
    });

    it("should handle various error types gracefully", async () => {
      const errors = [
        new Error("ECONNREFUSED"),
        new Error("Timeout occurred"),
        new Error("Access denied")
      ];

      for (const error of errors) {
        pool.query.mockClear();
        pool.query.mockRejectedValueOnce(error);

        const res = await request(app).get("/api/aquatic-resources");

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: "Failed to fetch aquatic resources" });
      }
    });
  });

  describe("POST /api/aquatic-resources", () => {
    const validPayload = {
      title: "Swimming Pool Guide",
      resource_type: "article",
      difficulty_level: "beginner",
      description: "A complete guide to public swimming pools",
      url: "https://example.com/pools"
    };

    it("should create a new aquatic resource successfully", async () => {
      const mockResult = { insertId: 10 };
      pool.query.mockResolvedValueOnce([mockResult]);

      const res = await request(app)
        .post("/api/aquatic-resources")
        .send(validPayload);

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        id: 10,
        ...validPayload
      });
    });

    it("should create a resource and return the correct insert ID", async () => {
      pool.query.mockResolvedValueOnce([{ insertId: 42 }]);

      const res = await request(app)
        .post("/api/aquatic-resources")
        .send(validPayload);

      expect(res.status).toBe(201);
      expect(res.body.id).toBe(42);
    });

    it("should handle missing required fields", async () => {
      const incompletePayload = {
        title: "Incomplete Resource"
      };

      const res = await request(app)
        .post("/api/aquatic-resources")
        .send(incompletePayload);

      expect(pool.query).toHaveBeenCalled();
    });
  });
});