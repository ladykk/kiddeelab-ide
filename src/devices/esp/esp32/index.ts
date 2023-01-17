import { Device } from "../../../types/device";
import { defineBlocksWithJsonArray, Block } from "blockly";
import blocks from "./blocks.json";
import toolbox from "./toolbox.json";
import pic from "./pic.png";
import pinout from "./pinout.png";
import ArduinoGenerator, { ORDER } from "../../../blocks/arduino";

defineBlocksWithJsonArray(blocks);

ArduinoGenerator["pin_esp_32"] = function (block: Block) {
  var pin = block.getFieldValue("pin");
  return [`${pin.toUpperCase()}`, ORDER.ATOMIC];
};

ArduinoGenerator["wifi_digital_status"] = function (block: Block) {
  return 'server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){\n  request->send_P(200, "text/html", webPage().c_str());\n});\nserver.on("/update", HTTP_GET, [](AsyncWebServerRequest *request){\n  request->send_P(200, "text/plain", readAllDigitalPins().c_str());\n});\nserver.begin();\nSerial.print("Digital Pins Status can be access on: http://");\nSerial.print(WiFi.localIP());\nSerial.println("/");\n';
};

export default {
  id: "esp32:esp32:esp32",
  name: "ESP32",
  platform: "esp32:esp32",
  bootRequired: true,
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
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
    "32",
    "33",
    "34",
    "35",
    "36",
    "37",
    "38",
    "39",
  ],
  pic,
  pinout,
  toolbox,
  code: {
    "server.": {
      module_dependencies: ["#include <ESPAsyncWebSrv.h>"],
      declare_variables: ["AsyncWebServer server(80);"],
      func_dependencies: [
        'String readAllDigitalPins() {\n  String output = "";\n  for(int pin = 0; pin < 40; pin++) {\n    output += pin;\n    output += ":";\n    output += digitalRead(pin);\n    if(pin < 39) output += ",";\n  }\n  return output;\n}',
        `String webPage() {\n  return "${'<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8" /> <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <meta name="viewport" content="width=device-width, initial-scale=1.0" /> <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.2/flowbite.min.css" rel="stylesheet" /> <title>ESP32 Status</title> </head> <body class="bg-gray-50"> <div class="w-full max-w-2xl mx-auto bg-white shadow-lg p-8 flex flex-col gap-6 justify-center" style="min-height: 100vh" > <img src="https://cdn.shopify.com/s/files/1/0609/6011/2892/files/doc-esp32-pinout-reference-wroom-devkit.png" alt="" /> <div id="pins" class="grid grid-cols-4 gap-x-4 gap-y-3"></div> </div> <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.2/flowbite.min.js"></script> <script> const pins_div = document.getElementById("pins"); const ports = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", ]; ports.forEach((port) => { const pin = document.createElement("div"); pin.classList.add("flex", "items-center", "justify-between", "my-2"); pin.innerHTML = ` <div class="flex items-center justify-between gap-2 w-full px-1.5 py-2 rounded-lg shadow-md"> <p id="pin${port}_label" class="font-bold">${port}: LOW</p> <div id="pin${port}_led" class="w-5 h-5 rounded-full bg-red-500"></div> </div> `; pins_div.appendChild(pin); }); setInterval(() => { let xhttp = new XMLHttpRequest(); xhttp.onreadystatechange = function () { if (this.readyState == 4 && this.status == 200) { const pins = this.responseText.split(",").map((pin) => { const result = pin.split(":"); return { pin: result[0], value: result[1] === "1" ? "HIGH" : "LOW", }; }); pins.forEach((pin) => { const label = document.getElementById(`pin${pin.pin}_label`); const led = document.getElementById(`pin${pin.pin}_led`); label.innerHTML = `${pin.pin}: ${pin.value}`; led.classList.add( pin.value === "HIGH" ? "bg-green-500" : "bg-red-500" ); led.classList.remove( pin.value === "HIGH" ? "bg-red-500" : "bg-green-500" ); }); } }; xhttp.open("GET", "http://192.168.0.20/update", true); xhttp.send(); }, 100); </script> </body> </html>'
          .split('"')
          .join('\\"')}";\n}`,
      ],
    },
  },
} as Device;
