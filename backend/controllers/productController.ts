import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHanlder.ts";
import Product from "../models/ProductModel.ts";
 
// @desc    Fetch all products
// @route   Get /api/products
// @access  Public
const getProducts = asyncHandler(async (_: Request, res: Response) => {
    const products = await Product.find({});
    res.json(products);
});

// @desc    Fetch a product
// @route   Get /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);
    if(product){
         res.json(product);
    }
    res.status(404).json({message: "Product not found!"});
});

export {getProducts, getProductById}