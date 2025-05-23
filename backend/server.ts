import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.ts";
import productsRoutes from "./routes/productsRoutes.ts";
import orderRoutes from "./routes/orderRoutes.ts";
import { notFound, errorHandler } from "./middleware/errorMiddleware.ts";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

const port = process.env.PORT || 5000;

connectDB();
const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));

//cookie parser middleware
app.use(cookieParser());

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



app.use("/api/products", productsRoutes);
app.use("/api/orders", orderRoutes);
app.get("/api/config/paypal", (req, res) => {
  res.send({clientId: process.env.PAYPAL_CLIENT_ID});
})

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`server running on port ${port}`))