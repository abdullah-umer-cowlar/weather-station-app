<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import mqtt, { MqttClient } from "mqtt";
import envConfig from "../lib/envConfig";
import { getWeatherHistory } from "../services/weather.service";
import { formatWeatherData } from "../lib/utils";
import { ChartPoint } from "../lib/types";

const charts = ref<any>(null);
const weatherData = ref<{
  temperatureDataPoints: ChartPoint[];
  humidityDataPoints: ChartPoint[];
}>();
const weatherHistoryIsLoading = ref<boolean>(true);
let mqttClient: MqttClient | null = null;

watch(weatherData, updatedWeatherData => {
  if (updatedWeatherData?.temperatureDataPoints && updatedWeatherData?.humidityDataPoints) {
    // chartOptions.series[0].data = updatedWeatherData?.temperatureDataPoints;
    // chartOptions.series[1].data = updatedWeatherData?.humidityDataPoints;
    charts.value?.chart?.series[0].setData(updatedWeatherData?.temperatureDataPoints);
    charts.value?.chart?.series[1].setData(updatedWeatherData?.humidityDataPoints);
    if (weatherHistoryIsLoading.value) {
      weatherHistoryIsLoading.value = false;
    }
  }
});

const chartOptions: Highcharts.Options = {
  chart: {
    type: "spline",
    backgroundColor: "#18181a",
    borderColor: "#FFFFFF",
  },
  time: {
    useUTC: false,
  },
  title: {
    text: "Live Weather Data",
    style: {
      color: "#FFFFFF",
    },
  },
  xAxis: {
    type: "datetime",
    tickPixelInterval: 150,
    maxPadding: 0.1,
    labels: {
      style: {
        color: "#FFFFFF",
      },
    },
  },
  yAxis: {
    title: {
      text: "Value",
    },
    labels: {
      style: {
        color: "#FFFFFF",
      },
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
    enabled: true,
    backgroundColor: "#242426",
    itemStyle: {
      color: "#FFFFFF",
    },
  },
  exporting: {
    enabled: false,
  },
  series: [
    {
      type: "spline",
      name: "Temperature",
      lineWidth: 2,
      color: "#00E272",
      data: [] as ChartPoint[],
    },
    {
      type: "spline",
      name: "Humidity",
      lineWidth: 2,
      color: "#FF4191",
      data: [] as ChartPoint[],
    },
  ],
};

const fetchWeatherHistory = async () => {
  try {
    const res = await getWeatherHistory();
    console.log(formatWeatherData(res.data));
    weatherData.value = formatWeatherData(res.data);
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
    console.log("New message received.");
    // do we really need this check ? maybe if there are more than one topics, but rn there's only one that is subscribed to
    if (topic === envConfig.DATA_TOPIC) {
      try {
        const weatherDataObj = JSON.parse(message.toString());
        console.log(weatherDataObj);

        if (
          !weatherDataObj.weather_data ||
          !weatherDataObj.weather_data.temperature ||
          !weatherDataObj.weather_data.humidity
        ) {
          throw new Error("Received invalid weather data object.");
        }

        if (!weatherHistoryIsLoading.value) {
          const currentTimestamp = Date.now();

          charts.value?.chart?.series[0].addPoint({
            x: currentTimestamp,
            y: Number(weatherDataObj.weather_data.temperature),
          });
          charts.value?.chart?.series[1].addPoint({
            x: currentTimestamp,
            y: Number(weatherDataObj.weather_data.humidity),
          });

          // chartOptions.series[0].data.push({
          //   x: currentTimestamp,
          //   y: weatherDataObj.weather_data.temperature,
          // });
          // chartOptions.series[1].data.push({
          //   x: currentTimestamp,
          //   y: weatherDataObj.weather_data.humidity,
          // });
          // charts.value?.chart?.update(
          //   {
          //     series: chartOptions.series,
          //   },
          //   true,
          //   true,
          // );
        }
      } catch (err) {
        console.error("Error while processing received message:", err);
      }
    }
  });
};
Date.now();
onMounted(() => {
  // maybe don't connect at all until historical data fetched
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
    <!-- cover with a loader until data fetched and set from api -->
    <highcharts :options="chartOptions" ref="charts"></highcharts>
  </div>
</template>
