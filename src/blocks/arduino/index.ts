import { defineBlocksWithJsonArray, CodeGenerator, Block } from "blockly";
import { Variable, Function, Pin } from "../../types/code";
import blocks from "./block.json";

defineBlocksWithJsonArray(blocks);

let ArduinoGenerator = new CodeGenerator("arduino");

// > Precedance Order
export const ORDER = {
  ATOMIC: 0,
  MATH_SUBFIX: 1,
  MATH_PREFIX: 2,
  MATH_MUL_DIV: 3,
  MATH_ADD_SUB: 4,
  BITWISE_SHIFT: 5,
  RELATIONAL_COMP: 6,
  RELATIONAL_EQ: 7,
  BITWISE_AND: 8,
  BITWISE_XOR: 9,
  BITWISE_OR: 10,
  LOGICAL_AND: 11,
  LOGICAL_OR: 12,
  TERNARY: 13,
  ASSIGNMENT: 14,
  COMMA: 15,
  NONE: 99,
};

// > Join blocks
// @ts-ignore
ArduinoGenerator.scrub_ = function (block, code, opt_thisOnly) {
  const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  if (nextBlock && !opt_thisOnly) {
    return code + ArduinoGenerator.blockToCode(nextBlock);
  }
  return code;
};

// > Pin
ArduinoGenerator["pin_mode"] = function (block: Block) {
  const pin: string = ArduinoGenerator.valueToCode(block, "pin", ORDER.ATOMIC);
  const mode: string = block.getFieldValue("mode");
  return `pinMode(${pin}, ${mode});\n`;
};

ArduinoGenerator["pin_define"] = function (block: Block) {
  var pin = block.getFieldValue("pin");
  return [`${pin.toUpperCase()}`, ORDER.ATOMIC];
};

ArduinoGenerator["pin_digital_read"] = function (block: Block) {
  const pin: string = ArduinoGenerator.valueToCode(block, "pin", ORDER.ATOMIC);
  return [`digitalRead(${pin})`, ORDER.ATOMIC];
};

ArduinoGenerator["pin_digital_write"] = function (block: Block) {
  const output: string = ArduinoGenerator.valueToCode(
    block,
    "output",
    ORDER.ATOMIC
  );
  const pin: string = ArduinoGenerator.valueToCode(block, "pin", ORDER.ATOMIC);
  return `digitalWrite(${pin}, ${output});\n`;
};

ArduinoGenerator["pin_digital_output"] = function (block: Block) {
  const output: string = block.getFieldValue("output");
  return [output === "true" ? "HIGH" : "LOW", ORDER.ATOMIC];
};

ArduinoGenerator["pin_analog_read"] = function (block: Block) {
  const pin: string = ArduinoGenerator.valueToCode(block, "pin", ORDER.ATOMIC);
  return [`analogRead(${pin})`, ORDER.ATOMIC];
};

ArduinoGenerator["pin_analog_write"] = function (block: Block) {
  const output: number = Number(
    ArduinoGenerator.valueToCode(block, "output", ORDER.ATOMIC)
  );
  const pin: string = ArduinoGenerator.valueToCode(block, "pin", ORDER.ATOMIC);
  return `analogWrite(${pin}, ${output});\n`;
};

ArduinoGenerator["pin_pwm_output"] = function (block: Block) {
  const output: number = block.getFieldValue("output");
  return [`${output}`, ORDER.ATOMIC];
};

ArduinoGenerator["pin_detach_interrupt"] = function (block: Block) {
  const pin: string = ArduinoGenerator.valueToCode(block, "pin", ORDER.ATOMIC);
  return `detachInterrupt(digitalPinToInterrupt(${pin}));\n`;
};

// TODO: Implemented
ArduinoGenerator["pin_attach_interrupt"] = function (block: Block) {
  const pin: string = ArduinoGenerator.valueToCode(block, "pin", ORDER.ATOMIC);
  const mode: string = block.getFieldValue("mode");
  const isr: string = ArduinoGenerator.statementToCode(block, "isr");
  return `// NOT IMPLEMENTED\n`;
  const code = "...;\n";
  return code;
};

ArduinoGenerator["serial_begin"] = function (block: Block) {
  const output: string = ArduinoGenerator.valueToCode(
    block,
    "output",
    ORDER.ATOMIC
  );
  return `Serial.begin(${output});\n`;
};

ArduinoGenerator["serial_available"] = function (block: Block) {
  return ["Serial.available()", ORDER.ATOMIC];
};

ArduinoGenerator["serial_read_string"] = function (block: Block) {
  return ["Serial.readString()", ORDER.ATOMIC];
};

