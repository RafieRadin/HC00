#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "DFRobot_ESP_PH.h"
#include <OneWire.h>
#include "DallasTemperature.h"
#include <Wire.h>

#define PH_PIN 36
#define DS18B20_PIN 26
#define DO_SENSOR_ADDR 39
#define ESPADC 4096.0
#define ESPVOLTAGE 3300
#define SERVER_URL "https://x3p7x3rl-1337.asse.devtunnels.ms/api/sensor/upload"
#define WIFI_SSID "Rafie"
#define WIFI_PASSWORD "2P7h0Y8y"

OneWire oneWire(DS18B20_PIN);
DallasTemperature sensors(&oneWire);
DFRobot_ESP_PH ph;

float voltage, phValue, temperature = 25;
float dissolvedOxygen = 0.0;

void setup() {
  Serial.begin(115200);
  connectWifi();
  sensors.begin();
  ph.begin();
}

void connectWifi() {
  Serial.println("Connecting to WiFi...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi");
}

void sendRequest(String jsonString) {
  HTTPClient http;
  http.begin(SERVER_URL);
  http.addHeader("Content-Type", "application/json");
  int httpResponseCode = http.POST(jsonString);

  if (httpResponseCode > 0) {
    Serial.printf("HTTP Response code: %d\n", httpResponseCode);
  } else {
    Serial.printf("Error code: %d\n", httpResponseCode);
  }
  http.end();
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    StaticJsonDocument<300> doc;
    doc["temperature"] = readTemperature();
    doc["ph"] = readPh();
    doc["dissolvedOxygen"] = readDissolvedOxygen();

    String jsonString;
    serializeJson(doc, jsonString);

    sendRequest(jsonString);

    delay(60000);  // Add a delay to avoid sending data too frequently

    ph.calibration(voltage, temperature);
  } else {
    connectWifi();
  }
}

float readPh() {
  voltage = analogRead(PH_PIN) / ESPADC * ESPVOLTAGE;
  return ph.readPH(voltage, temperature);
}

float readTemperature() {
  sensors.requestTemperatures();
  return sensors.getTempCByIndex(0);
}

float readDissolvedOxygen() {
  Wire.beginTransmission(DO_SENSOR_ADDR);
  Wire.write(0x01);
  Wire.endTransmission();
  delay(500);

  Wire.requestFrom(DO_SENSOR_ADDR, 4);
  if (Wire.available() >= 4) {
    uint32_t rawData;
    Wire.readBytes((char*)&rawData, 4);
    return *((float*)&rawData);
  } else {
    return -1.0;
  }
}
