import { Device } from "../../../types/device";
import { defineBlocksWithJsonArray, Block } from "blockly";
import blocks from "./blocks.json";
import toolbox from "./toolbox.json";
import pic from "./pic.png";
import ArduinoGenerator, { ORDER } from "../../../blocks/arduino";

defineBlocksWithJsonArray(blocks);

ArduinoGenerator["pin_arduino_uno"] = function (block: Block) {
  var pin = block.getFieldValue("pin");
  return [`${pin.toUpperCase()}`, ORDER.ATOMIC];
};

export default {
  id: "arduino:avr:uno",
  name: "Arduino UNO",
  platform: "arduino:avr",
  bootRequired: false,
  pins: [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "A0",
    "A1",
    "A2",
    "A3",
    "A4",
    "A5",
  ],
  pic,
  toolbox,
} as Device;
