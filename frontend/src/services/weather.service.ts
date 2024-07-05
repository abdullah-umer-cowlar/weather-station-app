import { GET } from "../lib/methods";

export const getWeatherHistory = async () => {
  return await GET({
    url: "/api/weather/history",
  });
};
