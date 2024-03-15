int pinTemp = A1;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int temp = analogRead(pinTemp);    //Read the analog pin
  temp = temp * 0.48828125;   // convert output (mv) to readable celcius
  Serial.print("Temperature: ");
  Serial.print(temp);
  Serial.println("C");  //print the temperature status
  delay(1000);
  
  if (Serial.available() > 0) {
    String incomingString = Serial.readString();
    Serial.println("Command received");

    if (incomingString == 'timer off') {
      Serial.println("Command off received");
    } else if (incomingString == 'timer on') {
      Serial.println("Command timer on received");
	    int pitch = map(160,0,200, 50, 4000);
	    tone(8,pitch,20);
    }
  }
}


