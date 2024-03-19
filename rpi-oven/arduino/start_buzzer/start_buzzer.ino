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
<<<<<<<< HEAD:rpi-oven/arduino/start_buzzer/start_buzzer.ino
    if (incomingChar == 'A') {
========
    Serial.println("Command received");

    if (incomingChar == 'X') {
      Serial.println("Command off received");
    } else if (incomingChar == 'A') {
>>>>>>>> main:rpi-oven/Arduino/Blink/Blink.ino
      Serial.println("Command timer on received");
	    int pitch = map(160,0,200, 50, 4000);
	    tone(8,pitch,20);
    }
  }
}
