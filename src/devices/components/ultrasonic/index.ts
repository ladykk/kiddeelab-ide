import { Block, defineBlocksWithJsonArray } from "blockly";
import ArduinoGenerator from "../../../blocks/arduino";
import { ORDER } from "../../../blocks/arduino/generator";
import { ComponentDetail } from "../../../types/component";
import blocks from "./ultrasonic.json";

defineBlocksWithJsonArray(blocks);

ArduinoGenerator["component_ultrasonic_read"] = function (block: Block) {
  const trig: string = ArduinoGenerator.valueToCode(
    block,
    "trig",
    ORDER.ATOMIC
  );
  const echo: string = ArduinoGenerator.valueToCode(
    block,
    "echo",
    ORDER.ATOMIC
  );

  return [`readUltrasonic(${trig}, ${echo})`, ORDER.ATOMIC];
};

const Ultrasonic: ComponentDetail = {
  id: "ultrasonic",
  name: "Ultrasonic",
  pins: ["TRIG", "ECHO"],
  supported_devices: "*",
  blocks: (component, deviceId) => {
    return [
      {
        kind: "label",
        text: `${component.name} (Ultrasonic)`,
      },
      {
        kind: "block",
        type: "component_ultrasonic_read",
        inputs: {
          trig: {
            block: {
              type: "pin_define",
              fields: {
                pin: component.pins[0].pin,
              },
            },
          },
          echo: {
            block: {
              type: "pin_define",
              fields: {
                pin: component.pins[1].pin,
              },
            },
          },
        },
      },
    ];
  },
  function_declare: (component, deviceId) => [
    "double readUltrasonic(int trigPin, int echoPin) {\n  pinMode(trigPin, OUTPUT);\n  digitalWrite(trigPin, LOW);\n  delayMicroseconds(2);\n  digitalWrite(trigPin, HIGH);\n  delayMicroseconds(5);\n  digitalWrite(trigPin, LOW);\n  pinMode(echoPin, INPUT);\n  return pulseIn(echoPin, HIGH) / 29.0 / 2.0;\n}",
  ],
};

export default Ultrasonic;
