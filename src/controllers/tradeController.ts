import symbolModel from "../models/symbolModel";
import userModel from "../models/userModel";
import telegramBot from "../services/bots/TelegramBot";
import Exchange from "../services/exchanges/Exchange";
import { TTrade, UserStore } from "../types";

export const onTrade = (data: TTrade, exchange: Exchange) => {
  const previousPrice = symbolModel.getPrice(exchange.name, data.symbol);
  symbolModel.savePrice(exchange.name, data.symbol, data.price);

  const userAlerts = userModel.getUsersAlertsBySymbol(data.symbol);

  userAlerts.forEach((userAlert: UserStore) => {
    const priceDirectionUp = previousPrice < data.price;
    //only one message per minute
    const finishedDebounce =
      (userAlert.lastAlert || 0) + 60 < Date.now() / 1000;
    if (!finishedDebounce) return;

    //send the message when the price crosses the alert price
    if (priceDirectionUp === true) {
      const isCrossingPriceUp =
        userAlert.price <= data.price && userAlert.price >= previousPrice;
      if (isCrossingPriceUp) {
        telegramBot.sendAlert(userAlert, exchange);
      }
    } else {
      const isCrossingPriceDown =
        userAlert.price >= data.price && userAlert.price <= previousPrice;
      if (isCrossingPriceDown) {
        telegramBot.sendAlert(userAlert, exchange);
      }
    }
  });
};
