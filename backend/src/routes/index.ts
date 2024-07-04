import express from "express";
import { authRouter } from "./auth.route";
import { weatherRouter } from "./weather.route";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/weather", weatherRouter);

export { router as routes };
