int pinTemp = A1;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int temp = analogRead(pinTemp);    
  temp = temp * 0.48828125;   
  Serial.print("Temperature: ");
  Serial.print(temp);
  Serial.println("C");  
  delay(1000);
  
  if (Serial.available() > 0) {
    char incomingChar = Serial.read();
    if (incomingChar == 'A') {
      Serial.println("Command timer on received");
	    int pitch = map(160,0,200, 50, 4000);
	    tone(8,pitch,20);
    }
  }
}