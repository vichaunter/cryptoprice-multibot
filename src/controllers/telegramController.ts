import { Telegraf, Context, Markup } from "telegraf";
import { Message } from "telegraf/typings/core/types/typegram";
import { parseCommand } from "../helpers/messages";
import { getUserAlerts, removeAlert, setOrUpdateUserAlert } from "../store";
import { Direction, MessageKeyboardAnswer, UserStore } from "../types";

type Bot = {} & Telegraf<Context>;
const KEY_AUTOREMOVE = "Autoremove";
const KEY_UP = "up";
const KEY_DOWN = "down";
const KEY_REMOVE = "remove";

class TelegramBot {
  bot: Bot | undefined;

  init(token: string) {
    this.bot = new Telegraf<Context>(token);

    this.start();
    this.addListener();
    this.help();
    this.listCommand();
    this.removeListener();
    // this.alertConfiguration()

    this.bot.launch();
  }

  start() {
    if (!this.bot) throw Error("bot not initialized");

    this.bot.command("start", (ctx) => {
      this.bot?.telegram.sendMessage(ctx.chat.id, "Hello there", {});
    });
  }

  addListener() {
    if (!this.bot) throw Error("bot not initialized");

    this.bot.command("add", (ctx) => {
      const command = ctx.update.message.text;

      const args = parseCommand(command);
      try {
        const userAlert: UserStore = {
          userId: ctx.from.id,
          chatId: ctx.chat.id,
          ...args,
        };
        setOrUpdateUserAlert(userAlert);
        // ctx.reply('ok', Markup.inlineKeyboard(this.getAlertConfigurationKeys()))
        this.sendMessage(
          ctx.chat.id,
          `saved alert: ${Object.values(args).join(" ")}`
        );
      } catch (e) {
        ctx.reply(e as string);
        console.log(e);
      }
    });
  }

  removeListener() {
    if (!this.bot) throw Error("bot not initialized");

    this.bot.command("remove", (ctx) => {
      const args = ctx.update.message.text.split(" ");
      args.shift();

      const symbol = args[0];
      const price = Number(args[1]);

      try {
        if (removeAlert(ctx.from.id, symbol, price)) {
          ctx.reply("found and deleted");
        }
      } catch (e) {
        ctx.reply(e as string);
        console.log(e);
      }
    });
  }

  //   getAlertConfigurationKeys(){
  //       return [
  //           [Markup.button.callback(KEY_AUTOREMOVE,KEY_AUTOREMOVE)],
  //           [Markup.button.callback(KEY_UP,KEY_UP),
  //           Markup.button.callback(KEY_DOWN,KEY_DOWN)],
  //       ]
  //   }

  //   alertConfiguration(){
  //     if (!this.bot) throw Error("bot not initialized");

  //     this.bot.on('callback_query', ctx => {
  //         const {data, message} = ctx.update.callback_query

  //         const newMessage = `edited\n${data}`
  //         ctx.editMessageText(newMessage)

  //         return ctx.editMessageReplyMarkup({
  //             inline_keyboard: this.getAlertConfigurationKeys()
  //         })
  //     })
  //   }

  sendMessage(chatId: number, message: string) {
    if (!this.bot) throw Error("bot not initialized");

    this.bot.telegram.sendMessage(chatId, message);
  }

  getListCommandKeys() {
    return [[Markup.button.callback(KEY_REMOVE, KEY_REMOVE)]];
  }

  listCommand() {
    if (!this.bot) throw Error("bot not initialized");

    this.bot.command("list", (ctx) => {
      const alerts = getUserAlerts(ctx.from.id);
      
      if (!alerts.length) {
        ctx.reply("You have not alerts yet");
        return;
      }

      alerts
        .sort((a, b) => b.price - a.price)
        .map((a) => `${a.symbol} ${a.price} ${a.direction}`)
        .forEach((alert) => {
          ctx.reply(alert, Markup.inlineKeyboard(this.getListCommandKeys()));
        });
    });

    this.bot.on("callback_query", (ctx) => {
      const cbq = ctx.update.callback_query;
      const message = cbq.message as MessageKeyboardAnswer;
      const from = cbq.from;
      let responseString = "Invalid command";

      if (message) {
        const args = parseCommand(message.text.toString());
        responseString = removeAlert(from.id, args.symbol, args.price)
          ? "found and deleted"
          : "not found";
      }
      ctx.reply(responseString);
    });
  }

  help() {
    if (!this.bot) throw Error("bot not initialized");

    this.bot.command("help", (ctx) => {
      const help = `
It's dangerous to go alone, take one of this:

Create a new alert
    /add BTCUSD 45000 up|down? rm?

Remove your alert by symbol/price
    /remove BTCUSD 45000

This help
    /help

* with ? optional parameters
* only 1 space between parameters
        `;
      ctx.reply(help);
    });
  }

  sendAlert(data: UserStore, exchange: string) {
    if (!this.bot) throw Error("bot not initialized");

    if (data.remove) {
      removeAlert(data.userId, data.symbol, data.price);
    }

    data.lastAlert = Date.now() / 1000;

    const str = `${data.symbol} crossed ${data.price} on ${exchange}`;
    this.bot.telegram.sendMessage(data.chatId, str);
  }
}

const telegramBot = new TelegramBot();
export default telegramBot;
