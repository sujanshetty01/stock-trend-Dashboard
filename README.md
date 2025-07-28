# Stock Trend Dashboard

A full-stack application for predicting stock market trends using machine learning models and displaying historical data with interactive visualizations.

## Features

- Real-time stock search and selection
- Historical price data visualization using interactive charts
- Machine learning-based trend predictions
- Perplexity API integration for market insights
- Responsive and modern UI with Tailwind CSS

## Tech Stack

### Frontend
- React + Vite
- Tailwind CSS for styling
- Recharts for data visualization
- Day.js for date formatting

### Backend
- Express.js
- Python for ML models
- Perplexity API integration

### Machine Learning
- scikit-learn
- Random Forest Classifier
- Support Vector Machine (SVM)

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v18 or higher)
- Python (v3.8 or higher)
- Git

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd stock-trend-dashboard
```

### 2. Environment Setup

#### Frontend Setup
```bash
cd frontend
npm install
```

#### Backend Setup
```bash
cd backend
npm install
```

#### Python Environment Setup
```bash
# Create and activate a virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install required Python packages
pip install pandas numpy scikit-learn
```

### 3. Download Stock Data

The project uses historical stock data from NSE (National Stock Exchange). Follow these steps to set up the data:

1. Create a Kaggle account if you don't have one
2. Go to your Kaggle account settings
3. Generate an API token and download `kaggle.json`
4. Place the `kaggle.json` file in the `kaggle` directory
5. Run the following commands:
```bash
cd kaggle
kaggle datasets download -d <dataset-id>  # Will be provided by repository owner
unzip <downloaded-zip-file> -d ../data/stocks
```

### 4. Environment Variables

Create `.env` files in both frontend and backend directories:

#### Backend `.env`
```
PORT=5000
PERPLEXITY_API_KEY=your_perplexity_api_key
```

#### Frontend `.env`
```
VITE_API_URL=http://localhost:5000
```

### 5. Running the Application

1. Start the Backend Server:
```bash
cd backend
npm start
```

2. Start the Frontend Development Server:
```bash
cd frontend
npm run dev
```

3. Access the application at `http://localhost:5173`

## Project Structure

```
├── backend/                 # Express server
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   └── server.js          # Server entry point
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   └── App.jsx       # Root component
│   └── index.html
├── data/                   # Stock data directory
│   └── stocks/            # Individual stock CSV files
├── ml/                     # Machine learning models
│   └── predict.py         # Prediction logic
└── kaggle/                # Kaggle configuration
```

## API Endpoints

- `GET /api/stocks` - Get list of available stocks
- `GET /api/predict/:symbol` - Get prediction for a specific stock
- `GET /api/history/:symbol` - Get historical data for a stock
- `GET /api/perplexity/:symbol` - Get market insights using Perplexity API

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- NSE India for providing historical stock data
- Perplexity API for market insights
- All contributors and maintainers

## Support

For support, please open an issue in the repository or contact the maintainers.
