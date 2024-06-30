import express from "express";
import products from "./data/products.js";
import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT || 5000;

const app = express();

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get("/", (req, res) => {
    res.send("API running...")
});

app.get("/api/products", (req, res) => {
    res.json(products);
});

app.get("/api/product/:id", (req, res) => {
    const product = products.find(p => p._id === req.params.id);
    res.json(product);
});

app.listen(port, () => console.log(`server running on port ${port}`))