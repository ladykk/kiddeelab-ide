import { Device } from "../../../types/device";
import { defineBlocksWithJsonArray, Block } from "blockly";
import blocks from "./blocks.json";
import toolbox from "./toolbox.json";
import pic from "./pic.png";
import ArduinoGenerator, { ORDER } from "../../../blocks/arduino";

defineBlocksWithJsonArray(blocks);

ArduinoGenerator["pin_esp_32"] = function (block: Block) {
  var pin = block.getFieldValue("pin");
  return [`${pin.toUpperCase()}`, ORDER.ATOMIC];
};

export default {
  id: "esp32:esp32:esp32",
  name: "ESP32",
  platform: "esp32:esp32",
  pic,
  toolbox,
} as Device;
