import symbols from "../helpers/symbols";
import { exchangesList } from "../services/exchanges";
import {
  PriceStore,
  TDirection,
  TExchange,
  TPrice,
  TSymbol,
  UserStore,
} from "../types";
import IDatabase from "./IDatabase";

const userAlertsStore: Array<UserStore> = [];
const prices: PriceStore = {};

class MemoryDatabase implements IDatabase {
  getUserAlert(
    id: number,
    symbol: string,
    price: number
  ): UserStore | undefined {
    return userAlertsStore.find(
      (o) => o.userId === id && o.symbol === symbol && o.price === price
    );
  }

  getUserAlertsBySymbol = (
    id: number,
    symbol: string
  ): UserStore | undefined => {
    return userAlertsStore.find((o) => o.userId === id && o.symbol === symbol);
  };

  getUserAlerts = (id: number) => {
    return userAlertsStore.filter((o) => o.userId === id);
  };

  getUsersAlertsBySymbol = (symbol: string): Array<UserStore> => {
    return userAlertsStore.filter((o) => o.symbol === symbol);
  };

  getUserAlertBySymbol(id: number, symbol: string): UserStore | undefined {
    return userAlertsStore.find((o) => o.userId === id && o.symbol === symbol);
  }

  savePrice = (exchange: TExchange, symbol: TSymbol, price: TPrice): void => {
    prices[`${exchange}${symbol}`] = price;
  };

  getPrice = (exchange: TExchange, symbol: TSymbol): TPrice => {
    return prices[`${exchange}${symbol}`];
  };

  removeAlert = (
    userId: number,
    exchange: TExchange,
    symbol: TSymbol,
    price: number
  ): boolean => {
    for (var i = userAlertsStore.length - 1; i >= 0; --i) {
      const alert = userAlertsStore[i];
      if (
        alert.userId === userId &&
        alert.exchange === exchange &&
        alert.symbol === symbol &&
        alert.price === price
      ) {
        userAlertsStore.splice(i, 1);
        return true;
      }
    }

    return false;
  };

  setOrUpdateUserAlert = ({
    userId,
    chatId,
    symbol,
    price,
    direction,
    remove,
    exchange,
  }: UserStore) => {
    if (!symbols.includes(symbol)) {
      throw "Invalid symbol";
    }
    if (isNaN(price)) {
      throw "Price must be number";
    }
    if (!["up", "down", undefined].includes(direction?.toLowerCase())) {
      throw "Only 'up' and 'down' are valid directions";
    }

    const newUserAlert: UserStore = {
      userId,
      chatId,
      symbol,
      price,
      direction: direction?.toLowerCase() as TDirection,
      remove,
      exchange,
    };
    const userAlert = this.getUserAlert(userId, symbol, price);

    if (userAlert) {
      userAlert.symbol = newUserAlert.symbol;
      userAlert.price = newUserAlert.price;
      userAlert.direction = newUserAlert.direction;
    } else {
      userAlertsStore.push(newUserAlert);
    }

    exchangesList[exchange].restart();

    // restartBybit();
  };
  getCurrentSymbols = (exchange: TExchange): Array<string> => {
    return [
      ...new Set(
        userAlertsStore
          .filter((us) => us.exchange === exchange)
          .map((us) => us.symbol)
      ),
    ];
  };
}

export default MemoryDatabase;
