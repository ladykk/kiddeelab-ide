export type VariableTypes = "String" | "Number" | "Logic";

export type Variable = {
  name: string;
  type: VariableTypes;
  size?: 0;
};

export type FunctionReturn = "Void" | "Number" | "String" | "Logic";

export type Function = {
  name: string;
  args: Array<Variable>;
  return: FunctionReturn;
};
