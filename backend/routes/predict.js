// routes/predict.js
import express from "express";
import runPythonModel from "../services/runPythonModel.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { stockSymbol, modelType } = req.body;

  if (!stockSymbol) return res.status(400).json({ error: "Stock symbol required" });

  try {
    const result = await runPythonModel(modelType || "rf", `${stockSymbol}.csv`);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Local prediction failed", details: error.toString() });
  }
});

export default router;
