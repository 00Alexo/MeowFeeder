/*
  MeowFeeder IR-Controlled Stepper Motor Controller
  Controls stepper motor for feeding mechanism via IR remote and WebSocket
  
  Feeding events are tracked via WebSocket messages to connected clients
*/
#include <Arduino.h>
#include <WiFi.h>
#include <WebSocketsServer.h>
#include <ArduinoJson.h>
#include <IRrecv.h>
#include <IRremoteESP8266.h>
#include <IRutils.h> 
#include "secrets.h"

// WiFi credentials from secrets.h
const char* ssid = WIFI_SSID;
const char* password = WIFI_PASSWORD;

// WebSocket server on port 81
WebSocketsServer webSocket = WebSocketsServer(81);

// Device information
String deviceId = "6866adc4845d2990e46152df";
String deviceName = "MeowFeeder Main Unit";

// IR receiver pin
const uint16_t IR_RECV_PIN = 27;

// LED pin
#define PIN_LED 2

// Stepper motor pins 
#define IN1 19
#define IN2 18
#define IN3 5
#define IN4 4

// Stepper motor settings
const int stepsPerRevolution = 2048;
const int feedSteps = 512; // 1/4 rotation for feeding

// Step sequence for 28BYJ-48 (full-step mode)
int stepSequence[4][4] = {
  {1, 0, 0, 1},
  {1, 1, 0, 0},
  {0, 1, 1, 0},
  {0, 0, 1, 1}
};

// Motor control variables
int currentStep = 0;
int currentPosition = 0;
unsigned long lastStepTime = 0;
const int stepDelay = 3; // Milliseconds between steps - proper timing for 28BYJ-48

// Feeding sequence variables
enum FeedState {
  IDLE,
  MOVING_TO_FEED,
  WAITING_AT_FEED,
  RETURNING_HOME
};

FeedState feedState = IDLE;
unsigned long waitStartTime = 0;
const unsigned long WAIT_DURATION = 2000; // 2 seconds

// Feed tracking
unsigned long lastFeedTime = 0;
int dailyFeedCount = 0;
unsigned long lastDayReset = 0;

// IR receiver setup
IRrecv irrecv(IR_RECV_PIN);
decode_results results;

// The IR code we're looking for (from your remote device)
const uint32_t FEED_IR_CODE = 0xFFE01F;

void turnOffMotor() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, LOW);
}

void sendDeviceStatus() {
  DynamicJsonDocument doc(512);
  doc["type"] = "device_status";
  doc["deviceId"] = deviceId;
  doc["deviceName"] = deviceName;
  doc["status"] = (feedState == IDLE) ? "idle" : "feeding";
  doc["lastFeedTime"] = lastFeedTime;
  doc["dailyFeedCount"] = dailyFeedCount;
  doc["currentPosition"] = currentPosition;
  doc["feedSteps"] = feedSteps;
  doc["wifiSignal"] = WiFi.RSSI();
  doc["uptime"] = millis();
  
  String message;
  serializeJson(doc, message);
  webSocket.broadcastTXT(message);
  
  Serial.println("Status sent: " + message);
}

void sendFeedResponse(bool success, String message) {
  DynamicJsonDocument doc(256);
  doc["type"] = "feed_response";
  doc["deviceId"] = deviceId;
  doc["success"] = success;
  doc["message"] = message;
  doc["timestamp"] = millis();
  
  String response;
  serializeJson(doc, response);
  webSocket.broadcastTXT(response);
  
  Serial.println("Feed response: " + response);
}

void handleWebSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED:
      Serial.printf("[%u] Disconnected!\n", num);
      break;
      
    case WStype_CONNECTED: {
      IPAddress ip = webSocket.remoteIP(num);
      Serial.printf("[%u] Connected from %d.%d.%d.%d url: %s\n", num, ip[0], ip[1], ip[2], ip[3], payload);
      
      sendDeviceStatus();
      break;
    }
    
    case WStype_TEXT: {
      Serial.printf("[%u] Received: %s\n", num, payload);
      
      DynamicJsonDocument doc(256);
      DeserializationError error = deserializeJson(doc, payload);
      
      if (error) {
        Serial.print("JSON parsing failed: ");
        Serial.println(error.c_str());
        return;
      }
      
      String command = doc["command"];
      String targetDeviceId = doc["deviceId"];
      
      if (targetDeviceId != deviceId && targetDeviceId != "") {
        Serial.println("Command not for this device, ignoring");
        return;
      }
      
      if (command == "feed_now") {
        if (feedState == IDLE) {
          Serial.println("*** WEBSOCKET FEED COMMAND - Starting feed sequence ***");
          feedState = MOVING_TO_FEED;
          sendFeedResponse(true, "Feed sequence started");
        } else {
          Serial.println("Feed sequence already in progress");
          sendFeedResponse(false, "Feed sequence already in progress");
        }
      } else if (command == "get_status") {
        sendDeviceStatus();
      } else if (command == "stop_feed") {
        if (feedState != IDLE) {
          Serial.println("*** STOP FEED COMMAND - Stopping feed sequence ***");
          feedState = RETURNING_HOME;
          sendFeedResponse(true, "Feed sequence stopped, returning home");
        } else {
          sendFeedResponse(false, "No feed sequence in progress");
        }
      }
      break;
    }
    
    case WStype_BIN:
      Serial.printf("[%u] Received binary length: %u\n", num, length);
      break;
      
    default:
      break;
  }
}

void startFeedSequence(String source) {
  if (feedState == IDLE) {
    Serial.println("*** FEED SEQUENCE STARTED from " + source + " ***");
    feedState = MOVING_TO_FEED;
    lastFeedTime = millis();
    dailyFeedCount++;
    
    sendFeedResponse(true, "Feed sequence started from " + source);
  } else {
    Serial.println("Feed sequence already in progress, ignoring " + source + " command");
  }
}

