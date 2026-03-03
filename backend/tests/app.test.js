const request = require("supertest");
const app = require("../app");

describe("App", () => {
  describe("GET /api/swim", () => {
    it("should return a health check status", async () => {
      const res = await request(app).get("/api/swim");
      
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: "Backend is running" });
    });
  });

  describe("Invalid routes", () => {
    it("should return 404 for undefined routes", async () => {
      const res = await request(app).get("/api/invalid-route");
      
      expect(res.status).toBe(404);
    });
  });
});
