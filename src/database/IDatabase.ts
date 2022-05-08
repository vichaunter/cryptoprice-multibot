import { TExchange, TPrice, TSymbol, UserStore } from "../types";

export default interface IDatabase {
  /** USER */
  getUserAlert(
    id: number,
    symbol: string,
    price: number
  ): UserStore | undefined;
  getUserAlertBySymbol(id: number, symbol: string): UserStore | undefined;
  getUserAlerts(id: number): Array<UserStore>;
  getUsersAlertsBySymbol(symbol: string): Array<UserStore>;
  setOrUpdateUserAlert(userAlert: UserStore): void;
  /** PRICES */
  savePrice(exchange: TExchange, symbol: TSymbol, price: TPrice): void;
  getPrice(exchange: TExchange, symbol: TSymbol): TPrice;
  /** ALERTS */
  removeAlert(
    userId: number,
    exchange: TExchange,
    symbol: TSymbol,
    price: number
  ): boolean;
  /** SYMBOLS */
  getCurrentSymbols(exchange: TExchange): Array<string>;
}
