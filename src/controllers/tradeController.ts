import { getUsersAlertsBySymbol, savePrice, getPrice } from "../store";
import { TradeType, UserStore } from "../types";
import telegramBot from "./telegramController";

export const onTrade = (data: TradeType, exchange: string) => {
  const previousPrice = getPrice(data.symbol);
  savePrice(data.symbol, data.price);

  const userAlerts = getUsersAlertsBySymbol(data.symbol);

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
