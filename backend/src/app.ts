import express, { Application } from "express";
import { routes } from "./routes";
import { sequelize } from "./config/postgresConn";
import { mqttClient } from "./config/mqttConn";
import cors from "cors";
import envConfig from "./config/envConfig";
import { Point } from "@influxdata/influxdb-client";
import { writeApi } from "./config/influxConn";
// import { InfluxDB, FluxTableMetaData } from "@influxdata/influxdb-client";

const PORT = envConfig.PORT || 3000;
const app: Application = express();

app.use(express.json());
app.use(cors());
app.use("/api", routes);

const initPostgres = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Error initializing postgres connection:", error);
  }
};

const initMqtt = () => {
  mqttClient.on("error", (err) => {
    console.error("Error in mqtt client: ", err);
  });

  mqttClient.on("connect", () => {
    console.log("Backend successfully connected to mqtt broker.");
    console.log("Subscribing to wsa topic...");
    mqttClient.subscribe(envConfig.DATA_TOPIC!, (err) => {
      if (err) {
        console.error("Error subscribing to wsa topic:", err);
      }
    });
  });
};

const initInfluxWrites = () => {
  mqttClient.on("message", (topic, message) => {
    console.log("New message received.");
    console.log("Topic: ", topic);
    console.log("Content: ", message.toString());
    // do we really need this check ? maybe if there are more than one topics, but rn there's only one that is subscribed to
    if (topic === envConfig.DATA_TOPIC) {
      try {
        const weatherDataObj = JSON.parse(message.toString());
        console.log(weatherDataObj);
        if (!weatherDataObj.temperature || !weatherDataObj.humidity) {
          throw new Error("Received invalid weather data object.");
        }
        // hardcoded location tag for now, can later make dynamic based on data object when add mutliple locations
        const newPoint = new Point("weather")
          .tag("location", "Islamabad")
          .floatField("temperature", weatherDataObj.temperature)
          .floatField("humidity", weatherDataObj.humidity);
        writeApi.writePoint(newPoint);
        console.log(`Written a new point record: ${newPoint}`);
      } catch (err) {
        console.error("Error while processing received message:", err);
      }
    }
  });
};

const startServer = async () => {
  await initPostgres();
  initMqtt();
  initInfluxWrites();
  app.listen(PORT, () => {
    console.log("Server listening on port", PORT);
  });
};

startServer();

// const setupInflux = async () => {
//   console.log("*** ONBOARDING ***");
//   const setupApi = new SetupAPI(new InfluxDB({ url: envConfig.INFLUX_URL! }));
//   try {
//     const { allowed } = await setupApi.getSetup();
//     if (allowed) {
//       await setupApi.postSetup({
//         body: {
//           org: envConfig.INFLUX_ORG!,
//           bucket: envConfig.INFLUX_BUCKET!,
//           username: envConfig.INFLUX_ADMIN_USERNAME!,
//           password: envConfig.INFLUX_ADMIN_PASSWORD,
//           token: envConfig.INFLUX_TOKEN,
//         },
//       });
//       console.log(`InfluxDB '${envConfig.INFLUX_ORG!}' is now onboarded.`);
//     } else {
//       console.log(
//         `InfluxDB '${envConfig.INFLUX_ORG!}' has been already onboarded.`
//       );
//     }
//     console.log("\nFinished SUCCESS");
//   } catch (e) {
//     console.error(e);
//     console.log("\nFinished ERROR");
//   }
// };

// setupInflux();

// const testInfluxInterfacing = async () => {
//   await setupInflux();
// }

// testInfluxInterfacing();

// const timeout = 10 * 1000; // timeout for ping

// console.log("*** PING STATUS ***");
// const influxDB = new InfluxDB({ url: envConfig.INFLUX_URL!, timeout });
// const pingAPI = new PingAPI(influxDB);

// pingAPI
//   .getPing()
//   .then(() => {
//     console.log("\nPing SUCCESS");
//   })
//   .catch((error) => {
//     console.error(error);
//     console.log("\nFinished ERROR");
//   });

// const queryApi = new InfluxDB({
//   url: envConfig.INFLUX_URL!,
//   token: envConfig.INFLUX_TOKEN,
// }).getQueryApi(envConfig.INFLUX_ORG!);
// const fluxQuery =
//   'from(bucket:"wsa") |> range(start: -1d) |> filter(fn: (r) => r._measurement == "temperature")';

// // Execute query and receive table metadata and rows in a result observer.
// function queryRows() {
//   console.log("*** QueryRows ***");
//   queryApi.queryRows(fluxQuery, {
//     next: (row: string[], tableMeta: FluxTableMetaData) => {
//       // the following line creates an object for each row
//       const o = tableMeta.toObject(row);
//       // console.log(JSON.stringify(o, null, 2))
//       console.log(
//         `${o._time} ${o._measurement} in '${o.location}' (${o.example}): ${o._field}=${o._value}`
//       );

//       // alternatively, you can get only a specific column value without
//       // the need to create an object for every row
//       // console.log(tableMeta.get(row, '_time'))
//     },
//     error: (error: Error) => {
//       console.error(error);
//       console.log("\nQueryRows ERROR");
//     },
//     complete: () => {
//       console.log("\nQueryRows SUCCESS");
//     },
//   });
// }
// queryRows();
