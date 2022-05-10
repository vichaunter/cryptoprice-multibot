import { Bot, Context, InlineKeyboard } from "grammy";
import { getSymbolsMatching, isValid } from "../../helpers/symbols";
import userModel from "../../models/userModel";
import { TDirection, TExchange, TSymbol, UserStore } from "../../types";
import IBot from "./IBot";

const KEY_AUTOREMOVE_YES = "autoremove_yes";
const KEY_AUTOREMOVE_NO = "autoremove_no";
const KEY_UP = "up";
const KEY_DOWN = "down";
const KEY_REMOVE_ALERT = "remove_alert";
const KEY_SET_EXCHANGE = "set_exchange";
const KEY_SET_SYMBOL = "set_symbol";

type queueValueType = {
  started: boolean;
  exchange: TExchange | undefined;
  symbol: string | undefined;
  price: string;
  direction: TDirection;
  autoRemove: boolean | undefined;
};
const queueValueDefault: queueValueType = {
  started: false,
  exchange: undefined,
  symbol: undefined,
  price: "",
  direction: undefined,
  autoRemove: undefined,
};

type queueType = {
  [key: string]: queueValueType;
};
const queue: queueType = {};

// const menu = new MenuTemplate<MyContext>(
//   () => `Add alert for BTCUSDT ${currentValue.direction}`
// );

// menu.url("EdJoPaTo.de", "https://edjopato.de");

// let mainMenuToggle = false;
// menu.toggle("toggle me", "toggle me", {
//   set: (_, newState) => {
//     mainMenuToggle = newState;
//     // Update the menu afterwards
//     return true;
//   },
//   isSet: () => mainMenuToggle,
// });

// menu.interact("interaction", "interact", {
//   hide: () => mainMenuToggle,
//   do: async (ctx) => {
//     await ctx.answerCallbackQuery({ text: "you clicked me!" });
//     // Do not update the menu afterwards
//     return false;
//   },
// });

// menu.interact("update after action", "update afterwards", {
//   joinLastRow: true,
//   hide: () => mainMenuToggle,
//   do: async (ctx) => {
//     await ctx.answerCallbackQuery({ text: "I will update the menu now…" });

//     return true;

//     // You can return true to update the same menu or use a relative path
//     // For example '.' for the same menu or '..' for the parent menu
//     // return '.'
//   },
// });

// menu.select("direction", ["UP", "DOWN", "ANY"], {
//   set: async (ctx, direction) => {
//     currentValue.direction = direction;
//     return true;
//   },
//   isSet: (_, key) => currentValue.direction === key,
// });

// let selectedKey = "b";
// menu.select("select", ["A", "B", "C"], {
//   set: async (ctx, key) => {
//     selectedKey = key;
//     await ctx.answerCallbackQuery({ text: `you selected ${key}` });
//     return true;
//   },
//   isSet: (_, key) => key === selectedKey,
// });

class TelegramBot extends IBot {
  bot: Bot | undefined;

  init(token: string) {
    // this.bot = new Telegraf<Context>(token);
    this.bot = new Bot(token);
    console.log("init bot");
    this.listCommand();
    this.helpCommand();
    this.addCommand();
    // this.start();
    // this.addListener();
    // this.removeListener();
    // this.alertConfiguration()

    // this.bot.launch();
    this.bot?.start();
  }

  requireBot(): void {
    throw Error("Telegram bot not initialized");
  }

  start() {
    if (!this.bot) return this.requireBot();
    this.bot.command("start", (ctx) => ctx.reply("I'm ready for alerts!"));
  }

  handleSymbol(ctx: Context, userQueue: queueValueType, symbol: string) {
    if (isValid(symbol)) {
      userQueue.symbol = symbol.toUpperCase();
      ctx.reply(`${symbol} selected, now choose price`);
    } else {
      const validSymbols = getSymbolsMatching(symbol);
      if (validSymbols.length > 0) {
        const inlineKeyboard = new InlineKeyboard();
        validSymbols.forEach((symbol) => {
          inlineKeyboard.text(symbol);
        });
        ctx.reply(
          `${symbol} is not supported in exchange, This are matching by first 3 characters, pick one:`,
          {
            reply_markup: inlineKeyboard,
          }
        );
      } else {
        ctx.reply(`${symbol} symbol not supported, please try another`);
      }
    }
  }

