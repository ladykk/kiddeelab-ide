import { Blocks, FieldTextInput, Block } from "blockly";
import componentLists from "../devices/components";
import { Pin, Variable, Function } from "../types/code";
import { Component } from "../types/component";
import { DeviceIds } from "../types/device";
import "./arduino";
import ArduinoGenerator from "./arduino";
import { ORDER } from "./arduino/generator";

export const COLOR = {
  MOTION: "#4C97FF",
  LOOKS: "#9966FF",
  SOUNDS: "#CF63CF",
  CONTROL: "#FFAB19",
  EVENTS: "#FFBF00",
  SENSING: "#5CB1D6",
  PEN: "#0FBD8C",
  OPERATOR: "#59C059",
  DATA: "#FF8C1A",
  MORE: "#FF6680",
  TEXT: "#575E75",
};

export const STRING_COLOR = COLOR.MORE;
export const NUMBER_COLOR = COLOR.OPERATOR;
export const BOOLEAN_COLOR = COLOR.LOOKS;
export const VOID_COLOR = COLOR.TEXT;
export const DEVICE_COLOR = COLOR.EVENTS;
export const COMPONENT_COLOR = COLOR.SENSING;

const createPin = (pin: Pin) => {
  let contents: Array<{ [index: string]: any }> = [
    {
      kind: "label",
      text: pin.name,
    },
  ];
  contents = [
    ...contents,
    {
      kind: "block",
      type: "pin_mode",
      inputs: {
        pin: {
          block: {
            type: "pin_define",
            fields: {
              pin: pin.name,
            },
          },
        },
      },
    },
    {
      kind: "block",
      type: "pin_digital_read",
      inputs: {
        pin: {
          block: {
            type: "pin_define",
            fields: {
              pin: pin.name,
            },
          },
        },
      },
    },
    {
      kind: "block",
      type: "pin_digital_write",
      inputs: {
        pin: {
          block: {
            type: "pin_define",
            fields: {
              pin: pin.name,
            },
          },
        },
        output: { block: { type: "pin_digital_output" } },
      },
    },
    {
      kind: "block",
      type: "pin_analog_read",
      inputs: {
        pin: {
          block: {
            type: "pin_define",
            fields: {
              pin: pin.name,
            },
          },
        },
      },
    },
    {
      kind: "block",
      type: "pin_analog_write",
      inputs: {
        pin: {
          block: {
            type: "pin_define",
            fields: {
              pin: pin.name,
            },
          },
        },
        output: { block: { type: "pin_pwm_output" } },
      },
    },
  ];
  return contents;
};

export const createPins = (pins: Array<Pin>) => {
  let contents: Array<{ [index: string]: any }> = [];
  pins.forEach((pin) => {
    contents = [...contents, ...createPin(pin)];
  });
  return {
    kind: "category",
    name: "Pins",
    colour: DEVICE_COLOR,
    contents,
  };
};

export const createComponents = (
  componenets: Array<Component>,
  deviceId: DeviceIds
) => {
  const available_components = deviceId
    ? componentLists.filter(
        (component) =>
          component.supported_devices === "*" ||
          component.supported_devices.includes(deviceId)
      )
    : [];
  let contents: Array<{ [index: string]: any }> = [];
  componenets.forEach((component) => {
    const component_detail = available_components.find(
      (available_component) => available_component.id === component.component
    );
    if (component_detail) {
      contents = [...contents, ...component_detail.blocks(component, deviceId)];
    }
  });
  return {
    kind: "category",
    name: "Component",
    colour: "#5CB1D6",
    contents: contents,
  };
};

