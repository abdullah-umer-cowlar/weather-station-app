jest.mock("../src/services/weather.service");

describe("WeatherTests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getHistory", () => {
    it("should return 200 and weather data when fetched successfully", async () => {
      // Mock WeatherService.getAll to return dummy data
      const dummyWeatherData = [
        { id: 1, location: "New York", temperature: 20 },
        { id: 2, location: "London", temperature: 18 },
      ];
      (WeatherService.getAll as jest.Mock).mockResolvedValue(dummyWeatherData);

      await WeatherController.getHistory(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        error: false,
        message: "Weather data history fetched successfully",
        data: dummyWeatherData,
      });
    });

    it("should return 500 if an error occurs during data fetching", async () => {
      // Mock WeatherService.getAll to throw an error
      const errorMessage = "Database connection failed";
      (WeatherService.getAll as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await WeatherController.getHistory(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: true,
        message: "Internal server error",
      });
    });
  });
});
import { Request, Response } from "express";
import { WeatherController } from "../src/controllers/weather.controller";
import { WeatherService } from "../src/services/weather.service";

jest.mock("../src/services/weather.service");

describe("WeatherController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getHistory", () => {
    it("should return 200 and weather data when fetched successfully", async () => {
      // Mock WeatherService.getAll to return dummy data
      const dummyWeatherData = [
        { id: 1, location: "New York", temperature: 20 },
        { id: 2, location: "London", temperature: 18 },
      ];
      (WeatherService.getAll as jest.Mock).mockResolvedValue(dummyWeatherData);

      await WeatherController.getHistory(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        error: false,
        message: "Weather data history fetched successfully",
        data: dummyWeatherData,
      });
    });

    it("should return 500 if an error occurs during data fetching", async () => {
      // Mock WeatherService.getAll to throw an error
      const errorMessage = "Database connection failed";
      (WeatherService.getAll as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await WeatherController.getHistory(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: true,
        message: "Internal server error",
      });
    });
  });
});
