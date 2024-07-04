const envConfig = {
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
  BASE_URL: import.meta.env.VITE_BASE_URL,
  BROKER_HOST: import.meta.env.VITE_BROKER_HOST,
  BROKER_PORT: import.meta.env.VITE_BROKER_PORT,
  DATA_TOPIC: import.meta.env.VITE_DATA_TOPIC,
};

export default envConfig;
