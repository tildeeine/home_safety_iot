const int pinTemp = A1;
const int motorPin = 9;

void setup() {
  Serial.begin(9600);
  pinMode(pinTemp, INPUT);
  pinMode(motorPin, OUTPUT);
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
      analogWrite(motorPin, 200);
      delay(2000);
      analogWrite(motorPin, 0);
    } else if (incomingChar == 'B') {
      Serial.println("Command kill switch received");
      analogWrite(motorPin, 50);
      delay(2000);
      analogWrite(motorPin, 0);
    }
  }
}
