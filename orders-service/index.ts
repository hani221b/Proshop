import express from "express";
import dotenv from "dotenv";
dotenv.config();
import ordersRoutes from "./routes/ordersRoutes";
import { notFound, errorHandler } from "./middleware/errorMiddleware";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";cd 
import cors from "cors";

const port = process.env.PORT || 5003;

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



app.use("/api/orders", ordersRoutes);
app.get("/api/config/paypal", (req, res) => {
  res.send({clientId: process.env.PAYPAL_CLIENT_ID});
})

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`server running on port ${port}`))