  handleExchange(ctx: Context, userQueue: queueValueType, exchange: string) {
    // if(isValid)
  }

  handlePrice(ctx: Context, userQueue: queueValueType, price: string) {
    userQueue.price = price;
    const autoRemoveKeyboard = new InlineKeyboard();
    autoRemoveKeyboard.text("YES", KEY_AUTOREMOVE_YES);
    autoRemoveKeyboard.text("NO", KEY_AUTOREMOVE_NO);
    ctx.reply(`Price selected, auto remove alert?`, {
      reply_markup: autoRemoveKeyboard,
    });
  }

  handleAutoremove(
    ctx: Context,
    userQueue: queueValueType,
    autoremove: boolean
  ) {
    const userId = ctx.from?.id;
    if (!userId) return;
    userQueue.autoRemove = autoremove;

    try {
      if (!ctx.chat?.id) throw Error("invalid chat id");
      const userAlert: UserStore = {
        userId: ctx.from.id,
        chatId: ctx.chat.id,
        exchange: userQueue.exchange as TExchange,
        price: Number(userQueue.price),
        // direction: userQueue.direction,
        remove: userQueue.autoRemove,
        symbol: userQueue.symbol as string,
      };
      userModel.saveAlert(userAlert);
      // ctx.reply('ok', Markup.inlineKeyboard(this.getAlertConfigurationKeys()))

      ctx.reply(
        `Alert saved for ${userQueue.exchange} on ${
          userQueue.symbol
        } when price at ${userQueue.price} will go ${userQueue.direction} ${
          userQueue.autoRemove
            ? "only the first time the price crosses"
            : "each time the price crosses"
        }`
      );
      delete queue[userId];
    } catch (e: any) {
      ctx.reply(`Error: ${e}, please try again`);
    }
    ctx.answerCallbackQuery(); // remove loading animation
  }

