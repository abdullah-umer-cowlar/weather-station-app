import envConfig from "./envConfig";
import { InfluxDB } from "@influxdata/influxdb-client";

export const writeApi = new InfluxDB({
  url: envConfig.INFLUX_URL!,
  token: envConfig.INFLUX_TOKEN,
}).getWriteApi(envConfig.INFLUX_ORG!, envConfig.INFLUX_BUCKET!, "ns");

export const queryApi = new InfluxDB({
  url: envConfig.INFLUX_URL!,
  token: envConfig.INFLUX_TOKEN,
}).getQueryApi(envConfig.INFLUX_ORG!);
