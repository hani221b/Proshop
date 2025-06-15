import request from "supertest";
import express from "express";

describe("Express App Debug", () => {
  it("should work with basic route", async () => {
    const app = express();

    app.get("/test", (req, res) => {
      res.json({ message: "test works" });
    });

    const response = await request(app).get("/test").expect(200);

    expect(response.body).toEqual({ message: "test works" });
  });
});
