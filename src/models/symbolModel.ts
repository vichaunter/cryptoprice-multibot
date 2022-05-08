import db from "../database/Database";
import { TExchange, TPrice, TSymbol } from "../types";

const savePrice = (
  exchange: TExchange,
  symbol: TSymbol,
  price: TPrice
): void => {
  db.savePrice(exchange, symbol, price);
};

const getPrice = (exchange: TExchange, symbol: TSymbol): TPrice => {
  return db.getPrice(exchange, symbol);
};

const symbolModel = {
  savePrice,
  getPrice,
};

export default symbolModel;
