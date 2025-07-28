// server.js
import express from "express";
import cors from "cors";
import predictRoute from "./routes/predict.js";
import getAvailableStocks from "./services/getAvailableStocks.js";
import stockHistoryRoute from "./routes/stockHistory.js";
import dotenv from "dotenv";



dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/predict", predictRoute);
app.use("/api/stock-history", stockHistoryRoute);
app.get("/stocks", (req, res) => {
  const stocks = getAvailableStocks();
  res.json({ stocks });
});

app.get("/", (req, res) => res.send("Hello, World!"));

const PORT = 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
