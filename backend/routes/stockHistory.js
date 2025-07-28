import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';

const router = express.Router();
const __dirname = dirname(fileURLToPath(import.meta.url));

router.get('/:symbol', (req, res) => {
  try {
    const { symbol } = req.params;
    const filePath = join(__dirname, '../../data/stocks', `${symbol}.csv`);
    if (!existsSync(filePath)) {
      return res.status(404).json({ error: 'Stock data not found' });
    }
    const fileContent = readFileSync(filePath, 'utf-8');
    
    // Parse CSV data
    const lines = fileContent.trim().split('\n');
    const headers = lines[0].split(',');
    const data = lines.slice(-30).map(line => {
      const values = line.split(',');
      const dataPoint = headers.reduce((obj, header, index) => {
        // Convert numeric values
        const value = values[index];
        if (['Open', 'High', 'Low', 'Close', 'VWAP'].includes(header)) {
          obj[header] = parseFloat(value);
        } else if (header === 'Volume') {
          obj[header] = parseInt(value);
        } else {
          obj[header] = value;
        }
        return obj;
      }, {});
      return dataPoint;
    }).reverse(); // Most recent data first

    // Calculate latest info
    const latest = data[data.length - 1];
    const previousDay = data[data.length - 2];
    const dayChange = ((parseFloat(latest.Close) - parseFloat(previousDay.Close)) / parseFloat(previousDay.Close) * 100).toFixed(2);

    const info = {
      latestClose: parseFloat(latest.Close),
      volume: parseInt(latest.Volume),
      dayChange: parseFloat(dayChange)
    };

    res.json({
      data,
      info
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stock history' });
  }
});

export default router;
