import symbolModel from "../models/symbolModel";
import userModel from "../models/userModel";
import bots from "../services/bots";
import Exchange from "../services/exchanges/Exchange";
import { TTrade, UserStore } from "../types";

export const onTrade = (trade: TTrade, exchange: Exchange) => {
  const previousPrice = symbolModel.getPrice(exchange.name, trade.symbol);
  symbolModel.savePrice(exchange.name, trade.symbol, trade.price);

  const userAlerts = userModel.getUsersAlertsBySymbol(trade.symbol);

  userAlerts.forEach((userAlert: UserStore) => {
    // const priceDirectionUp = previousPrice < trade.price;
    //only one message per minute
    const finishedDebounce =
      (userAlert.lastAlert || 0) + 60 < Date.now() / 1000;
    if (!finishedDebounce) return;

    const isCrossingPriceUp =
      userAlert.price <= trade.price && userAlert.price >= previousPrice;
    const isCrossingPriceDown =
      userAlert.price >= trade.price && userAlert.price <= previousPrice;

    if (isCrossingPriceDown || isCrossingPriceUp) {
      console.log("onTrade", { isCrossingPriceDown, isCrossingPriceUp });
      bots.telegram.sendAlert(userAlert, exchange.name);
    }

    //send the message when the price crosses the alert price
    // if (priceDirectionUp === true) {
    //   const isCrossingPriceUp =
    //     userAlert.price <= data.price && userAlert.price >= previousPrice;
    //   if (isCrossingPriceUp) {
    //     telegramBot.sendAlert(userAlert, exchange);
    //   }
    // } else {
    //   const isCrossingPriceDown =
    //     userAlert.price >= data.price && userAlert.price <= previousPrice;
    //   if (isCrossingPriceDown) {
    //     telegramBot.sendAlert(userAlert, exchange);
    //   }
    // }
  });
};
