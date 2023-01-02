import { DeviceLists } from "../types/device";
import arduinoUno from "./arduino/uno";
import esp32 from "./esp/esp32";

export default {
  "arduino:avr:uno": arduinoUno,
  "esp32:esp32:esp32": esp32,
} as DeviceLists;
