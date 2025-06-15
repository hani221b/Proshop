import request from "supertest";
import express from "express";

describe("Product Controller Debug", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
  });

  it("should work with a simple mock controller", async () => {
    // Test with a simple mock first
    const mockController = (req: any, res: any) => {
      console.log("Mock controller called");
      res.json([{ id: 1, name: "test" }]);
    };

    app.get("/api/products", mockController);

    const response = await request(app).get("/api/products").expect(200);

    console.log("Simple mock response:", response.body);
    expect(response.body).toEqual([{ id: 1, name: "test" }]);
  });

  it("should test controller with manual Prisma mock", async () => {
    // Mock Prisma manually
    const mockPrisma = {
      product: {
        findMany: jest
          .fn()
          .mockResolvedValue([{ id: 1, name: "Product 1", price: 100 }]),
      },
    };

    // Create controller that uses our mock
    const testController = async (req: any, res: any) => {
      try {
        console.log("Test controller called");
        const products = await mockPrisma.product.findMany();
        console.log("Mock products:", products);
        res.json(products);
      } catch (error) {
        console.error("Error in test controller:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    };

    app.get("/api/products", testController);

    const response = await request(app).get("/api/products").expect(200);

    console.log("Manual mock response:", response.body);
    expect(response.body).toHaveLength(1);
    expect(mockPrisma.product.findMany).toHaveBeenCalledTimes(1);
  });

  it("should test actual controller with jest mock", async () => {
    // Reset modules to ensure fresh import
    jest.resetModules();

    // Mock Prisma before importing controller
    const mockFindMany = jest
      .fn()
      .mockResolvedValue([{ id: 1, name: "Product 1", price: 100 }]);

    jest.doMock("@prisma/client", () => ({
      PrismaClient: jest.fn().mockImplementation(() => ({
        product: {
          findMany: mockFindMany,
        },
      })),
    }));

    // Mock asyncHandler to return the function as-is
    // jest.doMock('../../middleware/asyncHandler', () => {
    //   return jest.fn((fn) => fn);
    // });

    // Now import the controller
    const { getProducts } = require("../../controllers/productController");

    console.log("Imported getProducts:", typeof getProducts);

    app.get("/api/products", getProducts);

    const response = await request(app).get("/api/products");

    console.log("Response status:", response.status);
    console.log("Response body:", response.body);
    console.log("Mock called times:", mockFindMany.mock.calls.length);

    expect(response.status).toBe(200);
    expect(mockFindMany).toHaveBeenCalledTimes(1);
  });
});
