import pandas as pd
import numpy as np
from sklearn.model_selection import TimeSeriesSplit
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import GRU, Dropout, Bidirectional, RepeatVector, TimeDistributed, Dense
from keras.callbacks import EarlyStopping
from keras.optimizers import Adam
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import matplotlib.pyplot as plt

# Constants
LOOKBACK_SIZE = 72
FORECAST_SIZE = 168
N_SPLITS = 10
BATCH_SIZE = 64
EPOCHS = 100
GRU_UNITS = 64
LEARNING_RATE = 0.0005
DROPOUT_RATE = 0.2

def load_data(filepath):
    #Load data from a CSV file.
    try:
        data = pd.read_csv(filepath)
    except FileNotFoundError as e:
        print(f"File not found. Please check the file path: {e}")
        return None
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

    data = data[['ObservationTimestamp', 'WaterTemperature', 'WaterPh', 'DissolvedOxygen']]
    data.dropna(inplace=True)
    data['ObservationTimestamp'] = pd.to_datetime(data['ObservationTimestamp'])
    return data

def feature_engineering(data):
    #Perform feature engineering on the dataset.
    data['Hour'] = data['ObservationTimestamp'].dt.hour
    data['Day'] = data['ObservationTimestamp'].dt.day
    data['Month'] = data['ObservationTimestamp'].dt.month
    return data

def split_data(data, features, targets):
    #Split data into features and targets and then into training and validation sets.
    X = data[features]
    y = data[targets]

    scaler_X = MinMaxScaler()
    scaler_y = MinMaxScaler()

    # Fit scaler on training data
    X_scaled = scaler_X.fit_transform(X)
    y_scaled = scaler_y.fit_transform(y)

    return X_scaled, y_scaled, scaler_X, scaler_y

def prepare_timeseries_data(X, y, lookback_size):
    #Convert time series data into sequences for model training and prediction.
    X_sequences, y_sequences = [], []

    for i in range(len(X) - lookback_size - FORECAST_SIZE + 1):
        X_sequences.append(X[i:i + lookback_size])
        y_sequences.append(y[i + lookback_size:i + lookback_size + FORECAST_SIZE])

    return np.array(X_sequences), np.array(y_sequences)

def train_gru_model(X_train, y_train, X_val, y_val, gru_units=GRU_UNITS, learning_rate=LEARNING_RATE, batch_size=BATCH_SIZE, epochs=EPOCHS, patience=15):
    #Train a GRU model.
    model = Sequential([
    GRU(gru_units, activation='relu', recurrent_activation='tanh', input_shape=(X_train.shape[1], X_train.shape[2])),
    RepeatVector(y_train.shape[1]),
    GRU(gru_units, activation='relu', recurrent_activation='tanh',
    return_sequences=True),
    TimeDistributed(Dense(y_train.shape[2], activation='linear')) # Output layer activation changed to linear
    ])
    optimizer = Adam(learning_rate=learning_rate)
    model.compile(optimizer=optimizer, loss='mse')
    early_stopping = EarlyStopping(monitor='val_loss', patience=patience, restore_best_weights=True)

    model.fit(X_train, y_train, epochs=epochs, batch_size=batch_size, validation_data=(X_val, y_val), callbacks=[early_stopping], verbose=1)
    return model

def evaluate_model(model, X_val, y_val, scaler_y):
    #Evaluate the trained model.
    y_pred = model.predict(X_val)
    y_pred_rescaled = scaler_y.inverse_transform(y_pred.reshape(-1, y_val.shape[2]))
    y_val_rescaled = scaler_y.inverse_transform(y_val.reshape(-1, y_val.shape[2]))

    mse = mean_squared_error(y_val_rescaled, y_pred_rescaled)
    mae = mean_absolute_error(y_val_rescaled, y_pred_rescaled)
    r2 = r2_score(y_val_rescaled, y_pred_rescaled)

    print("\nEvaluation Metrics for the validation set:")
    print("MSE:", mse)
    print("MAE:", mae)
    print("R-squared:", r2)

    return mse, mae, r2, y_val_rescaled, y_pred_rescaled

def plot_predictions(y_true, y_pred, title='Model Predictions vs Actual Data'):
    #Plot the actual vs predicted values.
    plt.figure(figsize=(10, 5))
    plt.plot(y_true, label='Actual')
    plt.plot(y_pred, label='Predicted')
    plt.title(title)
    plt.legend()
    plt.show()

#Main script
data = load_data('/content/drive/MyDrive/WaterQuality/WaQu_Resampledv2.csv')

if data is not None:
    data = feature_engineering(data)
    # Define your features and targets
    features = ['WaterTemperature', 'WaterPh', 'DissolvedOxygen', 'Hour', 'Day', 'Month']
    targets = ['WaterTemperature', 'WaterPh', 'DissolvedOxygen']

    X_scaled, y_scaled, scaler_X, scaler_y = split_data(data, features, targets)

    # Prepare the data for time series forecasting
    X_sequences, y_sequences = prepare_timeseries_data(X_scaled, y_scaled, LOOKBACK_SIZE)

    # TimeSeries Cross-validator
    tscv = TimeSeriesSplit(n_splits=N_SPLITS)

    # Initialize lists to store evaluation metrics for each split
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

# Average the scores after all splits
average_mse = np.mean(mse_scores)
average_mae = np.mean(mae_scores)
average_r2 = np.mean(r2_scores)

print(f"Average MSE: {average_mse}")
print(f"Average MAE: {average_mae}")
print(f"Average R2: {average_r2}")
