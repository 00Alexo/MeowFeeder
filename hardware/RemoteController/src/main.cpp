#include <Arduino.h>
// #include <IRrecv.h>
#include <IRsend.h>
#include <IRremoteESP8266.h>
// #include <IRutils.h>

// const uint16_t IR_RECV_PIN = 21; // Infrared receiving pin
const uint16_t BUTTON_PIN = 22;  // Button pin
const uint16_t IR_LED_PIN = 15;  // IR LED pin
const uint16_t GREEN_LED_PIN = 18; // Green LED pin

// IRrecv irrecv(IR_RECV_PIN);
IRsend irsend(IR_LED_PIN);
// decode_results results;

void setup() {
  Serial.begin(115200);
  Serial.println("=== ESP32 IR Remote Controller ===");
  
  // Configure pins
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(IR_LED_PIN, OUTPUT);
  pinMode(GREEN_LED_PIN, OUTPUT);
  digitalWrite(IR_LED_PIN, LOW);
  digitalWrite(GREEN_LED_PIN, LOW);
  
  // Initialize IR receiver
  // irrecv.enableIRIn();
  
  // Initialize IR sender
  irsend.begin();
  
  Serial.println("IR Sender initialized and ready...");
  Serial.println("Press button to send IR signal");
  Serial.println("10 second cooldown between button presses");
  Serial.println("---");
}

void loop() {
  // Check for IR signals
  /*
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
    Serial.println("---");
    
    irrecv.resume(); // Prepare for next value
  }
  */
  
  // Check button press to send proper IR signal
  static bool lastButtonState = HIGH;
  static unsigned long lastButtonPressTime = 0;
  bool currentButtonState = digitalRead(BUTTON_PIN);
  
  if (currentButtonState == LOW && lastButtonState == HIGH) {
    // Check if 10 seconds have passed since last button press
    if (millis() - lastButtonPressTime >= 10000) {
      Serial.println("Button pressed! Sending proper IR signal...");
      
      // Send a proper NEC IR signal (most common protocol)
      // This sends a specific code that the receiver can decode
      irsend.sendNEC(0x00FFE01F, 32); // Send NEC code
      
      Serial.println("Proper IR signal sent! (NEC protocol, code: 0x00FFE01F)");
      
      // Light up green LED to indicate successful signal transmission
      digitalWrite(GREEN_LED_PIN, HIGH);
      delay(500); // Keep green LED on for 500ms
      digitalWrite(GREEN_LED_PIN, LOW);
      
      Serial.println("Green LED: Signal confirmed sent successfully!");
      Serial.println("Button on 10 second cooldown...");
      
      // Update last button press time
      lastButtonPressTime = millis();
    } else {
      // Calculate remaining cooldown time
      unsigned long remainingTime = 10000 - (millis() - lastButtonPressTime);
      Serial.print("Button on cooldown! Wait ");
      Serial.print(remainingTime / 1000);
      Serial.println(" more seconds...");
    }
    
    // Wait for button release
    while(digitalRead(BUTTON_PIN) == LOW) {
      delay(10);
    }
  }
  
  lastButtonState = currentButtonState;
  delay(100); // Small delay
}