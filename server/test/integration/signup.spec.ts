import request from "supertest";
import HttpStatus from "http-status";
import { createServer } from "../../src/server";
import { PrismaClient } from "@prisma/client";
import { TestPubSub } from "../../src/services/pubsub/test-pubsub";

describe("signup", () => {
  const prisma = new PrismaClient();
  const pubSub = new TestPubSub();
  const server = createServer({ prisma, pubSub }).listen(80);

  afterAll(async () => {
    server.close();

    // Clean up
    await prisma.newsletterSubscriber.deleteMany();

    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean up
    await prisma.newsletterSubscriber.deleteMany();
  });

  it("should throw 400 if not sent an email in the body", async () => {
    await request(server)
      .post("/v1/newsletter/signup")
      .send()
      .expect(HttpStatus.BAD_REQUEST);
  });

  it("should return a 400 if an invalid email is sent", async () => {
    await request(server)
      .post("/v1/newsletter/signup")
      .send({ email: "invalid-email@.com" })
      .expect("Content-Type", /json/)
      .expect(HttpStatus.BAD_REQUEST);
  });

  it("should not fail if the email is already registered", async () => {
    const email = "valid-email@mail.com";

    await request(server)
      .post("/v1/newsletter/signup")
      .send({ email })
      .expect("Content-Type", /json/)
      .expect(HttpStatus.CREATED);

    const first = await prisma.newsletterSubscriber.findFirst({
      where: { email },
    });

    await request(server)
      .post("/v1/newsletter/signup")
      .send({ email })
      .expect("Content-Type", /json/)
      .expect(HttpStatus.CREATED);

    const second = await prisma.newsletterSubscriber.findFirst({
      where: { email },
    });

    const hasNewToken = first?.token !== second?.token;
    expect(hasNewToken).toBeTruthy();
  });

  it("should throw 201 if a valid email is sent", async () => {
    await request(server)
      .post("/v1/newsletter/signup")
      .send({ email: "valid@mail.com" })
      .expect("Content-Type", /json/)
      .expect(HttpStatus.CREATED);
  });
});
