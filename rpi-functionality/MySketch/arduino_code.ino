int pinTemp = A1;   //This is where our Output data goes

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
      Serial.println("Command A received");
    } else if (incomingChar == 'B') {
      Serial.println("Command B received");
      int pitch = map(temp,0,200, 50, 4000);
      tone(8,pitch,20);
    }
  }
}