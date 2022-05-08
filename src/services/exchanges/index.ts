import { TExchange } from "../../types";
import binanceExchange from "./BinanceExchange";
import bybitExchange from "./BybitExchange";
import Exchange from "./Exchange";

export const exchangesList: { [key in TExchange]: Exchange } = {
  bybit: bybitExchange,
  binance: binanceExchange,
};

const init = () => {
  Object.values(exchangesList).forEach((exchange) => {
    exchange.init();
  });
};

const restart = () => {
  Object.values(exchangesList).forEach((exchange) => {
    exchange.restart();
  });
};

export default {
  init,
  restart,
};
