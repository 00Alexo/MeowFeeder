/*
  MeowFeeder IR-Controlled Stepper Motor Controller
  Controls stepper motor for feeding mechanism via IR remote
*/
#include <Arduino.h>
#include <WiFi.h>
#include <IRrecv.h>
#include <IRremoteESP8266.h>
#include <IRutils.h>
#include "secrets.h"

// WiFi credentials from secrets.h
const char* ssid = WIFI_SSID;
const char* password = WIFI_PASSWORD;

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
const int feedSteps = 256; // 1/4 rotation for feeding

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
const int stepDelay = 1; // Milliseconds between steps

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

// IR receiver setup
IRrecv irrecv(IR_RECV_PIN);
decode_results results;

// The IR code we're looking for (from your remote device)
const uint32_t FEED_IR_CODE = 0xFFE01F;

void turnOffMotor() {
  // Turn off all coils to save power and prevent heating
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, LOW);
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
  
  // Turn off all stepper coils initially
  turnOffMotor();
  
  // Initialize IR receiver
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
  
  Serial.println("Setup complete! Ready for feeding...");
  Serial.println("Waiting for IR signal or 'feed' command...");
  Serial.println("IR Receiver is listening on pin 27...");
  Serial.println("Send 'test' command to verify IR receiver is working");
  Serial.println("---");
}

void stepMotor(int direction) {
  // Only step if enough time has passed
  if (millis() - lastStepTime >= stepDelay) {
    // Set the motor pins according to the step sequence
    digitalWrite(IN1, stepSequence[currentStep][0]);
    digitalWrite(IN2, stepSequence[currentStep][1]);
    digitalWrite(IN3, stepSequence[currentStep][2]);
    digitalWrite(IN4, stepSequence[currentStep][3]);
    
    // Move to next step
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
  // Check for IR signals
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
    
    // Check if it's our feeding code
    if (results.value == FEED_IR_CODE && feedState == IDLE) {
      Serial.println("*** FEED IR CODE RECEIVED - Starting feed sequence ***");
      feedState = MOVING_TO_FEED;
    } else if (results.value == FEED_IR_CODE && feedState != IDLE) {
      Serial.println("Feed sequence already in progress, ignoring IR signal");
    }
    
    Serial.println("---");
    irrecv.resume(); // Prepare for next value
  }
  
  // Check for serial commands
  if (Serial.available() > 0) {
    String command = Serial.readString();
    command.trim();
    
    if (command == "feed" && feedState == IDLE) {
      Serial.println("*** FEED COMMAND RECEIVED - Starting feed sequence ***");
      feedState = MOVING_TO_FEED;
    } else if (command == "feed" && feedState != IDLE) {
      Serial.println("Feed sequence already in progress, ignoring command");
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
    }
  }
   
  // Handle feeding sequence state machine
  switch (feedState) {
    case IDLE:
      // Do nothing, wait for command
      break;
      
    case MOVING_TO_FEED:
      // Move stepper toward feed position
      if (currentPosition < feedSteps) {
        stepMotor(1); // Move forward
        Serial.print("Moving to feed position: ");
        Serial.print(currentPosition);
        Serial.print("/");
        Serial.println(feedSteps);
      } else {
        // Reached feed position
        Serial.println("Reached feed position - waiting 2 seconds");
        feedState = WAITING_AT_FEED;
        waitStartTime = millis();
        turnOffMotor(); // Save power while waiting
      }
      break;
      
    case WAITING_AT_FEED:
      // Wait for 2 seconds at feed position
      if (millis() - waitStartTime >= WAIT_DURATION) {
        Serial.println("Wait complete - returning to home");
        feedState = RETURNING_HOME;
      }
      break;
      
    case RETURNING_HOME:
      // Move stepper back to home position
      if (currentPosition > 0) {
        stepMotor(-1); // Move backward
        Serial.print("Returning home: ");
        Serial.print(currentPosition);
        Serial.println(" steps remaining");
      } else {
        // Back at home position
        Serial.println("Feed sequence complete - back at home");
        feedState = IDLE;
        turnOffMotor();
      }
      break;
  }
}