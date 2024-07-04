import express, { Router } from "express";
import { WeatherController } from "../controllers/weather.controller";
import { verify } from "../middleware/verify";

const router: Router = express.Router();

router.route("/history").get(verify, WeatherController.getHistory);

export { router as weatherRouter };