  addCommand() {
    if (!this.bot) return this.requireBot();

    // const menuMiddleware = new MenuMiddleware("/", menu);
    this.bot.command("add", async (ctx) => {
      const userId = ctx.from?.id;
      if (!userId) return;
      console.log("add");
      if (!queue[userId]) {
        queue[userId] = queueValueDefault;
      }
      queue[userId].started = true;
      await ctx.reply(`Let's start adding an alert, Which exchange?`);
    });

    this.bot.command("cancel", (ctx) => {
      console.log("cancel command");
      const userId = ctx.from?.id;
      if (!userId) return;
      delete queue[userId];
      ctx.reply("Canceled");
    });

    const ikey = new InlineKeyboard();
    ikey.text("UP", "UP");
    // this.bot.use(menu);
    this.bot.command("alo", async (ctx) => {
      await ctx.reply("menu", { reply_markup: ikey });
    });
    this.bot.callbackQuery("UP", (ctx) => {
      console.log("UP");
      ctx.answerCallbackQuery({
        text: "You were curious, indeed!",
      });
    });

    this.bot.on("message:text", (ctx) => {
      console.log("message:text");
      const userId = ctx.from?.id;
      const userQueue: queueValueType = queue[userId];
      if (!userId || !userQueue) return;
      if (userQueue.started) {
        //TODO: user id relative
        const text: string = ctx.msg.text;
        if (!userQueue.exchange) {
          //TODO: check that is valid or reask
          userQueue.exchange = text.toLowerCase() as TExchange; //TODO: check and send list starting with the character if not
          ctx.reply(`${text} selected, now choose symbol`);
          return;
        } else if (!userQueue.symbol) {
          this.handleSymbol(ctx, userQueue, text);
          return;
        } else if (!userQueue.price) {
          this.handlePrice(ctx, userQueue, text);
          return;
        }

        ctx.reply("message:text not handled");
        // else if (!userQueue.price) {
        //   userQueue.price = text;
        //   const inlineKeyboard = new InlineKeyboard();
        //   inlineKeyboard.text("UP").text("DOWN").text("ANY");

        //   return ctx.reply(`${text} now choose direction`, {
        //     reply_markup: inlineKeyboard,
        //   });
        // }
      }
    });

    this.bot.callbackQuery(KEY_AUTOREMOVE_YES, async (ctx) => {
      const userId = ctx.from?.id;
      const userQueue: queueValueType = queue[userId];
      if (!userId || !userQueue) return;
      this.handleAutoremove(ctx, userQueue, true);
    });

    this.bot.callbackQuery(KEY_AUTOREMOVE_NO, async (ctx) => {
      const userId = ctx.from?.id;
      const userQueue: queueValueType = queue[userId];
      if (!userId || !userQueue) return;
      this.handleAutoremove(ctx, userQueue, false);
    });

    this.bot.on("callback_query:data", async (ctx) => {
      console.log("callback_query:data");
      const userId = ctx.from?.id;
      const userQueue: queueValueType = queue[userId];
      if (!userId || !userQueue) return;
      if (userQueue.started) {
        const text = ctx.callbackQuery.data.toLowerCase();
        if (!userQueue.symbol) {
          this.handleSymbol(ctx, userQueue, text);
          return;
          // } else if (!userQueue.direction) {
          //   userQueue.direction =
          //     text === "up" ? "up" : text === "down" ? "down" : "any";
          //   console.log(userQueue);
          //   ctx.reply(`${text} selected, Auto remove when executed?`, {
          //     reply_markup: new InlineKeyboard().text("yes").text("no"),
          //   });
        } else if (!userQueue.autoRemove) {
          // userQueue.autoRemove = text === "yes" || text === "y";
          // console.log(userQueue.autoRemove, text);
          // try {
          //   if (!ctx.chat?.id) throw Error("invalid chat id");
          //   const userAlert: UserStore = {
          //     userId: ctx.from.id,
          //     chatId: ctx.chat.id,
          //     exchange: userQueue.exchange as TExchange,
          //     price: Number(userQueue.price),
          //     // direction: userQueue.direction,
          //     remove: userQueue.autoRemove,
          //     symbol: userQueue.symbol as string,
          //   };
          //   userModel.saveAlert(userAlert);
          //   // ctx.reply('ok', Markup.inlineKeyboard(this.getAlertConfigurationKeys()))
          //   ctx.reply(
          //     `Alert saved for ${userQueue.exchange} on ${
          //       userQueue.symbol
          //     } when price at ${userQueue.price} will go ${
          //       userQueue.direction
          //     } ${
          //       userQueue.autoRemove
          //         ? "only the first time the price crosses"
          //         : "each time the price crosses"
          //     }`
          //   );
          //   delete queue[userId];
          // } catch (e: any) {
          //   ctx.reply(`Error: ${e}, please try again`);
          // }
        }
        await ctx.answerCallbackQuery(); // remove loading animation
        ctx.reply("callback_query:data not handled");
      }
    });
  }

  // addListener() {
  //   if (!this.bot) throw Error("bot not initialized");
  //   this.bot.command("test", (ctx) => {
  //     ctx.reply(
  //       "ok",
  //       Markup.inlineKeyboard([[Markup.button.callback("test", "test")]])
  //     );
  //   });
  //   this.bot.command("add", (ctx) => {
  //     const command = ctx.update.message.text;
  //     const args = parseCommand(command);
  //     try {
  //       const userAlert: UserStore = {
  //         userId: ctx.from.id,
  //         chatId: ctx.chat.id,
  //         ...args,
  //       };
  //       setOrUpdateUserAlert(userAlert);
  //       // ctx.reply('ok', Markup.inlineKeyboard(this.getAlertConfigurationKeys()))
  //       this.sendMessage(
  //         ctx.chat.id,
  //         `saved alert: ${Object.values(args).join(" ")}`
  //       );
  //     } catch (e) {
  //       ctx.reply(e as string);
  //       console.log(e);
  //     }
  //   });
  // }
  // removeListener() {
  //   if (!this.bot) return this.requireBot();
  //   this.bot.command("remove", (ctx) => {
  //     const args = ctx.update.message.text.split(" ");
  //     args.shift();
  //     const symbol = args[0];
  //     const price = Number(args[1]);
  //     try {
  //       if (removeAlert(ctx.from.id, symbol, price)) {
  //         ctx.reply("found and deleted");
  //       }
  //     } catch (e) {
  //       ctx.reply(e as string);
  //       console.log(e);
  //     }
  //   });
  // }
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
  // sendMessage(chatId: number, message: string) {
  //   if (!this.bot) return this.requireBot();
  //   this.bot.telegram.sendMessage(chatId, message);
  // }

