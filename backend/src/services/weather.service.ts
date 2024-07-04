import { InfluxDB, flux, fluxDuration } from "@influxdata/influxdb-client";
import envConfig from "../config/envConfig";
import { queryApi } from "../config/influxConn";

export class WeatherService {
  static getAll = async () => {
    const start = fluxDuration("-2h");
    const measurement = "weather";
    const bucket = envConfig.INFLUX_BUCKET;
    const fluxQuery = flux`from(bucket: ${bucket}) 
      |> range(start: ${start}) 
      |> filter(fn: (r) => r._measurement == ${measurement})`;

    return await queryApi.collectRows(fluxQuery);
  };
}
