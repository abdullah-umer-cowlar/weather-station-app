<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import mqtt, { MqttClient } from "mqtt";
import envConfig from "../lib/envConfig";

const weatherData = ref<any[]>([]);
let mqttClient: MqttClient | null = null;

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
        // weatherData.push(weatherDataObj);
      } catch (err) {
        console.error("Error while processing received message:", err);
      }
    }
  });
};

onMounted(() => {
  setupMqttConn();
});

onBeforeUnmount(() => {
  if (mqttClient) {
    mqttClient.end();
  }
});
</script>

<template>
  <div class="w-full h-full flex flex-row justify-center items-center text-center"> THIS IS THE HOME PAGE </div>
</template>
