import { useEffect, useState } from "react";
import { fetchAvailableStocks, getPredictionFromLocalModel, getStockHistory } from "../services/api";
import StockChart from "./StockChart";
import dayjs from "dayjs";

export default function StockPredictor() {
  const [stocks, setStocks] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedStock, setSelectedStock] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [stockInfo, setStockInfo] = useState(null);
  const [modelType, setModelType] = useState("local"); // Only local
  const [localModel, setLocalModel] = useState("rf"); // "rf" or "svm"

  useEffect(() => {
    fetchAvailableStocks().then((data) => setStocks(data.stocks));
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    const filtered = stocks.filter((stock) =>
      stock.toLowerCase().includes(search.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 10)); // Limit to 10 suggestions
    setShowDropdown(true);
  }, [search, stocks]);

  const handleSelect = async (stock) => {
    setSelectedStock(stock);
    setSearch(stock);
    setShowDropdown(false);
    
    try {
      const history = await getStockHistory(stock);
      setHistoricalData(history.data);
      setStockInfo(history.info);
    } catch (err) {
      setError("Failed to fetch stock history");
    }
  };

  const handlePredict = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getPredictionFromLocalModel(selectedStock, localModel);
      setPrediction(res);
    } catch (err) {
      setError(err.message || "Failed to get prediction");
      setPrediction(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-2xl mt-10 relative">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">📈 Stock Trend Predictor</h1>
        <p className="text-gray-600">Analyze and predict stock market trends with AI</p>
      </div>

      <div className="mb-6 relative">
        <label className="block font-semibold mb-2 text-gray-700">Search & Select Stock:</label>
        <div className="relative">
          <input
            type="text"
            placeholder="Type stock name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            onFocus={() => search && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            onKeyDown={e => {
              if (e.key === 'Enter' && suggestions.length > 0) {
                handleSelect(suggestions[0]);
              }
            }}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {showDropdown && suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border-2 border-gray-100 rounded-lg max-h-60 overflow-y-auto mt-2 shadow-lg">
            {suggestions.map((stock) => (
              <li
                key={stock}
                onClick={() => handleSelect(stock)}
                className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-none"
              >
                <div className="font-medium text-gray-800">{stock}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:space-x-6 mb-6">
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Local Model Type:</label>
          <select
            value={localModel}
            onChange={e => setLocalModel(e.target.value)}
            className="p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
          >
            <option value="rf">Random Forest</option>
            <option value="svm">SVM</option>
          </select>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handlePredict}
          disabled={!selectedStock || loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg disabled:opacity-50 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg flex items-center space-x-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <span>Predict Trend</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-center space-x-3">
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {selectedStock && stockInfo && (
        <div className="mt-8">
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Latest Price</h3>
              <div className="flex items-baseline space-x-2">
                <p className="text-3xl font-bold text-gray-900">₹{stockInfo.latestClose.toFixed(2)}</p>
                <p className={`text-sm font-medium ${stockInfo.dayChange >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                  {stockInfo.dayChange >= 0 ? (
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                  )}
                  {Math.abs(stockInfo.dayChange)}%
                </p>
              </div>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-sm">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Trading Volume</h3>
              <div className="flex items-baseline space-x-2">
                <p className="text-3xl font-bold text-gray-900">{stockInfo.volume.toLocaleString()}</p>
                <p className="text-sm text-gray-500 font-medium">shares</p>
              </div>
              <p className="text-sm text-gray-500 mt-2">Last trading day</p>
            </div>
          </div>

          {historicalData.length > 0 && <StockChart data={historicalData} />}
        </div>
      )}

      {prediction && (
        <div className="mt-8">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-1">
            <div className="bg-white rounded-xl p-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Local Model ({localModel.toUpperCase()}) Results
                </h2>
                <div className="inline-block rounded-lg px-6 py-3 bg-gray-50">
                  <p className="text-lg text-gray-700 mb-2">Predicted Trend</p>
                  <div className={`text-3xl font-bold ${
                    prediction.trend === "UP" ? "text-green-600" : "text-red-600"
                  } flex items-center justify-center space-x-2`}>
                    {prediction.trend === "UP" ? (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    ) : (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                      </svg>
                    )}
                    <span>{prediction.trend}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm">
                    Based on historical data analysis and market indicators
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
