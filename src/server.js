import express from "express";
import pino from "pino-http";
import cors from "cors";
import { env } from "./utils/env.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";
import router from "./routers/index.js";
import { UPLOAD_DIR } from "./constants/index.js";

const PORT = Number(env("PORT", "3000"));

export const setupServer = () => {
    const app = express();

    app.use(
        pino({
            transport: {
                target: "pino-pretty",
            },
        }),
    );
    app.use(cookieParser());

    app.use(
        express.json({
            type: ["application/json", "application/vnd.api+json"],
            limit: "100kb",
        }),
    );
    app.use(cors());

    app.use("/uploads", express.static(UPLOAD_DIR));
    app.get("/", (req, res) => {
        res.json({
            message: "Hello world!",
        });
    });
    app.use(router);
    app.use("*", notFoundHandler);
    app.use(errorHandler);
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};



