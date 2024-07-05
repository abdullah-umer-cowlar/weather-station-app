import { Request, Response } from "express";
import WeatherService from "../services/weather.service";

// to-do: get location from req later on when added multiple locations
const getHistory = async (req: Request, res: Response) => {
  try {
    const data = await WeatherService.getAll();
    return res.status(200).json({
      error: false,
      message: "Weather data history fetched successfully",
      data: data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

export default {
  getHistory,
};
