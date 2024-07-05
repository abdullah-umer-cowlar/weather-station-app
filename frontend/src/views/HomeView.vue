<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import mqtt, { MqttClient } from "mqtt";
import envConfig from "../lib/envConfig";
import { getWeatherHistory } from "../services/weather.service";
import { formatWeatherData } from "../lib/utils";

const charts = ref<any>(null);
let mqttClient: MqttClient | null = null;

const weatherData = ref<any[]>([]);

setInterval(() => {
  chartOptions.series[0].data.push({
    x: new Date().getTime() + 5 * 1000,
    y: Math.random(),
  });

  charts.value?.chart?.update(
    {
      series: chartOptions.series,
    },
    true,
    true,
  );
}, 2000);

const fetchWeatherHistory = async () => {
  try {
    const res = await getWeatherHistory();
    console.log(formatWeatherData(res.data));
    weatherData.value.push(res.data);
    weatherData.value = res.data;
    // weatherData.value = res.data.data.
    // setFeaturedMovies(res.data.movies);
    // setIsLoading((prevState) => ({
    //   ...prevState,
    //   featuredMovies: false
    // }));
  } catch (error) {
    console.error(error);
    // toast({
    //   variant: "destructive",
    //   title: "An error occured",
    //   description: "There was a problem fetching featured movies."
    // });
  }
};

const chartOptions = {
  chart: {
    type: "spline",
  },
  time: {
    useUTC: false,
  },
  title: {
    text: "Live Weather Data",
  },
  xAxis: {
    type: "datetime",
    tickPixelInterval: 150,
    maxPadding: 0.1,
  },
  yAxis: {
    title: {
      text: "Value",
    },
    plotLines: [
      {
        value: 0,
        width: 1,
        color: "#808080",
      },
    ],
  },
  tooltip: {
    headerFormat: "<b>{series.name}</b><br/>",
    pointFormat: "{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}",
  },
  legend: {
    enabled: false,
  },
  exporting: {
    enabled: false,
  },
  series: [
    {
      name: "Random data",
      lineWidth: 2,
      color: "#00E272",
      data: (() => {
        const arr = [];
        const time = new Date().getTime();

        for (let i = -19; i <= 0; i += 1) {
          arr.push({
            x: time + i * 1000,
            y: Math.random(),
          });
        }
        return arr;
      })(),
    },
  ],
};

const setupMqttConn = () => {
  mqttClient = mqtt.connect(`ws://${envConfig.BROKER_HOST}:${envConfig.BROKER_PORT}/mqtt`);

  mqttClient.on("error", err => {
    console.error("Error in mqtt client: ", err);
  });

  mqttClient.on("connect", () => {
    console.log("Client successfully connected to mqtt broker.");
    console.log("Subscribing to weather data topic...");
    mqttClient?.subscribe(envConfig.DATA_TOPIC, err => {
      if (err) {
        console.error("Error subscribing to weather data topic:", err);
      }
    });
  });

  // when trying to append it ahead of fetched weather historty data, will need to make sure the values are lining up
  // also, what to do if req from db fails ?
  // this needs to be QoS 2
  mqttClient.on("message", (topic, message) => {
    // console.log("New message received.");
    // do we really need this check ? maybe if there are more than one topics, but rn there's only one that is subscribed to
    if (topic === envConfig.DATA_TOPIC) {
      try {
        const weatherDataObj = JSON.parse(message.toString());
        // console.log(weatherDataObj);
        if (
          !weatherDataObj.weather_data ||
          !weatherDataObj.weather_data.temperature ||
          !weatherDataObj.weather_data.humidity
        ) {
          throw new Error("Received invalid weather data object.");
        }
        // weatherData.push(weatherDataObj);
      } catch (err) {
        console.error("Error while processing received message:", err);
      }
    }
  });
};

onMounted(() => {
  setupMqttConn();
  fetchWeatherHistory();
});

onBeforeUnmount(() => {
  if (mqttClient) {
    mqttClient.end();
  }
});
</script>

<template>
  <div class="w-full h-full flex flex-row justify-center items-center text-center">
    <highcharts :options="chartOptions" ref="charts"></highcharts>
  </div>
</template>
