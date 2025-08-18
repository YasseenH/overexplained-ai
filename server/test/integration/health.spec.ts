import request from "supertest";
import { app } from "../../src/server";

describe("Health Check", () => {
  it("should return 200 for health check", async () => {
    const response = await request(app).get("/v1/health");
    expect(response.status).toBe(200);
  });
});
