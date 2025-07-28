import { readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Required to emulate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Reads all CSV filenames inside `../../data/stocks`
 * and returns a list of stock symbols (filenames without `.csv`)
 */
const getAvailableStocks = () => {
  const dirPath = join(__dirname, "../../data/stocks");

  return readdirSync(dirPath)
    .filter((file) => file.endsWith(".csv"))
    .map((file) => file.replace(".csv", ""));
};

export default getAvailableStocks;
