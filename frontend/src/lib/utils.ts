import { AuthInfo, ChartPoint, RawDataPoint } from "./types";

export const setSession = (authInfo: AuthInfo) => {
  localStorage.setItem("user", JSON.stringify(authInfo.user));
  localStorage.setItem("jwtToken", JSON.stringify(authInfo.token));
};

export const removeSession = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("jwtToken");
};

export const formatWeatherData = (data: RawDataPoint[]) => {
  const result: {
    temperatureDataPoints: ChartPoint[];
    humidityDataPoints: ChartPoint[];
  } = {
    temperatureDataPoints: [],
    humidityDataPoints: [],
  };

  data.forEach((rawDataPoint: RawDataPoint) => {
    result.temperatureDataPoints.push({
      x: rawDataPoint._time,
      y: rawDataPoint.temperature,
    });
    result.humidityDataPoints.push({
      x: rawDataPoint._time,
      y: rawDataPoint.humidity,
    });
  });

  return result;
};
