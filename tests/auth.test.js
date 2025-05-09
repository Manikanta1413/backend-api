const request = require("supertest");
const app = require("../src/server");
const User = require("../src/models/user.model");

describe("Auth Routes", () => {
  const testUser = {
    name: "Test User",
    email: "testuser@example.com",
    password: "password123",
  };

  afterAll(async () => {
    await User.deleteMany({});
  });

  it("should register a user", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe(testUser.email);
  });

  it("should login the user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
const request = require("supertest");
const app = require("../src/server");
const User = require("../src/models/user.model");

describe("Auth Routes", () => {
  const testUser = {
    name: "Test User",
    email: "testuser@example.com",
    password: "password123",
  };

  afterAll(async () => {
    await User.deleteMany({});
  });

  it("should register a user", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe(testUser.email);
  });

  it("should login the user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
