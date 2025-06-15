import request from "supertest";
import express from "express";

const mockFindMany = jest.fn();
const mockFindUnique = jest.fn();

jest.mock("../../lib/prisma", () => ({
  prisma: {
    product: {
      findMany: mockFindMany,
      findUnique: mockFindUnique,
    },
  },
}));

import {
  getProducts,
  getProductById,
} from "../../controllers/productController";

describe("Product Controller Fixed Tests", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.get("/api/products", getProducts);
    app.get("/api/products/:id", getProductById);

    jest.clearAllMocks();
  });

  it("should return all products", async () => {
    const mockProducts = [
      {
        id: 1,
        name: "Product 1",
        userId: 4,
        price: 100,
        description: "Description 1",
        image: "https://example.com/image1.png",
        brand: "brand-1",
        rating: 1.4,
        numReviews: 9,
        countInStock: 7,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    mockFindMany.mockResolvedValue(mockProducts);

    const response = await request(app).get("/api/products").expect(200);

    expect(response.body).toEqual(mockProducts);
    expect(mockFindMany).toHaveBeenCalledTimes(1);
  });

  it("should return product by id", async () => {
    const mockProduct = {
      id: 1,
      name: "Product 1",
      price: 100,
    };

    mockFindUnique.mockResolvedValue(mockProduct);

    const response = await request(app).get("/api/products/1").expect(200);

    expect(response.body).toEqual(mockProduct);
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});
