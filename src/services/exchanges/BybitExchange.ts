import { DefaultLogger, WebsocketClient, WsKey } from "bybit-api";
import { onTrade } from "../../controllers/tradeController";
import db from "../../database/Database";
import { TExchange, TTrade } from "../../types";
import Exchange from "./Exchange";

DefaultLogger.silly = () => {};

class BybitExchange implements Exchange {
  name: TExchange = "bybit";

  ws: WebsocketClient;
  wsKeySession: WsKey | undefined;

  currentPrices: { [key: string]: number } = {};

  constructor() {
    this.ws = new WebsocketClient({ livenet: true });
  }

  init = () => {
    const currentSymbols = db.getCurrentSymbols(this.name);
    console.log("starting bybit", currentSymbols);
    const currentTopics = currentSymbols.map((s) => `trade.${s}`);
    if (!currentSymbols.length) return;

    this.ws.subscribe(["trade"]);

    this.ws.on("open", ({ wsKey, event }) => {
      this.wsKeySession = wsKey;
      console.log("Bybit connection open for websocket with ID: " + wsKey);
    });

    this.ws.on(
      "update",
      ({ topic, data }: { topic: string; data: TTrade[] }) => {
        if (currentTopics.includes(topic)) {
          data.forEach((trade) => {
            const actualPrice = this.currentPrices[trade.symbol];
            if (actualPrice !== trade.price) {
              this.currentPrices[trade.symbol] = trade.price;
              onTrade(trade, this);
            }
          });
        }
      }
    );

    this.ws.on("error", (err) => {
      console.error("ERR", err);
    });
  };

  restart = () => {
    if (this.wsKeySession) {
      this.ws.close(this.wsKeySession);
      this.init();
    }
  };
}

const bybitExchange = new BybitExchange();
export default bybitExchange;
