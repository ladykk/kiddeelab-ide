import componentLists from "../../devices/components";
import { Variable, Function, Pin } from "../../types/code";
import { Device } from "../../types/device";

import ArduinoGenerator from "./generator";
import "./boolean";
import "./control";
import "./number";
import "./pin";
import "./serial";
import "./string";
import "./wifi";
import { Component } from "../../types/component";

export const codeFormator = (
  raw: string,
  pins: Array<Pin>,
  components: Array<Component>,
  variables: Array<Variable>,
  functions: Array<Function>,
  device: Device
) => {
  const split = raw.split("-> ").map((s) => s.trim());

  const modules = new Set();
  const defines = new Set();
  const declare_variables = new Set();
  const declare_functions = new Set();

  // Declare pins
  pins.map((p) => `#define ${p.name} ${p.pin}`).forEach((p) => defines.add(p));

  // Declare variables
  variables
    .map(
      (v) =>
        `${
          v.type === "Logic"
            ? "bool"
            : v.type === "String"
            ? "String"
            : "double"
        }${v.size ? `[${v.size}]` : ""} ${v.name}`
    )
    .forEach((v) => declare_variables.add(v));

  // Declare functions
  const split_functions = split.filter((s) => s.startsWith("declare function"));
  split_functions.forEach((s, index) => {
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
    declare_functions.add(format);
  });

  // Decalre components
  components.forEach((component) => {
    console.log(component);
    const component_detail = componentLists.find(
      (c) => c.id === component.component
    );
    if (!component_detail) return;

    if (component_detail.module_declare)
      component_detail
        .module_declare(component, device.id)
        .forEach((m) => modules.add(m));
    if (component_detail.define_declare)
      component_detail
        .define_declare(component, device.id)
        .forEach((d) => defines.add(d));
    if (component_detail.variable_declare)
      component_detail
        .variable_declare(component, device.id)
        .forEach((v) => declare_variables.add(v));
    if (component_detail.function_declare)
      component_detail
        .function_declare(component, device.id)
        .forEach((f) => declare_functions.add(f));
  });

  // Arduino Structure
  const structure =
    split.find((s) => s.startsWith("structure"))?.substring(10) ?? "";

  // Retrives Dependencies
  raw.split("\n").forEach((line) => {
    const trim_line = line.trim();

    if (trim_line.includes("WiFi.")) {
      modules.add("#include <WiFi.h>");
    } else if (trim_line.includes("server.")) {
      if (device.id === "esp32:esp32:esp32") {
        const code = device.code;
        if (!code) return;
        code["server."].modules.forEach((module) => modules.add(module));
        code["server."].declare_variables.forEach((variable) =>
          declare_variables.add(variable)
        );
        code["server."].func_dependencies.forEach((func) =>
          declare_functions.add(func)
        );
      }
    }
  });

  return `${Array.from(modules).join("\n") + (modules.size > 0 ? "\n\n" : "")}${
    Array.from(defines).join("\n") + (defines.size > 0 ? "\n\n" : "")
  }${
    Array.from(declare_variables).join(";\n") +
    (declare_variables.size > 0 ? ";\n\n" : "")
  }${
    Array.from(declare_functions).join(";\n") +
    (declare_functions.size > 0 ? "\n\n" : "")
  }${structure}`;
};

export default ArduinoGenerator;
