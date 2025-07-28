# Stock Trend Dashboard

A web application to analyze and predict stock market trends using machine learning.

## Features
- Search and select stocks from a large dataset
- View recent historical price and volume data
- Get local ML model predictions (Random Forest/SVM)
- Modern, responsive UI with charts and statistics

## Tech Stack
- Frontend: React (Vite), Tailwind CSS
- Backend: Node.js, Express
- ML: Python (scikit-learn)
- Data: CSV files of historical stock prices

## Setup
1. Clone the repo
2. Install dependencies in both `frontend` and `backend`:
   ```sh
   cd frontend && npm install
   cd ../backend && npm install
   ```
3. Start the backend:
   ```sh
   cd backend && npm start
   ```
4. Start the frontend:
   ```sh
   cd frontend && npm run dev
   ```

## Usage
- Search for a stock symbol
- View its recent price/volume history
- Click "Predict Trend" to get a local ML prediction

## Notes
- Requires Node.js, Python, and npm
- For local ML predictions, ensure Python and scikit-learn are installed
- Do not commit your `.env` file or API keys
