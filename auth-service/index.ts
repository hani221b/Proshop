import express from "express";
import dotenv from "dotenv";
dotenv.config();
import usersRoutes from "./routes/userRoutes";
import { notFound, errorHandler } from "./middleware/errorMiddleware";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

const port = process.env.PORT || 5001;

const app = express();

app.use(cors({
    origin: ['http://localhost:3000', 'http://proshop.local'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'] 
  }));

//cookie parser middleware
app.use(cookieParser());

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



app.use("/api/users", usersRoutes);
app.get("/api/config/paypal", (req, res) => {
  res.send({clientId: process.env.PAYPAL_CLIENT_ID});
})

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`server running on port ${port}`))