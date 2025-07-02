#include <Arduino.h>

// Define the LED pin (commonly pin 2 for ESP32 boards, or pin 13 for Arduino)
#define LED_PIN 2  // Change this to the correct pin if your Freenove board uses a different pin

void setup() {
  // Initialize serial communication for debugging
  Serial.begin(9600);
  
  // Set the LED pin as an output
  pinMode(LED_PIN, OUTPUT);
  
  Serial.println("LED Blink Started!");
}

void loop() {
  // Turn the LED on
  digitalWrite(LED_PIN, HIGH);
  Serial.println("LED ON");
  delay(1000);  // Wait for 1 second
  
  // Turn the LED off
  digitalWrite(LED_PIN, LOW);
  Serial.println("LED OFF");
  delay(1000);  // Wait for 1 second
}