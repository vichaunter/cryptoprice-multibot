// import { PriceStore, UserStore } from "./types";

// const userAlertsStore: Array<UserStore> = [];

// const prices: PriceStore = {};

// export const getCurrentSymbols = (): Array<string> => {
//   return [...new Set(userAlertsStore.map((us) => us.symbol))];
// };

// export const setOrUpdateUserAlert = ({
//   userId,
//   chatId,
//   symbol,
//   price,
//   direction,
//   remove,
//   exchange,
// }: UserStore) => {
//   if (!symbols.includes(symbol)) {
//     throw "Invalid symbol";
//   }
//   if (isNaN(price)) {
//     throw "Price must be number";
//   }
//   if (!["up", "down", undefined].includes(direction?.toLowerCase())) {
//     throw "Only 'up' and 'down' are valid directions";
//   }

//   const newUserAlert: UserStore = {
//     userId,
//     chatId,
//     symbol,
//     price,
//     direction: direction?.toLowerCase() as DirectionType,
//     remove,
//     exchange,
//   };
//   const userAlert = getUserAlert(userId, symbol, price);

//   if (userAlert) {
//     userAlert.symbol = newUserAlert.symbol;
//     userAlert.price = newUserAlert.price;
//     userAlert.direction = newUserAlert.direction;
//   } else {
//     userAlertsStore.push(newUserAlert);
//   }

//   exchangesList[exchange].restart();

//   // restartBybit();
// };

// export const removeAlert = (
//   userId: number,
//   symbol: string,
//   price: number
// ): boolean => {
//   for (var i = userAlertsStore.length - 1; i >= 0; --i) {
//     const alert = userAlertsStore[i];
//     if (
//       alert.userId === userId &&
//       alert.symbol === symbol &&
//       alert.price === price
//     ) {
//       userAlertsStore.splice(i, 1);
//       return true;
//     }
//   }

//   return false;
// };

// export const getUserAlert = (id: number, symbol: string, price: number) => {
//   return userAlertsStore.find(
//     (o) => o.userId === id && o.symbol === symbol && o.price === price
//   );
// };

// export const getUserAlertBySymbol = (
//   id: number,
//   symbol: string
// ): UserStore | undefined => {
//   return userAlertsStore.find((o) => o.userId === id && o.symbol === symbol);
// };

// export const getUserAlerts = (id: number) => {
//   return userAlertsStore.filter((o) => o.userId === id);
// };

// export const getUsersAlertsBySymbol = (symbol: string): Array<UserStore> => {
//   return userAlertsStore.filter((o) => o.symbol === symbol);
// };

// export const savePrice = (symbol: SymbolType, price: PriceType): void => {
//   prices[symbol] = price;
// };

// export const getPrice = (symbol: SymbolType): PriceType => {
//   return prices[symbol];
// };