const createVariable = (variable: Variable) => {
  let contents: Array<{ [index: string]: any }> = [
    {
      kind: "label",
      text: `${variable.name}${variable.size ? ` [${variable.size}]` : ""}`,
    },
  ];
  switch (variable.type) {
    case "Number":
      contents = [
        ...contents,
        {
          kind: "block",
          type: "variable_number_get",
          fields: { variable: variable.name },
        },
      ];
      if (!variable.size)
        contents = [
          ...contents,
          {
            kind: "block",
            type: "variable_number_set",
            fields: { variable: variable.name },
            inputs: {
              value: {
                block: {
                  type: "number_data",
                },
              },
            },
          },
          {
            kind: "block",
            type: "variable_number_op",
            fields: { variable: variable.name },
            inputs: {
              value: {
                block: {
                  type: "number_data",
                },
              },
            },
          },
        ];
      else
        contents = [
          ...contents,
          {
            kind: "block",
            type: "variable_number_get_array",
            fields: { variable: variable.name },
            inputs: {
              index: {
                block: {
                  type: "number_data",
                },
              },
            },
          },
          {
            kind: "block",
            type: "variable_number_set_array",
            fields: { variable: variable.name },
            inputs: {
              index: {
                block: {
                  type: "number_data",
                },
              },
              value: {
                block: {
                  type: "number_data",
                },
              },
            },
          },
          {
            kind: "block",
            type: "variable_number_op_array",
            fields: { variable: variable.name },
            inputs: {
              index: {
                block: {
                  type: "number_data",
                },
              },
              value: {
                block: {
                  type: "number_data",
                },
              },
            },
          },
        ];
      break;
    case "Logic":
      contents = [
        ...contents,
        {
          kind: "block",
          type: "variable_boolean_get",
          fields: { variable: variable.name },
        },
      ];
      if (!variable.size)
        contents = [
          ...contents,
          {
            kind: "block",
            type: "variable_boolean_set",
            fields: { variable: variable.name },
            inputs: {
              value: {
                block: {
                  type: "boolean_data",
                },
              },
            },
          },
        ];
      else
        contents = [
          ...contents,
          {
            kind: "block",
            type: "variable_boolean_get_array",
            fields: { variable: variable.name },
            inputs: {
              index: {
                block: {
                  type: "number_data",
                },
              },
            },
          },
          {
            kind: "block",
            type: "variable_boolean_set_array",
            fields: { variable: variable.name },
            inputs: {
              index: {
                block: {
                  type: "number_data",
                },
              },
              value: {
                block: {
                  type: "boolean_data",
                },
              },
            },
          },
        ];
      break;
    case "String":
      contents = [
        ...contents,
        {
          kind: "block",
          type: "variable_string_get",
          fields: { variable: variable.name },
        },
      ];
      if (!variable.size)
        contents = [
          ...contents,
          {
            kind: "block",
            type: "variable_string_set",
            fields: { variable: variable.name },
            inputs: {
              value: {
                block: {
                  type: "string_data",
                },
              },
            },
          },
        ];
      else
        contents = [
          ...contents,
          {
            kind: "block",
            type: "variable_string_get_array",
            fields: { variable: variable.name },
            inputs: {
              index: {
                block: {
                  type: "number_data",
                },
              },
            },
          },
          {
            kind: "block",
            type: "variable_string_set_array",
            fields: { variable: variable.name },
            inputs: {
              index: {
                block: {
                  type: "number_data",
                },
              },
              value: {
                block: {
                  type: "string_data",
                },
              },
            },
          },
        ];
      break;
  }
  return contents;
};

export const createVariables = (variables: Array<Variable>) => {
  let contents: Array<{ [index: string]: any }> = [];
  variables
    .sort((a, b) => (a.size ? 1 : 0) - (b.size ? 1 : 0))
    .forEach((variable) => {
      contents = [...contents, ...createVariable(variable)];
    });
  return {
    kind: "category",
    name: "Variable",
    colour: COLOR.PEN,
    contents,
  };
};

const createCallFunction = (func: Function) => {
  const block = `function_${func.return}_return_${func.args.length}`;
  if (!Blocks[block]) {
    Blocks[block] = {
      init: function () {
        this.appendDummyInput()
          .appendField("executes function:")
          .appendField(new FieldTextInput(""), "func");
        func.args.forEach((arg, i) => {
          this.appendValueInput(`arg_${i}`)
            .setCheck(null)
            .appendField(i === 0 ? "with" : ",");
        });
        this.setInputsInline(true);
        if (func.return === "Void") {
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
        } else {
          this.setOutput(true, func.return);
        }
        this.setTooltip("Execute function.");
        this.setColour(
          func.return === "Void"
            ? VOID_COLOR
            : func.return === "String"
            ? STRING_COLOR
            : func.return === "Logic"
            ? BOOLEAN_COLOR
            : NUMBER_COLOR
        );
        this.setHelpUrl("");
      },
    };
    ArduinoGenerator[block] = function (block: Block) {
      const args: Array<string> = [];
      for (let i = 0; i < func.args.length; i++) {
        args.push(
          ArduinoGenerator.valueToCode(block, `arg_${i}`, ORDER.ATOMIC)
        );
      }
      const func_name: string = block.getFieldValue("func");

      if (func.return === "Void") {
        return `${func_name}(${args.join(", ")});\n`;
      } else {
        return [`${func_name}(${args.join(", ")})`, ORDER.ATOMIC];
      }
    };
  }

  return block;
};

export const createFunctions = (functions: Array<Function>) => {
  let contents: Array<{ [index: string]: any }> = [];

  functions.forEach((func) => {
    let declare: { [index: string]: any } = {
      kind: "block",
      type: "function_declare",
      fields: { name: func.name },
    };

    if (func.return === "Void")
      declare = {
        ...declare,
        inputs: {
          return: {
            block: {
              type: "function_void",
            },
          },
        },
      };
    contents = [
      ...contents,
      {
        kind: "label",
        text: `${func.name}(${func.args.map((arg) => arg.name).join(", ")})`,
      },
      declare,
    ];

    contents = [
      ...contents,
      {
        kind: "block",
        type: createCallFunction(func),
        fields: {
          func: func.name,
        },
      },
    ];

    func.args.forEach(
      (arg) => (contents = [...contents, ...createVariable(arg)])
    );
  });

  contents = [
    ...contents,
    { kind: "label", text: "------------------------------" },
  ];

  return {
    kind: "category",
    name: "Function",
    colour: COLOR.DATA,
    contents,
  };
};
