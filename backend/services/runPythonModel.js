import { spawn } from "child_process";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// ESM-compatible __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const runPythonModel = (model = "rf", fileName = "RELIANCE.csv") => {
  return new Promise((resolve, reject) => {
    const scriptPath = join(__dirname, "../../ml/predict.py");
    const csvPath = join(__dirname, `../../data/stocks/${fileName}`);

    const process = spawn("python", [scriptPath, model, csvPath]);

    let result = "";
    process.stdout.on("data", (data) => {
      result += data.toString();
    });

    process.stderr.on("data", (err) => {
      console.error("Python Error:", err.toString());
    });

    process.on("close", () => {
      try {
        const json = JSON.parse(result);
        resolve(json);
      } catch (e) {
        reject("❌ Failed to parse prediction result:\n" + result);
      }
    });
  });
};

export default runPythonModel;
