import express, { Application } from "express";
import { routes } from "./routes";
import { sequelize } from "./config/db";
import cors from "cors";
import envConfig from "./config/envConfig";
import mqtt from "mqtt";
import { InfluxDB, FluxTableMetaData } from "@influxdata/influxdb-client";

// import { InfluxDB } from "@influxdata/influxdb-client";

// import { PingAPI } from "@influxdata/influxdb-client-apis";

// import { InfluxDB, Point, HttpError } from "@influxdata/influxdb-client";
// import { hostname } from "node:os";

// import { InfluxDB } from "@influxdata/influxdb-client";
// import { SetupAPI } from "@influxdata/influxdb-client-apis";

const PORT = envConfig.PORT || 3000;
const app: Application = express();

app.use(express.json());
app.use(cors());
app.use("/api", routes);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
    app.listen(PORT, () => {
      console.log("Server listening on port", PORT);
    });
  } catch (error) {
    console.error("Error initializing server:", error);
  }
};

startServer();

const mqttClient = mqtt.connect(
  `mqtt://${envConfig.BROKER_HOST}:${envConfig.BROKER_PORT}`
);

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

// console.log("*** WRITE POINTS ***");
// // create a write API, expecting point timestamps in nanoseconds (can be also 's', 'ms', 'us')
// const writeApi = new InfluxDB({
//   url: envConfig.INFLUX_URL!,
//   token: envConfig.INFLUX_TOKEN,
// }).getWriteApi(envConfig.INFLUX_ORG!, envConfig.INFLUX_BUCKET!, "ns");
// // setup default tags for all writes through this API
// writeApi.useDefaultTags({ location: hostname() });

// // write point with the current (client-side) timestamp
// const point1 = new Point("temperature")
//   .tag("example", "write.ts")
//   .floatField("value", 20 + Math.round(100 * Math.random()) / 10);
// writeApi.writePoint(point1);
// console.log(` ${point1}`);
// // write point with a custom timestamp
// const point2 = new Point("temperature")
//   .tag("example", "write.ts")
//   .floatField("value", 10 + Math.round(100 * Math.random()) / 10)
//   .timestamp(new Date()); // can be also a number, but in writeApi's precision units (s, ms, us, ns)!
// writeApi.writePoint(point2);
// console.log(` ${point2.toLineProtocol(writeApi)}`);

// const closeWriteAPI = async () => {
//   try {
//     await writeApi.close();
//     console.log("FINISHED ... now try ./query.ts");
//   } catch (e) {
//     console.error(e);
//     if (e instanceof HttpError && e.statusCode === 401) {
//       console.log("Run ./onboarding.js to setup a new InfluxDB database.");
//     }
//     console.log("\nFinished ERROR");
//   }
// };

// closeWriteAPI();

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

const queryApi = new InfluxDB({
  url: envConfig.INFLUX_URL!,
  token: envConfig.INFLUX_TOKEN,
}).getQueryApi(envConfig.INFLUX_ORG!);
const fluxQuery =
  'from(bucket:"wsa") |> range(start: -1d) |> filter(fn: (r) => r._measurement == "temperature")';

// There are more ways of how to receive results,
// the essential ones are shown in functions below.
// Execution of a particular function follows
// its definition, comment/uncomment it at will.
// See also rxjs-query.ts and queryWithParams.mjs .

// Execute query and receive table metadata and table row values using async iterator.
async function iterateRows() {
  console.log("*** IterateRows ***");
  for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
    // the following line creates an object for each row
    const o = tableMeta.toObject(values);
    // console.log(JSON.stringify(o, null, 2))
    console.log(
      `${o._time} ${o._measurement} in '${o.location}' (${o.example}): ${o._field}=${o._value}`
    );

    // alternatively, you can get only a specific column value without
    // the need to create an object for every row
    // console.log(tableMeta.get(row, '_time'))
  }
  console.log("\nIterateRows SUCCESS");
}
// iterateRows().catch((error) => console.error('IterateRows ERROR', error))

// Execute query and receive table metadata and rows in a result observer.
function queryRows() {
  console.log("*** QueryRows ***");
  queryApi.queryRows(fluxQuery, {
    next: (row: string[], tableMeta: FluxTableMetaData) => {
      // the following line creates an object for each row
      const o = tableMeta.toObject(row);
      // console.log(JSON.stringify(o, null, 2))
      console.log(
        `${o._time} ${o._measurement} in '${o.location}' (${o.example}): ${o._field}=${o._value}`
      );

      // alternatively, you can get only a specific column value without
      // the need to create an object for every row
      // console.log(tableMeta.get(row, '_time'))
    },
    error: (error: Error) => {
      console.error(error);
      console.log("\nQueryRows ERROR");
    },
    complete: () => {
      console.log("\nQueryRows SUCCESS");
    },
  });
}
queryRows();

// Execute query and collect result rows in a Promise.
// Use with caution, it copies the whole stream of results into memory.
async function collectRows() {
  console.log("\n*** CollectRows ***");
  const data = await queryApi.collectRows(
    fluxQuery //, you can also specify a row mapper as a second argument
  );
  data.forEach((x) => console.log(JSON.stringify(x)));
  console.log("\nCollect ROWS SUCCESS");
}
// collectRows().catch((error) => console.error('CollectRows ERROR', error))

// Execute query and return the whole result as a string.
// Use with caution, it copies the whole stream of results into memory.
async function queryRaw() {
  const result = await queryApi.queryRaw(fluxQuery);
  console.log(result);
  console.log("\nQueryRaw SUCCESS");
}
// queryRaw().catch((error) => console.error('QueryRaw ERROR', error))

// Execute query and receive result CSV lines in an observer
function queryLines() {
  queryApi.queryLines(fluxQuery, {
    next: (line: string) => {
      console.log(line);
    },
    error: (error: Error) => {
      console.error(error);
      console.log("\nQueryLines ERROR");
    },
    complete: () => {
      console.log("\nQueryLines SUCCESS");
    },
  });
}
// queryLines()

// Execute query and receive result csv lines using async iterable
async function iterateLines() {
  for await (const line of queryApi.iterateLines(fluxQuery)) {
    console.log(line);
  }
  console.log("\nIterateLines SUCCESS");
}
// iterateLines().catch((error) => console.error('\nIterateLines ERROR', error))
