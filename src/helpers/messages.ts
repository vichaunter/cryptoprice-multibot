import { BotCommand, Direction } from "../types"

export const parseCommand = (str: string): BotCommand => {
    const args = str.split(" ")
    if(args[0].startsWith("/")) {
        args.shift()
    }

    return {
        symbol: args[0],
        price: Number(args[1]),
        direction: args[2] as Direction,
        remove: !!args[3],
    }
}