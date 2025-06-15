import { Request, Response } from "express";
import asyncHandler from "..//middleware/asyncHanlder";
import { prisma } from "../lib/prisma";

// @desc    Fetch all products
// @route   Get /api/products
// @access  Public
const getProducts = asyncHandler(async (_: Request, res: Response) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

// @desc    Fetch a product
// @route   Get /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const product = await prisma.product.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  });
  if (product) {
    res.json(product);
  }
  res.status(404).json({ message: "Product not found!" });
});

export { getProducts, getProductById };