ArduinoGenerator["serial_read_string_until"] = function (block: Block) {
  const character: string = block.getFieldValue("character");
  return [`Serial.readStringUntil('${character}')`, ORDER.ATOMIC];
};

ArduinoGenerator["serial_print"] = function (block: Block) {
  const output: string = ArduinoGenerator.valueToCode(
    block,
    "output",
    ORDER.ATOMIC
  );
  return `Serial.print(${output});\n`;
};

ArduinoGenerator["serial_println"] = function (block: Block) {
  const output: string = ArduinoGenerator.valueToCode(
    block,
    "output",
    ORDER.ATOMIC
  );
  return `Serial.println(${output});\n`;
};

ArduinoGenerator["arduino_structure"] = function (block: Block) {
  const setup: string = ArduinoGenerator.statementToCode(block, "setup");
  const loop: string = ArduinoGenerator.statementToCode(block, "loop");
  return `-> structure\nvoid setup() {\n${setup}}\n\nvoid loop() {\n${loop}}\n-> end structure`;
};

ArduinoGenerator["control_wait"] = function (block: Block) {
  const period: number = Number(
    ArduinoGenerator.valueToCode(block, "period", ORDER.ATOMIC)
  );
  const unit: string = block.getFieldValue("unit");
  return `delay(${period * (unit === "seconds" ? 1000 : 1)});\n`;
};

ArduinoGenerator["control_repeat"] = function (block: Block) {
  const round: number = Number(
    ArduinoGenerator.valueToCode(block, "round", ORDER.ATOMIC)
  );
  const callback: string = ArduinoGenerator.statementToCode(block, "callback");
  return `for(int reserved_counter = 0; reserved_counter < ${round}; reserved_counter++) {\n${callback}}\n`;
};

ArduinoGenerator["control_wait_until"] = function (block: Block) {
  const condition: string = ArduinoGenerator.valueToCode(
    block,
    "condition",
    ORDER.ATOMIC
  );
  return `while(!(${condition}) {}\n`;
};

ArduinoGenerator["number_op2"] = function (block: Block) {
  const number1: number = Number(
    ArduinoGenerator.valueToCode(block, "number1", ORDER.ATOMIC)
  );
  const operator: string = block.getFieldValue("operator");
  const number2: number = Number(
    ArduinoGenerator.valueToCode(block, "number2", ORDER.ATOMIC)
  );
  switch (operator) {
    case "+":
      return [`${number1} + ${number2}`, ORDER.MATH_ADD_SUB];
    case "-":
      return [`${number1} - ${number2}`, ORDER.MATH_ADD_SUB];
    case "*":
      return [`${number1} * ${number2}`, ORDER.MATH_MUL_DIV];
    case "/":
      return [`(float) ${number1} / (float) ${number2}`, ORDER.MATH_MUL_DIV];
    case "%":
      return [`${number1} % ${number2}`, ORDER.MATH_MUL_DIV];
    default:
      return ["/* Unhandle */", ORDER.NONE];
  }
};

// TODO: implement include math.h
ArduinoGenerator["number_op1"] = function (block: Block) {
  const operator: string = block.getFieldValue("operator");
  const number: number = Number(
    ArduinoGenerator.valueToCode(block, "number", ORDER.ATOMIC)
  );
  switch (operator) {
    case "absolute":
      return [`abs(${number})`, ORDER.ATOMIC];
    case "round up":
      return [`ceil(${number})`, ORDER.ATOMIC];
    case "round down":
      return [`floor(${number})`, ORDER.ATOMIC];
    default:
      return ["/* Unhandle */", ORDER.NONE];
  }
};

ArduinoGenerator["number_random"] = function (block: Block) {
  const start: number = Number(
    ArduinoGenerator.valueToCode(block, "start", ORDER.ATOMIC)
  );
  const end: number = Number(
    ArduinoGenerator.valueToCode(block, "end", ORDER.ATOMIC)
  );
  return [`random(${start}, ${end})`, ORDER.ATOMIC];
};

ArduinoGenerator["boolean_data"] = function (block: Block) {
  const output: string = block.getFieldValue("output");
  switch (output) {
    case "true":
      return ["true", ORDER.ATOMIC];
    case "false":
      return ["false", ORDER.ATOMIC];
    default:
      return ["/* Unhandle */", ORDER.NONE];
  }
};

ArduinoGenerator["number_data"] = function (block: Block) {
  const output: number = Number(block.getFieldValue("output"));
  return [`${output}`, ORDER.ATOMIC];
};

