import os
import pandas as pd
import numpy as np
from sklearn.model_selection import TimeSeriesSplit
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import GRU, Dropout, RepeatVector, TimeDistributed, Dense
from keras.callbacks import EarlyStopping
from keras.optimizers import Adam
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import matplotlib.pyplot as plt
from pymongo import MongoClient
import json

# Constants
LOOKBACK_SIZE = 72
FORECAST_SIZE = 168
N_SPLITS = 10
BATCH_SIZE = 64
EPOCHS = 100
GRU_UNITS = 64
LEARNING_RATE = 0.0005

def connect_to_mongodb():
    # Connect to the MongoDB database using the URI from the environment variable
    uri = os.getenv('MONGO_URI')
    if not uri:
        raise ValueError("MongoDB URI not found in environment variables")
    client = MongoClient(uri)
    return client

def load_data_from_mongodb(client, db_name, collection_name):
    # Load data from MongoDB collection
    db = client[db_name]
    collection = db[collection_name]
    data = pd.DataFrame(list(collection.find()))
    return data

def preprocess_data(data):
    # Preprocess the data
    data.rename(columns={'Timestamps': 'ObservationTimestamp', 'Temperature': 'WaterTemperature', 'PH': 'WaterPh', 'Dissolved Oxygen': 'DissolvedOxygen'}, inplace=True)
    data['ObservationTimestamp'] = pd.to_datetime(data['ObservationTimestamp'])
    data.dropna(inplace=True)
    return data

def feature_engineering(data):
    # Perform feature engineering on the dataset.
    data['Hour'] = data['ObservationTimestamp'].dt.hour
    data['Day'] = data['ObservationTimestamp'].dt.day
    data['Month'] = data['ObservationTimestamp'].dt.month
    return data

def split_data(data, features, targets):
    # Split data into features and targets and then into training and validation sets.
    X = data[features]
    y = data[targets]

    scaler_X = MinMaxScaler()
    scaler_y = MinMaxScaler()

    # Fit scaler on training data
    X_scaled = scaler_X.fit_transform(X)
    y_scaled = scaler_y.fit_transform(y)

    return X_scaled, y_scaled, scaler_X, scaler_y

def prepare_timeseries_data(X, y, lookback_size):
    # Convert time series data into sequences for model training and prediction.
    X_sequences, y_sequences = [], []

    for i in range(len(X) - lookback_size - FORECAST_SIZE + 1):
        X_sequences.append(X[i:i + lookback_size])
        y_sequences.append(y[i + lookback_size:i + lookback_size + FORECAST_SIZE])

    return np.array(X_sequences), np.array(y_sequences)

def train_gru_model(X_train, y_train, X_val, y_val, gru_units=GRU_UNITS, learning_rate=LEARNING_RATE, batch_size=BATCH_SIZE, epochs=EPOCHS, patience=15):
    # Train a GRU model.
    model = Sequential([
        GRU(gru_units, activation='relu', recurrent_activation='tanh', input_shape=(X_train.shape[1], X_train.shape[2])),
        RepeatVector(y_train.shape[1]),
        GRU(gru_units, activation='relu', recurrent_activation='tanh', return_sequences=True),
        TimeDistributed(Dense(y_train.shape[2], activation='linear'))  # Output layer activation changed to linear
    ])
    optimizer = Adam(learning_rate=learning_rate)
    model.compile(optimizer=optimizer, loss='mse')
    early_stopping = EarlyStopping(monitor='val_loss', patience=patience, restore_best_weights=True)

    model.fit(X_train, y_train, epochs=epochs, batch_size=batch_size, validation_data=(X_val, y_val), callbacks=[early_stopping], verbose=1)
    return model

def evaluate_model(model, X_val, y_val, scaler_y):
    # Evaluate the trained model.
    y_pred = model.predict(X_val)
    y_pred_rescaled = scaler_y.inverse_transform(y_pred.reshape(-1, y_val.shape[2]))
    y_val_rescaled = scaler_y.inverse_transform(y_val.reshape(-1, y_val.shape[2]))

    mse = mean_squared_error(y_val_rescaled, y_pred_rescaled)
    mae = mean_absolute_error(y_val_rescaled, y_pred_rescaled)
    r2 = r2_score(y_val_rescaled,
    y_pred_rescaled)

    print("\nEvaluation Metrics for the validation set:")
    print("MSE:", mse)
    print("MAE:", mae)
    print("R-squared:", r2)

    return mse, mae, r2, y_val_rescaled, y_pred_rescaled

def plot_predictions(y_true, y_pred, title='Model Predictions vs Actual Data'):
    # Plot the actual vs predicted values.
    plt.figure(figsize=(10, 5))
    plt.plot(y_true, label='Actual')
    plt.plot(y_pred, label='Predicted')
    plt.title(title)
    plt.legend()
    plt.show()

# New function to run the entire process
def run_gru_model(input_data):
    data = feature_engineering(input_data)
    features = ['WaterTemperature', 'WaterPh', 'DissolvedOxygen', 'Hour', 'Day', 'Month']
    targets = ['WaterTemperature', 'WaterPh', 'DissolvedOxygen']

    X_scaled, y_scaled, scaler_X, scaler_y = split_data(data, features, targets)
    X_sequences, y_sequences = prepare_timeseries_data(X_scaled, y_scaled, LOOKBACK_SIZE)

    tscv = TimeSeriesSplit(n_splits=N_SPLITS)
    mse_scores, mae_scores, r2_scores = [], [], []

    for train_index, val_index in tscv.split(X_sequences):
        X_train, X_val = X_sequences[train_index], X_sequences[val_index]
        y_train, y_val = y_sequences[train_index], y_sequences[val_index]

        model = train_gru_model(X_train, y_train, X_val, y_val, GRU_UNITS, LEARNING_RATE, BATCH_SIZE, EPOCHS)
        mse, mae, r2, y_val_rescaled, y_pred_rescaled = evaluate_model(model, X_val, y_val, scaler_y)
        plot_predictions(y_val_rescaled, y_pred_rescaled)

        mse_scores.append(mse)
        mae_scores.append(mae)
        r2_scores.append(r2)

    average_mse = np.mean(mse_scores)
    average_mae = np.mean(mae_scores)
    average_r2 = np.mean(r2_scores)

    return {
        "average_mse": average_mse,
        "average_mae": average_mae,
        "average_r2": average_r2
    }

# Main script
if __name__ == "__main__":
    client = connect_to_mongodb()
    db_name = 'sensorData'  # Database name
    collection_name = 'sensordatas'  # Collection name

    raw_data = load_data_from_mongodb(client, db_name, collection_name)
    data = preprocess_data(raw_data)

    if data is not None:
        results = run_gru_model(data)
        print(json.dumps(results))  # Output the results as JSON
