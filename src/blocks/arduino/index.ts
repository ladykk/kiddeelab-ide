import { Variable, Function, Pin } from "../../types/code";
import { Device } from "../../types/device";

import ArduinoGenerator from "./generator";
import "./boolean";
import "./component";
import "./control";
import "./number";
import "./pin";
import "./serial";
import "./string";
import "./wifi";

export const codeFormator = (
  raw: string,
  pins: Array<Pin>,
  variables: Array<Variable>,
  functions: Array<Function>,
  device: Device
) => {
  const split = raw.split("-> ").map((s) => s.trim());

  // Declare pins
  const declare_pins = new Set();
  pins
    .map((p) => `#define ${p.name} ${p.pin}`)
    .forEach((p) => declare_pins.add(p));

  // Declare variables
  const declare_variables = new Set();
  variables
    .map(
      (v) =>
        `${
          v.type === "Logic"
            ? "bool"
            : v.type === "String"
            ? "String"
            : "double"
        }${v.size ? `[${v.size}]` : ""} ${v.name};`
    )
    .forEach((v) => declare_variables.add(v));

  // Declare functions
  const split_functions = split.filter((s) => s.startsWith("declare function"));
  const declare_functions = split_functions.map((s, index) => {
    const func_name = s.split("\n")[0].substring(18);
    const func = functions.find((f) => f.name === func_name);
    if (!func) return "";
    const format = `${
      func.return === "Logic"
        ? "bool"
        : func.return === "String"
        ? "String"
        : func.return === "Void"
        ? "void"
        : "double"
    } ${func.name}(${func.args
      .map(
        (a) =>
          `${
            a.type === "Logic"
              ? "bool"
              : a.type === "String"
              ? "String"
              : "double"
          }${a.size ? `[${a.size}]` : ""} ${a.name}`
      )
      .join(", ")}) {${s.substring(s.split("\n")[0].length)}${
      index + 1 === split_functions.length ? "\n" : ""
    }}\n`;
    return format;
  });

  // Arduino Structure
  const structure =
    split.find((s) => s.startsWith("structure"))?.substring(10) ?? "";

  // Declare Dependencies
  const module_dependencies = new Set();
  const func_dependencies = new Set();

  // Retrives Dependencies
  raw.split("\n").forEach((line) => {
    const trim_line = line.trim();
    console.log(trim_line);
    if (trim_line.includes("readUltrasonic("))
      func_dependencies.add(
        "double readUltrasonic(int trigPin, int echoPin) {\n  pinMode(trigPin, OUTPUT);\n  digitalWrite(trigPin, LOW);\n  delayMicroseconds(2);\n  digitalWrite(trigPin, HIGH);\n  delayMicroseconds(5);\n  digitalWrite(trigPin, LOW);\n  pinMode(echoPin, INPUT);\n  return pulseIn(echoPin, HIGH) / 29.0 / 2.0;\n}"
      );
    else if (trim_line.includes("dht.")) {
      const declare = split.find((s) => s.startsWith("declare dht:"));
      if (!declare) return;
      module_dependencies.add("#include <DHT.h>");
      declare_variables.add(declare.substring(13).replaceAll("\n", ""));
    } else if (trim_line.includes("WiFi.")) {
      module_dependencies.add("#include <WiFi.h>");
    } else if (trim_line.includes("server.")) {
      if (device.id === "esp32:esp32:esp32") {
        const code = device.code;
        if (!code) return;
        code["server."].module_dependencies.forEach((module) =>
          module_dependencies.add(module)
        );
        code["server."].declare_variables.forEach((variable) =>
          declare_variables.add(variable)
        );
        code["server."].func_dependencies.forEach((func) =>
          func_dependencies.add(func)
        );
      }
    }
  });

  return `${
    Array.from(module_dependencies).join("\n") +
    (module_dependencies.size > 0 ? "\n\n" : "")
  }${
    Array.from(declare_pins).join("\n") + (declare_pins.size > 0 ? "\n\n" : "")
  }${
    Array.from(declare_variables).join("\n") +
    (declare_variables.size > 0 ? "\n\n" : "")
  }${
    declare_functions.join("\n") + (declare_functions.length > 0 ? "\n\n" : "")
  }${
    Array.from(func_dependencies).join("\n") +
    (func_dependencies.size > 0 ? "\n" : "")
  }${structure}`;
};

export default ArduinoGenerator;
