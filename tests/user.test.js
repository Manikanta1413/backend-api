const request = require("supertest");
const app = require("../src/server");
const User = require("../src/models/user.model");
let token;

beforeAll(async () => {
  const user = await User.create({
    name: "User1",
    email: "user1@example.com",
    password: "password123",
  });

  const res = await request(app).post("/api/auth/login").send({
    email: "user1@example.com",
    password: "password123",
  });
  token = res.body.token;
});

describe("User Routes", () => {
  it("should fetch all users (requires auth)", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
