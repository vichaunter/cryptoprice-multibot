import db from "../database/Database";
import { TExchange, TSymbol, UserStore } from "../types";

const getUserAlert = (id: number, symbol: string, price: number) => {
  return db.getUserAlert(id, symbol, price);
};

const getUserAlertBySymbol = (
  id: number,
  symbol: string
): UserStore | undefined => {
  return db.getUserAlertBySymbol(id, symbol);
};

const getUserAlerts = (id: number) => {
  return db.getUserAlerts(id);
};

const getUsersAlertsBySymbol = (symbol: string): Array<UserStore> => {
  return db.getUsersAlertsBySymbol(symbol);
};

const saveAlert = ({
  userId,
  chatId,
  symbol,
  price,
  direction,
  remove,
  exchange,
}: UserStore) => {
  db.setOrUpdateUserAlert({
    userId,
    chatId,
    symbol,
    price,
    direction,
    remove,
    exchange,
  });
};

const removeAlert = (
  userId: number,
  exchange: TExchange,
  symbol: TSymbol,
  price: number
): boolean => {
  return db.removeAlert(userId, exchange, symbol, price);
};

const userModel = {
  getUserAlert,
  getUserAlertBySymbol,
  getUserAlerts,
  getUsersAlertsBySymbol,
  saveAlert,
  removeAlert,
};

export default userModel;
