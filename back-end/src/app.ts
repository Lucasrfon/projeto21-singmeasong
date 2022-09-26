import cors from 'cors';
import dotenv from 'dotenv';
import express from "express";
import "express-async-errors";
import { errorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware.js";
import e2eRouter from "./routers/e2eRouter.js";
import recommendationRouter from "./routers/recommendationRouter.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/recommendations", recommendationRouter);

if (process.env.NODE_ENV === 'test') {
    app.use(e2eRouter);
}

app.use(errorHandlerMiddleware);

export default app;
