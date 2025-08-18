import request from "supertest";
import { app } from "../../src/server";

describe("Newsletter Signup", () => {
  it("should create a new subscriber", async () => {
    const response = await request(app)
      .post("/v1/newsletter/signup")
      .send({
        email: "test@example.com",
        topics: ["technology"],
      });

    expect(response.status).toBe(201);
    expect(response.body.email).toBe("test@example.com");
    expect(response.body.topics).toEqual(["technology"]);
  });
});