ArduinoGenerator["control_if"] = function (block: Block) {
  const condition: string = ArduinoGenerator.valueToCode(
    block,
    "condition",
    ORDER.ATOMIC
  );
  const callback: string = ArduinoGenerator.statementToCode(block, "callback");
  return `if(${condition}) {\n${callback}}\n`;
};

ArduinoGenerator["control_else_if"] = function (block: Block) {
  const condition: string = ArduinoGenerator.valueToCode(
    block,
    "condition",
    ORDER.ATOMIC
  );
  const callback: string = ArduinoGenerator.statementToCode(block, "callback");
  return `else if(${condition}) {\n${callback}}\n`;
};

ArduinoGenerator["control_else"] = function (block: Block) {
  const callback: string = ArduinoGenerator.statementToCode(block, "callback");
  return `else {\n${callback}}\n`;
};

ArduinoGenerator["control_while"] = function (block: Block) {
  const condition: string = ArduinoGenerator.valueToCode(
    block,
    "condition",
    ORDER.ATOMIC
  );
  const callback: string = ArduinoGenerator.statementToCode(block, "callback");
  return `while(${condition}) {\n${callback}}\n`;
};

ArduinoGenerator["control_do_while"] = function (block: Block) {
  const callback: string = ArduinoGenerator.statementToCode(block, "callback");
  const condition: string = ArduinoGenerator.valueToCode(
    block,
    "condition",
    ORDER.ATOMIC
  );
  const code = `do {\n${callback}} while(${condition})\n`;
  return code;
};

ArduinoGenerator["control_for"] = function (block: Block) {
  const variable: string = block.getFieldValue("variable");
  const initial: number = Number(
    ArduinoGenerator.valueToCode(block, "initial", ORDER.ATOMIC)
  );
  const operator: string = block.getFieldValue("operator");
  const step: number = Number(
    ArduinoGenerator.valueToCode(block, "step", ORDER.ATOMIC)
  );
  const condition: string = ArduinoGenerator.valueToCode(
    block,
    "condition",
    ORDER.ATOMIC
  );
  const callback: string = ArduinoGenerator.statementToCode(block, "callback");
  const code = `for(int ${variable} = ${initial}; ${condition}; ${variable} = ${variable} ${operator} ${step}) {\n${callback}}\n`;
  return code;
};

ArduinoGenerator["boolean_op"] = function (block: Block) {
  const base: string = ArduinoGenerator.valueToCode(
    block,
    "base",
    ORDER.ATOMIC
  );
  const operator: string = block.getFieldValue("operator");
  const comparator: string = ArduinoGenerator.valueToCode(
    block,
    "comparator",
    ORDER.ATOMIC
  );
  return [`${base} ${operator} ${comparator}`, ORDER.ATOMIC];
};

ArduinoGenerator["number_compare"] = function (block: Block) {
  const base: string = ArduinoGenerator.valueToCode(
    block,
    "base",
    ORDER.ATOMIC
  );
  const operator: string = block.getFieldValue("operator");
  const comparator: string = ArduinoGenerator.valueToCode(
    block,
    "comparator",
    ORDER.ATOMIC
  );
  return [`${base} ${operator} ${comparator}`, ORDER.ATOMIC];
};

ArduinoGenerator["boolean_not"] = function (block: Block) {
  const base: string = ArduinoGenerator.valueToCode(
    block,
    "base",
    ORDER.ATOMIC
  );
  return [`!(${base})`, ORDER.ATOMIC];
};

ArduinoGenerator["string_data"] = function (block: Block) {
  const output: string = block.getFieldValue("output");
  return [`"${output}"`, ORDER.ATOMIC];
};

ArduinoGenerator["join_string"] = function (block: Block) {
  const base = ArduinoGenerator.valueToCode(block, "base", ORDER.ATOMIC);
  const add = ArduinoGenerator.valueToCode(block, "add", ORDER.ATOMIC);
  return [`${base} + ${add}`, ORDER.ATOMIC];
};

ArduinoGenerator["char_at"] = function (block: Block) {
  const index: number = Number(block.getFieldValue("index"));
  const base: string = ArduinoGenerator.valueToCode(
    block,
    "base",
    ORDER.ATOMIC
  );
  return [`${base}.charAt(${index})`, ORDER.ATOMIC];
};

ArduinoGenerator["string_length"] = function (block: Block) {
  const base: string = ArduinoGenerator.valueToCode(
    block,
    "base",
    ORDER.ATOMIC
  );
  return [`${base}.length()`, ORDER.ATOMIC];
};

