import sys
import json
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC

def get_features(csv_path):
    df = pd.read_csv(csv_path)

    # Drop rows with missing values
    df = df.dropna()

    # Generate target column: 1 if next day's Close is higher than current day's, else 0
    df['Target'] = (df['Close'].shift(-1) > df['Close']).astype(int)
    df = df.dropna()

    # Use Open, High, Low, Close as features
    X = df[['Open', 'High', 'Low', 'Close']].iloc[:-1]
    y = df['Target'].iloc[:-1]

    return X, y

def predict_with_model(model_type, csv_path):
    X, y = get_features(csv_path)
    
    # Choose model
    model = SVC() if model_type == 'svm' else RandomForestClassifier()
    
    # Train the model
    model.fit(X, y)
    
    # Predict the trend using the most recent data
    latest_data = pd.DataFrame([X.iloc[-1].values], columns=X.columns)  # shape: (1, 4) with feature names
    prediction = model.predict(latest_data)[0]

    return {"trend": "UP" if prediction == 1 else "DOWN"}

if __name__ == "__main__":
    model_type = sys.argv[1] if len(sys.argv) > 1 else "rf"
    csv_path = sys.argv[2] if len(sys.argv) > 2 else "./data/stocks/RELIANCE.csv"
    result = predict_with_model(model_type, csv_path)
    print(json.dumps(result))
