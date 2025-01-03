#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

#define LED_BUILTIN 2 // Built-in LED pin (can be used as a switch)

// WiFi credentials
const char* ssid = "TP-Link_18AC";
const char* wifiPassword = "9647192731@Wb";

// Server details
const char* server = "https://iot-backend-cvd6.onrender.com"; // Replace with the actual IP or domain
const char* loginEndpoint = "/api/auth/login";
const char* refreshEndpoint = "/api/auth/refresh-token";

// User credentials
const char* userEmail = "washimbari0001@gmail.com";
const char* userPassword = "12345678";

// Global variables for tokens
String accessToken = "";
String refreshToken = "";

// Flag to indicate the state of the switch (LED)
bool isLoggedIn = false;

void setup() {
  Serial.begin(115200);
  pinMode(LED_BUILTIN, OUTPUT);

  // Connect to WiFi
  WiFi.begin(ssid, wifiPassword);
  Serial.println("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi!");

  // Attempt login
  if (login()) {
    Serial.println("Login successful!");
    digitalWrite(LED_BUILTIN, HIGH);  // Turn LED on if login is successful
    isLoggedIn = true;
  } else {
    Serial.println("Login failed!");
    digitalWrite(LED_BUILTIN, LOW);   // Turn LED off if login failed
    isLoggedIn = false;
  }
}

bool login() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = String(server) + loginEndpoint;

    // Prepare JSON payload for login
    String jsonPayload = "{\"email\":\"" + String(userEmail) + "\",\"password\":\"" + String(userPassword) + "\"}";
    Serial.println("Sending login payload: " + jsonPayload);  // Debugging the payload

    // Begin HTTP POST request
    http.begin(url);
    http.addHeader("Content-Type", "application/json");

    // Send POST request with payload
    int httpResponseCode = http.POST(jsonPayload);

    // Check the response code
    if (httpResponseCode > 0) {
      String response = http.getString();  // Get response payload
      Serial.println("Response: ");
      Serial.println(response);

      // Parse the JSON response
      DynamicJsonDocument doc(1024);
      DeserializationError error = deserializeJson(doc, response);
      if (error) {
        Serial.println("Failed to parse response");
        http.end();
        return false;
      }
      
      // Check if accessToken and refreshToken exist in the response
      if (doc.containsKey("accessToken") && doc.containsKey("refreshToken")) {
        accessToken = doc["accessToken"].as<String>();
        refreshToken = doc["refreshToken"].as<String>();
        http.end();
        return true;  // Login successful
      } else {
        Serial.println("Access or refresh token missing in response");
        http.end();
        return false;  // Token missing
      }
    } else {
      Serial.println("HTTP request failed with code " + String(httpResponseCode));
      http.end();
      return false;
    }
  }
  return false;
}

bool refreshAccessToken() {
  if (WiFi.status() == WL_CONNECTED && refreshToken != "") {
    HTTPClient http;
    String url = String(server) + refreshEndpoint;

    // Prepare JSON payload for refresh
    String jsonPayload = "{\"refreshToken\":\"" + refreshToken + "\"}";
    
    // Begin HTTP POST request
    http.begin(url);
    http.addHeader("Content-Type", "application/json");

    // Send POST request with payload
    int httpResponseCode = http.POST(jsonPayload);

    // Check the response code
    if (httpResponseCode > 0) {
      String response = http.getString();  // Get response payload
      Serial.println("Response: ");
      Serial.println(response);

      // Parse the JSON response
      DynamicJsonDocument doc(1024);
      DeserializationError error = deserializeJson(doc, response);
      if (error) {
        Serial.println("Failed to parse response");
        http.end();
        return false;
      }

      // Save new access token
      accessToken = doc["accessToken"].as<String>();
      http.end();
      return true; // Token refreshed
    } else {
      Serial.println("HTTP request failed with code " + String(httpResponseCode));
      http.end();
      return false;
    }
  }
  return false;
}

void loop() {
  // In this case, we don't need to do anything here
  // The LED is controlled based on login success or failure in setup()
  delay(10000);  // Delay to prevent unnecessary repeated checks
}
