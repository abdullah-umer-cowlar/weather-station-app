import dotenv from "dotenv";
dotenv.config();

const envConfig = {
  POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,
  POSTGRES_USERNAME: process.env.POSTGRES_USERNAME,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_HOST: process.env.POSTGRES_HOST,
  POSTGRES_PORT: process.env.POSTGRES_PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  PORT: process.env.PORT,
  BROKER_HOST: process.env.BROKER_HOST,
  BROKER_PORT: process.env.BROKER_PORT,
  DATA_TOPIC: process.env.DATA_TOPIC,
  INFLUX_URL: process.env.INFLUX_URL,
  INFLUX_TOKEN: process.env.INFLUX_TOKEN,
  INFLUX_ORG: process.env.INFLUX_ORG,
  INFLUX_BUCKET: process.env.INFLUX_BUCKET,
  INFLUX_ADMIN_USERNAME: process.env.INFLUX_ADMIN_USERNAME,
  INFLUX_ADMIN_PASSWORD: process.env.INFLUX_ADMIN_PASSWORD,
};

export default envConfig;
