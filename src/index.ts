import dotenv from "dotenv";
import path from "path";
import bots from "./services/bots";
import exchanges from "./services/exchanges";

if (process.env.ENVIRONMENT !== "production") {
  dotenv.config({ path: path.resolve(__dirname, "../.env") });
}
//db default inMemory so not need to initialize

//bots
bots.telegram.init(process.env.TELEGRAM_TOKEN || "");

//exchanges
exchanges.init();
