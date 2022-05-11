import fs from "fs";
import _ from "lodash";
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

type TUserAlertStore = {
  [key: string]: Array<UserStore>;
};

type TCurrentSymbols = {
  [key in TExchange]: TSymbol[];
};

let userAlertsStore: TUserAlertStore = {};
let prices: PriceStore = {};
let currentSymbols: TCurrentSymbols;

const dumpToFiles = () => {
  fs.writeFileSync(
    "./db_data/userAlerts.json",
    JSON.stringify(userAlertsStore, null, 4)
  );
  fs.writeFileSync("./db_data/prices.json", JSON.stringify(prices, null, 4));
};

const loadFromFiles = async () => {
  const alertsData = fs.readFileSync("./db_data/userAlerts.json");
  if (alertsData) {
    userAlertsStore = JSON.parse(alertsData.toString());
  }
  const pricesData = fs.readFileSync("./db_data/prices.json");
  if (pricesData) {
    prices = JSON.parse(pricesData.toString());
  }
};

class MemoryDatabase implements IDatabase {
  constructor() {
    loadFromFiles();
    console.log("inMemory database initialized");
  }

  getUserAlert(
    id: number,
    symbol: string,
    price: number
  ): UserStore | undefined {
    return userAlertsStore[id]?.find(
      (o) => o.userId === id && o.symbol === symbol && o.price === price
    );
  }

  getUserAlertsBySymbol = (
    id: number,
    symbol: string
  ): UserStore | undefined => {
    return userAlertsStore[id]?.find(
      (o) => o.userId === id && o.symbol === symbol
    );
  };

  getUserAlerts = (id: number) => {
    return userAlertsStore[id] || [];
  };

  getUsersAlertsBySymbol = (symbol: string): Array<UserStore> => {
    const symbols: Set<UserStore> = new Set();
    _.flatMap(userAlertsStore).find((item) => item.symbol === symbol);

    return Array.from(symbols);
  };

  getUserAlertBySymbol(id: number, symbol: string): UserStore | undefined {
    return userAlertsStore[id]?.find(
      (o) => o.userId === id && o.symbol === symbol
    );
  }

  savePrice = (exchange: TExchange, symbol: TSymbol, price: TPrice): void => {
    prices[`${exchange}${symbol}`] = price;

    dumpToFiles();
  };

  getPrice = (exchange: TExchange, symbol: TSymbol): TPrice => {
    return prices[`${exchange}${symbol}`];
  };

  saveSymbol = (exchange: TExchange, symbol: TSymbol): void => {
    if (!currentSymbols[exchange]) {
      currentSymbols[exchange] = [symbol];
    } else {
      currentSymbols[exchange].push(symbol);
    }
    dumpToFiles();
  };

  removeSymbol = (exchange: TExchange, symbol: TSymbol): void => {
    if (currentSymbols[exchange]) {
      const cleanList = new Set(currentSymbols[exchange]);
      cleanList.delete(symbol);
      currentSymbols[exchange] = Array.from(cleanList);
      dumpToFiles();
    }
  };

  removeAlert = (
    userId: number,
    exchange: TExchange,
    symbol: TSymbol,
    price: number
  ): boolean => {
    for (var i = userAlertsStore[userId].length - 1; i >= 0; --i) {
      const alert = userAlertsStore[userId][i];
      if (
        alert.userId === userId &&
        alert.exchange === exchange &&
        alert.symbol === symbol &&
        alert.price === price
      ) {
        userAlertsStore[userId].splice(i, 1);
        //TODO: maybe delete symbol from storage if is last one
        dumpToFiles();
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
      userAlertsStore[userId].push(newUserAlert);
    }

    exchangesList[exchange].restart();
    this.saveSymbol(exchange, symbol);

    dumpToFiles();
    // restartBybit();
  };

  getCurrentSymbols = (exchange: TExchange): Array<string> => {
    return currentSymbols[exchange];
  };
}

export default MemoryDatabase;
