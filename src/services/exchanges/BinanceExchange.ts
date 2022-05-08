import { DefaultLogger, WebsocketClient, WsKey } from "bybit-api";
import { TExchange } from "../../types";
import Exchange from "./Exchange";

DefaultLogger.silly = () => {};

class BinanceExchange implements Exchange {
  name: TExchange = "binance";

  ws: WebsocketClient;
  wsKeySession: WsKey | undefined;

  currentPrices: { [key: string]: number } = {};

  constructor() {
    this.ws = new WebsocketClient({});
  }

  init = () => {
    // const currentSymbols = getCurrentSymbols();
    // const currentTopics = currentSymbols.map((s) => `trade.${s}`);
    // if (!currentSymbols.length) return;
    // this.ws.subscribe(["trade"]);
    // this.ws.on("open", ({ wsKey, event }) => {
    //   this.wsKeySession = wsKey;
    //   console.log("Bybit connection open for websocket with ID: " + wsKey);
    // });
    // this.ws.on(
    //   "update",
    //   ({ topic, data }: { topic: string; data: TradeType[] }) => {
    //     if (currentTopics.includes(topic)) {
    //       data.forEach((trade) => {
    //         this.currentPrices[trade.symbol] = trade.price;
    //         onTrade(trade, this);
    //       });
    //     }
    //   }
    // );
    // this.ws.on("error", (err) => {
    //   console.error("ERR", err);
    // });
  };

  restart = () => {
    // if (this.wsKeySession) {
    //   this.ws.close(this.wsKeySession);
    //   this.init();
    // }
  };
}

const binanceExchange = new BinanceExchange();
export default binanceExchange;