  /*
    if (!this.bot) return this.requireBot();

    this.bot.command("add", async (ctx) => {
      const userId = ctx.from?.id;
      if (!userId) return;
      console.log("add", queue[userId]);
      if (!queue[userId]) {
        queue[userId] = queueValueDefault;
      }
      queue[userId].started = true;

      const exchangesKeyboard = new InlineKeyboard();
      Object.keys(exchangesList).forEach((exchange) => {
        exchangesKeyboard.text(exchange, KEY_SET_EXCHANGE);
      });
      await ctx.reply(`Let's start adding an alert, Which exchange?`, {
        reply_markup: exchangesKeyboard,
      });
    });

    this.bot.callbackQuery(KEY_SET_EXCHANGE, ctx => {
      const exchangeName = ctx.update.callback_query.message?.text;
      if (!exchangeName) {
        ctx.reply("Not a valid exchange");
        return
      };

      ctx.reply(`${exchangeName} selected, now choose symbol`, {
        
      });

    })  
  */
  listCommand() {
    if (!this.bot) return this.requireBot();

    this.bot.command("list", (ctx) => {
      if (!ctx.from) return;
      const alerts = userModel.getUserAlerts(ctx.from.id);

      if (!alerts.length) {
        ctx.reply("You have not alerts yet");
        return;
      }

      alerts
        .sort((a, b) => b.price - a.price)
        // .map((a) => `${a.symbol} ${a.price} ${a.direction}`)
        .forEach((alert) => {
          ctx.reply(`${alert.exchange} ${alert.symbol} ${alert.price}`, {
            reply_markup: new InlineKeyboard().text("Remove", KEY_REMOVE_ALERT),
          });
        });
    });

    this.bot.callbackQuery(KEY_REMOVE_ALERT, async (ctx) => {
      const alert = ctx.update.callback_query.message?.text;
      if (!alert) {
        ctx.reply("Not a valid alert");
        return;
      }
      const [exchange, symbol, price] = alert.split(" ");
      userModel.removeAlert(
        ctx.from.id,
        exchange as TExchange,
        symbol as TSymbol,
        Number(price)
      );
      ctx.reply(`Alert removed [${exchange} ${symbol} ${price}]`);
    });

    // this.bot.on("callback_query", (ctx) => {
    // console.log();
    // const cbq = ctx.update.callback_query;
    // const message = cbq.message;
    // const from = cbq.from;
    // let responseString = "Invalid command";

    // if (message) {
    //   const args = parseCommand(message.text.toString());
    //   responseString = removeAlert(from.id, args.symbol, args.price)
    //     ? "found and deleted"
    //     : "not found";
    // }
    // ctx.reply(responseString);
    // });
  }

  helpCommand() {
    if (!this.bot) return this.requireBot();

    this.bot.command("help", (ctx) => {
      const help = `
It's dangerous to go alone, take one of this:
- /add => Create a new alert 
- /list   => List all your current alerts (also for removing)
- /help => This help    
`;
      ctx.reply(help);
    });
  }

  sendAlert(data: UserStore, exchange: TExchange) {
    if (!this.bot) return this.requireBot();

    if (data.remove) {
      userModel.removeAlert(data.userId, exchange, data.symbol, data.price);
    }

    data.lastAlert = Date.now() / 1000;

    const str = `${data.symbol} crossed ${data.price} on ${exchange}`;
    this.bot.api.sendMessage(data.chatId, str);

    // if (data.remove) {
    //   removeAlert(data.userId, data.symbol, data.price);
    // }

    // data.lastAlert = Date.now() / 1000;

    // const str = `${data.symbol} crossed ${data.price} on ${exchange}`;
    // this.bot.telegram.sendMessage(data.chatId, str);
  }
}

const telegramBot = new TelegramBot();
export default telegramBot;
