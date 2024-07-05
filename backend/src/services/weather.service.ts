import { flux, fluxDuration } from "@influxdata/influxdb-client";
import envConfig from "../config/envConfig";
import { queryApi } from "../config/influxConn";

const getAll = async () => {
  const start = fluxDuration("-1m");
  const measurement = "weather";
  const bucket = envConfig.INFLUX_BUCKET;
  const fluxQuery = flux`from(bucket: ${bucket}) 
      |> range(start: ${start}) 
      |> filter(fn: (r) => r._measurement == ${measurement})
      |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")`;

  return await queryApi.collectRows(fluxQuery);
};

export default {
  getAll,
};
