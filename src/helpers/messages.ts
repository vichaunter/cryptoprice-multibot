import { exchangesList } from "../services/exchanges";
import { TBotCommand, TDirection, TExchange } from "../types";

export const parseCommand = (str: string): TBotCommand => {
  const args = str.replace(/\s+/g, " ").split(" ");
  if (args[0].startsWith("/")) {
    args.shift();
  }

  const exchange =
    Object.keys(exchangesList).find((e) => e.toLowerCase() === args[0]) ||
    "binance";

  return {
    exchange: exchange as TExchange,
    symbol: args[1],
    price: Number(args[2]),
    direction: args[3] as TDirection,
    remove: !!args[4],
  };
};
