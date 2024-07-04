import { Request, Response } from "express";
import { WeatherService } from "../services/weather.service";

export class WeatherController {
  // to-do: get location from req later on when added multiple locations
  static getHistory = async (req: Request, res: Response) => {
    try {
      const data = await WeatherService.getAll();
      console.log(data);
      return res.status(200).json(data);
      //   if (user) {
      //     return res.status(200).json({
      //       error: false,
      //       message: "User found successfully",
      //       data: user,
      //     });
      //   } else {
      //     return res.status(400).json({
      //       error: true,
      //       message: "No data found",
      //     });
      //   }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: true,
        message: "Internal server error",
      });
    }
  };
}
