int pinTemp = A1;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int temp = analogRead(pinTemp);    //Read the analog pin
  temp = temp * 0.48828125;   // convert output (mv) to readable celcius
  Serial.print("Temperature: ");
  Serial.print("Tuva");
  Serial.print(temp);
  Serial.println("C");  //print the temperature status
  delay(1000);
   
  if (Serial.available() > 0) {
    char incomingChar = Serial.read();
    
    if (incomingChar == 'A') {
      Serial.println("Command A received");
    } else if (incomingChar == 'B') {
      Serial.println("Command B received");
	    int pitch = map(160,0,200, 50, 4000);
	    tone(8,pitch,20);
    }
  }
}


