const isValid = (symbol: string) => {
  return symbols.includes(symbol.toUpperCase());
};

const getSymbolsMatching = (symbol: string) => {
  return symbols.filter((s) => s.startsWith(symbol.slice(0, 3).toUpperCase()));
};

export default {
  isValid,
  getSymbolsMatching,
};
