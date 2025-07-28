const BASE_URL = "http://localhost:8000";

export const fetchAvailableStocks = async () => {
  const res = await fetch(`${BASE_URL}/stocks`);
  return res.json();
};

export const getStockHistory = async (stockSymbol) => {
  const res = await fetch(`${BASE_URL}/api/stock-history/${stockSymbol}`);
  return res.json();
};

export const getPredictionFromLocalModel = async (stockSymbol, modelType = "rf") => {
  const res = await fetch(`${BASE_URL}/api/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stockSymbol, modelType }),
  });
  return res.json();
};