void setup() {
  Serial.begin(115200);
  Serial.println("MeowFeeder IR-Controlled Stepper Motor Controller");
  
  // Initialize LED pin
  pinMode(PIN_LED, OUTPUT);
  digitalWrite(PIN_LED, LOW);
  
  // Initialize stepper pins
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);
  
  turnOffMotor();
  
  irrecv.enableIRIn();
  Serial.println("IR Receiver initialized on pin 27");
  
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println();
  Serial.print("WiFi connected! IP: ");
  Serial.println(WiFi.localIP());
  
  webSocket.begin();
  webSocket.onEvent(handleWebSocketEvent);
  Serial.println("WebSocket server started on port 81");
  Serial.print("WebSocket URL: ws://");
  Serial.print(WiFi.localIP());
  Serial.println(":81");
  
  lastDayReset = millis();
  
  Serial.println("Setup complete! Ready for feeding...");
  Serial.println("Device ID: " + deviceId);
  Serial.println("Device Name: " + deviceName);
  Serial.println("Waiting for IR signal, WebSocket command, or 'feed' serial command...");
  Serial.println("IR Receiver is listening on pin 27...");
  Serial.println("WebSocket server listening on port 81...");
  Serial.println("Send 'test' command to verify IR receiver is working");
  Serial.println("---");
}

void stepMotor(int direction) {
  if (millis() - lastStepTime >= stepDelay) {
    digitalWrite(IN1, stepSequence[currentStep][0]);
    digitalWrite(IN2, stepSequence[currentStep][1]);
    digitalWrite(IN3, stepSequence[currentStep][2]);
    digitalWrite(IN4, stepSequence[currentStep][3]);
    
    delayMicroseconds(1000); // Small delay to ensure coils energize
    
    if (direction > 0) {
      currentStep = (currentStep + 1) % 4; // Clockwise
      currentPosition++;
    } else {
      currentStep = (currentStep - 1 + 4) % 4; // Counter-clockwise
      currentPosition--;
    }
    
    lastStepTime = millis();
  }
}

void loop() {
  webSocket.loop();
  
  if (millis() - lastDayReset > 86400000) { // 24 hours in milliseconds
    dailyFeedCount = 0;
    lastDayReset = millis();
    Serial.println("Daily feed count reset");
  }
  
  if (irrecv.decode(&results)) {
    Serial.println("*** IR SIGNAL RECEIVED! ***");
    Serial.print("Protocol: ");
    Serial.println(typeToString(results.decode_type));
    Serial.print("Code: 0x");
    Serial.println(results.value, HEX);
    Serial.print("Bits: ");
    Serial.println(results.bits);
    Serial.println("Raw data:");
    Serial.println(resultToHumanReadableBasic(&results));
    
    if (results.value == FEED_IR_CODE) {
      startFeedSequence("IR Remote");
    }
    
    Serial.println("---");
    irrecv.resume(); // Prepare for next value
  }
  
  if (Serial.available() > 0) {
    String command = Serial.readString();
    command.trim();
    
    if (command == "feed") {
      startFeedSequence("Serial");
    } else if (command == "status") {
      sendDeviceStatus();
    } else if (command == "test") {
      Serial.println("*** IR RECEIVER TEST ***");
      Serial.println("IR Receiver pin: 27");
      Serial.println("Expected IR code: 0x00FFE01F");
      Serial.println("Press your remote button now...");
      Serial.println("If you don't see any IR signals, check:");
      Serial.println("1. IR receiver wiring (VCC, GND, Signal to pin 27)");
      Serial.println("2. Remote device is sending signals");
      Serial.println("3. Distance between devices (try closer)");
      Serial.println("---");
    } else if (command == "reset") {
      dailyFeedCount = 0;
      currentPosition = 0;
      feedState = IDLE;
      turnOffMotor();
      Serial.println("Device reset complete");
      sendDeviceStatus();
    }
  }
   
  switch (feedState) {
    case IDLE:
      break;
      
    case MOVING_TO_FEED:
      if (currentPosition < feedSteps) {
        stepMotor(1);
        if (currentPosition % 100 == 0) {
          Serial.print("Moving to feed position: ");
          Serial.print(currentPosition);
          Serial.print("/");
          Serial.println(feedSteps);
        }
      } else {
        Serial.println("Reached feed position - waiting 2 seconds");
        feedState = WAITING_AT_FEED;
        waitStartTime = millis();
        turnOffMotor();
      }
      break;
      
    case WAITING_AT_FEED:
      if (millis() - waitStartTime >= WAIT_DURATION) {
        Serial.println("Wait complete - returning to home");
        feedState = RETURNING_HOME;
      }
      break;
      
    case RETURNING_HOME:
      if (currentPosition > 0) {
        stepMotor(-1);
        if (currentPosition % 100 == 0) {
          Serial.print("Returning home: ");
          Serial.print(currentPosition);
          Serial.println(" steps remaining");
        }
      } else {
        Serial.println("Feed sequence complete - back at home");
        feedState = IDLE;
        turnOffMotor();
        
        DynamicJsonDocument doc(256);
        doc["type"] = "feed_complete";
        doc["deviceId"] = deviceId;
        doc["message"] = "Feed sequence completed successfully";
        doc["dailyCount"] = dailyFeedCount;
        doc["timestamp"] = millis();
        doc["recordFeeding"] = true; // Signal to frontend to record in backend
        
        String message;
        serializeJson(doc, message);
        webSocket.broadcastTXT(message);
        
        delay(100);
        
        sendDeviceStatus();
        
        Serial.println("*** FEED SEQUENCE COMPLETE - STATUS SENT ***");
      }
      break;
  }
}