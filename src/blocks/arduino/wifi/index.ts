import { defineBlocksWithJsonArray, Block } from "blockly";
import ArduinoGenerator from "../generator";
import blocks from "./wifi.json";

defineBlocksWithJsonArray(blocks);

ArduinoGenerator["wifi_begin"] = function (block: Block) {
  const ssid: string = block.getFieldValue("ssid");
  const password: string = block.getFieldValue("password");
  return `WiFi.begin("${ssid}", "${password}");\nSerial.print("Connecting to WiFi");\nwhile (WiFi.status() != WL_CONNECTED) {\n  delay(1000);\n  Serial.print(".");\n}\nSerial.println();\nSerial.print("Connected to the WiFi network with IP Address: ");\nSerial.println(WiFi.localIP());\n`;
};

export default {};
