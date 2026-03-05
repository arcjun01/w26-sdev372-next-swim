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

      const res = await request(app)
        .get("/api/aquatic-resources");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockResources);
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM aquatic_resources");
      expect(pool.query).toHaveBeenCalledTimes(1);
    });

    it("should return an empty array when no resources exist", async () => {
      pool.query.mockResolvedValueOnce([[]]);

      const res = await request(app)
        .get("/api/aquatic-resources");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM aquatic_resources");
    });

    it("should return a 500 error when database query fails", async () => {
      const dbError = new Error("Database connection failed");
      pool.query.mockRejectedValueOnce(dbError);

      const res = await request(app)
        .get("/api/aquatic-resources");

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
      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO aquatic_resources (title, resource_type, difficulty_level, description, url) VALUES (?, ?, ?, ?, ?)",
        [
          validPayload.title,
          validPayload.resource_type,
          validPayload.difficulty_level,
          validPayload.description,
          validPayload.url
        ]
      );
      expect(pool.query).toHaveBeenCalledTimes(1);
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

      // The query should still be called with undefined values for missing fields
      expect(pool.query).toHaveBeenCalled();
    });

    it("should return 500 error when database insert fails", async () => {
      const dbError = new Error("Duplicate entry");
      pool.query.mockRejectedValueOnce(dbError);

      const res = await request(app)
        .post("/api/aquatic-resources")
        .send(validPayload);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Failed to add resource" });
      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO aquatic_resources (title, resource_type, difficulty_level, description, url) VALUES (?, ?, ?, ?, ?)",
        [
          validPayload.title,
          validPayload.resource_type,
          validPayload.difficulty_level,
          validPayload.description,
          validPayload.url
        ]
      );
    });

    it("should handle various database errors", async () => {
      const errors = [
        new Error("FOREIGN KEY constraint failed"),
        new Error("Column count does not match"),
        new Error("Database is locked")
      ];

      for (const error of errors) {
        pool.query.mockClear();
        pool.query.mockRejectedValueOnce(error);

        const res = await request(app)
          .post("/api/aquatic-resources")
          .send(validPayload);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: "Failed to add resource" });
      }
    });

    it("should preserve the exact structure of request data in response", async () => {
      const customPayload = {
        title: "Special Characters Test: <>&\"'",
        resource_type: "video",
        difficulty_level: "intermediate",
        description: "Test with special chars",
        url: "https://example.com/test?param=value&other=123"
      };

      pool.query.mockResolvedValueOnce([{ insertId: 99 }]);

      const res = await request(app)
        .post("/api/aquatic-resources")
        .send(customPayload);

      expect(res.status).toBe(201);
      expect(res.body.title).toBe(customPayload.title);
      expect(res.body.url).toBe(customPayload.url);
      expect(res.body.id).toBe(99);
    });

    it("should accept JSON requests with correct content-type", async () => {
      pool.query.mockResolvedValueOnce([{ insertId: 5 }]);

      const res = await request(app)
        .post("/api/aquatic-resources")
        .set("Content-Type", "application/json")
        .send(validPayload);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
    });

    it("should handle empty request body", async () => {
      pool.query.mockResolvedValueOnce([{ insertId: 1 }]);

      const res = await request(app)
        .post("/api/aquatic-resources")
        .send({});

      // Database query should still be executed with undefined values
      expect(pool.query).toHaveBeenCalled();
    });
  });

  describe("Request validation and edge cases", () => {
    it("should process requests with extra fields gracefully", async () => {
      const payloadWithExtra = {
        title: "Resource",
        resource_type: "article",
        difficulty_level: "beginner",
        description: "Description",
        url: "https://example.com",
        extraField: "This should be ignored",
        anotherField: 123
      };

      pool.query.mockResolvedValueOnce([{ insertId: 7 }]);

      const res = await request(app)
        .post("/api/aquatic-resources")
        .send(payloadWithExtra);

      expect(res.status).toBe(201);
      expect(res.body).not.toHaveProperty("extraField");
      expect(res.body).not.toHaveProperty("anotherField");
    });

    it("should handle concurrent POST requests", async () => {
      pool.query
        .mockResolvedValueOnce([{ insertId: 20 }])
        .mockResolvedValueOnce([{ insertId: 21 }]);

      const payload = {
        title: "Resource",
        resource_type: "article",
        difficulty_level: "beginner",
        description: "Description",
        url: "https://example.com"
      };

      const [res1, res2] = await Promise.all([
        request(app).post("/api/aquatic-resources").send(payload),
        request(app).post("/api/aquatic-resources").send(payload)
      ]);

      expect(res1.status).toBe(201);
      expect(res2.status).toBe(201);
      expect(res1.body.id).toBe(20);
      expect(res2.body.id).toBe(21);
      expect(pool.query).toHaveBeenCalledTimes(2);
    });
  });
});