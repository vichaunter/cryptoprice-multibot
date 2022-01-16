import { WebsocketClient, WsKey, DefaultLogger } from "bybit-api";
import telegramBot from "../../controllers/telegramController";
import { onTrade } from "../../controllers/tradeController";
import { getCurrentSymbols } from "../../store";
import { TradeType } from "../../types";


DefaultLogger.silly = () => {};

const ws = new WebsocketClient({});

let wsKeySession: WsKey

const init = () => {
    const currentSymbols = getCurrentSymbols()
    const currentTopics = currentSymbols.map(s => `trade.${s}`)
    if(!currentSymbols.length) return

    ws.subscribe(['trade'])

    ws.on('open', ({ wsKey, event }) => {
        wsKeySession = wsKey
        console.log('Bybit connection open for websocket with ID: ' + wsKey);
    });

    ws.on('update', ({topic, data}: {topic: string, data: TradeType[]}) => {
        if(currentTopics.includes(topic)){
            data.forEach(trade => {
                onTrade(trade, 'bybit')
            })
        }
    });

    ws.on('error', err => {
      console.error('ERR', err);
    });
}

export const restart = () => {
    ws.close(wsKeySession)
    init()
}

export default init