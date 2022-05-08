import { TExchange } from "../../types";

interface Exchange {
  name: TExchange;
  currentPrices: { [key: string]: number };

  init(): void;
  restart(): void;
}

export default Exchange;
