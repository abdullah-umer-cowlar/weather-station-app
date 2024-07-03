import dotenv from "dotenv";
dotenv.config();

const envConfig = {
  BROKER_HOST: process.env.BROKER_HOST,
  BROKER_PORT: process.env.BROKER_PORT,
  TOPIC_NAME: process.env.TOPIC_NAME,
};

export default envConfig;
