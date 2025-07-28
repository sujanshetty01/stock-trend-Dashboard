import { createReadStream } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import csv from "csv-parser";

// __dirname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getCompanyMap = () => {
  const results = {};

  return new Promise((resolve, reject) => {
    const filePath = join(__dirname, "../../data/NSE Symbols.CSV");

    createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        let symbol = row["Scrip"];
        let name = row["Company Name"];

        // Fallback for single-column CSV (e.g., "Scrip,Company Name" as header)
        if (!symbol && !name && row["Scrip,Company Name"]) {
          const parts = row["Scrip,Company Name"].split(",");
          symbol = parts[0];
          name = parts.slice(1).join(","); // in case company name has commas
        }

        if (symbol && name) {
          results[symbol.trim()] = name.trim();
        }
      })
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
};

export default getCompanyMap;
