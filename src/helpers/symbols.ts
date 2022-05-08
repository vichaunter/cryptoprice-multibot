const symbols = ["BTCUSDT", "BTCUSD", "ETHUSDT", "ETHBTC"];

export const isValid = (symbol: string) => {
  return symbols.includes(symbol.toUpperCase());
};

export const getSymbolsMatching = (symbol: string) => {
  return symbols.filter((s) => s.startsWith(symbol.slice(0, 3).toUpperCase()));
};

export default symbols;
