import path from 'path'
import dotenv from 'dotenv'
import init from './services/exchanges/bybitPrices'
import TelegramBot from './controllers/telegramController'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

//bots
TelegramBot.init(process.env.BOT_TOKEN || "")

//exchanges
init()