import express from "express";
import dotenv from "dotenv";
dotenv.config();
import productsRoutes from "./routes/productsRoutes";
import { notFound, errorHandler } from "./middleware/errorMiddleware";
import { metricsHandler } from "./controllers/metricsController";
import { metrics } from "./middleware/metricsMiddleware";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

const port = process.env.PORT || 5002;

const app = express();

app.use(cors({
    origin: ['http://localhost:3000', 'http://proshop.local'],
    credentials: true
  }));

app.use(metrics);
//cookie parser middleware
app.use(cookieParser());

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



app.use("/api/products", productsRoutes);
app.route("/metrics").get(metricsHandler);
app.get("/api/config/paypal", (req, res) => {
  res.send({clientId: process.env.PAYPAL_CLIENT_ID});
});

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`server running on port ${port}`))