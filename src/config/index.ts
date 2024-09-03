import dotenv from "dotenv";

dotenv.config();

export default {
  WEATHER_API_KEY: process.env.WEATHER_API_KEY,
  NEWS_API_KEY: process.env.NEWS_API_KEY,
};
