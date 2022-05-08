export type TSymbol = string;

export type TPrice = number;

export type TDirection = undefined | "up" | "down" | "any";

export type TExchange = "bybit" | "binance";

export type UserStore = {
  userId: number;
  chatId: number;
  symbol: TSymbol;
  price: TPrice;
  direction?: TDirection;
  lastAlert?: number; //date in seconds
  remove?: boolean;
  exchange: TExchange;
};

export type PriceStore = { [key: TSymbol]: TPrice };

export type TSide = "Sell" | "Buy";

export type TTrade = {
  trade_time_ms: number;
  timestamp: string;
  symbol: TSymbol;
  side: TSide;
  size: number;
  price: number;
  tick_direction: string;
  trade_id: string;
  cross_seq: number;
};

export type TMessageKeyboardAnswer = {
  message_id: number;
  date: number;
  text: string | number;
  from: TMessageFrom;
  chat: TMessageChat;
};

export type TMessageFrom = {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name: string;
  username: string;
  language_code: string;
};

export type TMessageChat = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  type: string;
};

export type TBotCommand = {
  exchange: TExchange;
  symbol: TSymbol;
  price: TPrice;
  direction: TDirection;
  remove?: boolean;
};
