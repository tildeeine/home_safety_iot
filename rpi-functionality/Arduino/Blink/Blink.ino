void setup() {
  Serial.begin(9600);
}

void loop() {
  if (Serial.available() > 0) {
    char incomingChar = Serial.read();
    // Process incoming command
    if (incomingChar == 'A') {
      Serial.println("Command A received");
    } else if (incomingChar == 'B') {
	Serial.println("Command B received");
	int pitch = map(160,0,200, 50, 4000);
	tone(8,pitch,20);
    }
  }
}
