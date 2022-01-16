export type SymbolType = string;

export type PriceType = number;

export type Direction = undefined | "up" | "down";

export type UserStore = {
  userId: number;
  chatId: number;
  symbol: SymbolType;
  price: PriceType;
  direction?: Direction;
  lastAlert?: number; //date in seconds
  remove?: boolean
};

export type PriceStore = { [key: SymbolType]: PriceType };

export type SideType = "Sell" | "Buy"

export type TradeType = {
    trade_time_ms: number,
    timestamp: string,
    symbol: SymbolType,
    side: SideType,
    size: number,
    price: number,
    tick_direction: string,
    trade_id: string,
    cross_seq: number
}

export type MessageKeyboardAnswer = {
    message_id: number
    date: number
    text: string | number
    from: MessageFrom
    chat: MessageChat
}

export type MessageFrom = {
    id: number
    is_bot: boolean
    first_name: string
    last_name: string
    username: string
    language_code: string
}

export type MessageChat = {
    id: number
    first_name: string
    last_name: string
    username: string
    type: string
}

export type BotCommand = {
    symbol: SymbolType
    price: PriceType
    direction: Direction
    remove?: boolean
}