ArduinoGenerator["string_compare"] = function (block: Block) {
  const base: string = ArduinoGenerator.valueToCode(
    block,
    "base",
    ORDER.ATOMIC
  );
  const comparator: string = ArduinoGenerator.valueToCode(
    block,
    "comparator",
    ORDER.ATOMIC
  );
  return [`${base}.equals(${comparator})`, ORDER.ATOMIC];
};

ArduinoGenerator["variable_number_get"] =
  ArduinoGenerator["variable_string_get"] =
  ArduinoGenerator["variable_boolean_get"] =
    function (block: Block) {
      const variable: string = block.getFieldValue("variable");

      return [`${variable}`, ORDER.ATOMIC];
    };

ArduinoGenerator["variable_number_set"] =
  ArduinoGenerator["variable_string_set"] =
  ArduinoGenerator["variable_boolean_set"] =
    function (block: Block) {
      const variable: string = block.getFieldValue("variable");
      const value: string = ArduinoGenerator.valueToCode(
        block,
        "value",
        ORDER.ATOMIC
      );
      return `${variable} = ${value};\n`;
    };

ArduinoGenerator["variable_number_op"] = function (block: Block) {
  const op: string = block.getFieldValue("op");
  const variable: string = block.getFieldValue("variable");
  const value: string = ArduinoGenerator.valueToCode(
    block,
    "value",
    ORDER.ATOMIC
  );

  return `${variable} = ${variable} ${op} ${value};\n`;
};

ArduinoGenerator["variable_number_get_array"] =
  ArduinoGenerator["variable_string_get_array"] =
  ArduinoGenerator["variable_boolean_get_array"] =
    function (block: Block) {
      const variable: string = block.getFieldValue("variable");
      const index: string = ArduinoGenerator.valueToCode(
        block,
        "index",
        ORDER.ATOMIC
      );

      return [`${variable}[${index}]`, ORDER.ATOMIC];
    };

ArduinoGenerator["variable_number_set_array"] =
  ArduinoGenerator["variable_string_set_array"] =
  ArduinoGenerator["variable_boolean_set_array"] =
    function (block: Block) {
      const variable: string = block.getFieldValue("variable");
      const index: string = ArduinoGenerator.valueToCode(
        block,
        "index",
        ORDER.ATOMIC
      );
      const value: string = ArduinoGenerator.valueToCode(
        block,
        "value",
        ORDER.ATOMIC
      );
      return `${variable}[${index}] = ${value};\n`;
    };

ArduinoGenerator["variable_number_op_array"] = function (block: Block) {
  const op: string = block.getFieldValue("op");
  const variable: string = block.getFieldValue("variable");
  const index: string = ArduinoGenerator.valueToCode(
    block,
    "index",
    ORDER.ATOMIC
  );
  const value: string = ArduinoGenerator.valueToCode(
    block,
    "value",
    ORDER.ATOMIC
  );

  return `${variable}[${index}] = ${variable} ${op} ${value};\n`;
};

ArduinoGenerator["function_declare"] = function (block: Block) {
  const func_name: string = block.getFieldValue("name");
  const statements: string = ArduinoGenerator.statementToCode(
    block,
    "statements"
  );
  const return_value: string = ArduinoGenerator.valueToCode(
    block,
    "return",
    ORDER.ATOMIC
  );

  return `-> declare function: ${func_name}\n${statements}  return${
    return_value ? ` ${return_value}` : ""
  };`;
};

ArduinoGenerator["function_void"] = function (block: Block) {
  return "";
};

ArduinoGenerator["sensor_ultrasonic_read"] = function (block: Block) {
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

ArduinoGenerator["sensor_dht_declare"] = function (block: Block) {
  const pin: string = ArduinoGenerator.valueToCode(block, "pin", ORDER.ATOMIC);
  return `-> declare dht: DHT dht(${pin}, DHT22);\n`;
};

ArduinoGenerator["sensor_dht_begin"] = function (block: Block) {
  return `dht.begin();\n`;
};

ArduinoGenerator["sensor_dht_read_humidity"] = function (block: Block) {
  return [`dht.readHumidity()`, ORDER.ATOMIC];
};

ArduinoGenerator["sensor_dht_read_temperature"] = function (block: Block) {
  const unit: string = block.getFieldValue("unit");
  return [`dht.readTemperature(${unit === "F" ? "true" : ""})`, ORDER.ATOMIC];
};

ArduinoGenerator["sensor_dht_read_heat_index"] = function (block: Block) {
  return [
    `dht.computeHeatIndex(dht.readTemperature(), dht.readHumidity(), false)`,
    ORDER.ATOMIC,
  ];
};

export const codeFormator = (
  raw: string,
  pins: Array<Pin>,
  variables: Array<Variable>,
  functions: Array<Function>
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
