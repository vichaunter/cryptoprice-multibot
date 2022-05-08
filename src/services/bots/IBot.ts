import { UserStore } from "../../types";
import Exchange from "../exchanges/Exchange";

class IBot {
  bot: any | undefined;

  init(token: string) {
    throw Error("bot not initialized");
  }

  start() {
    throw Error("start not implemented");
  }

  addListener() {
    throw Error("addListener not implemented");
  }

  removeListener() {
    throw Error("removeListener not implemented");
  }

  sendMessage(chatId: number, message: string) {
    throw Error("sendMessage not implemented");
  }

  getListCommandKeys() {
    throw Error("getListCommandKeys not implemented");
  }

  listCommand() {
    throw Error("listCommand not implemented");
  }

  help() {
    throw Error("help not implemented");
  }

  sendAlert(data: UserStore, exchange: Exchange) {
    throw Error("sendAlert not implemented");
  }
}
export default IBot;
