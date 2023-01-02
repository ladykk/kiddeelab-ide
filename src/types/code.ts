export type VariableTypes = "String" | "Number" | "Boolean";

export type Variable = {
  name: string;
  type: VariableTypes;
  size?: 0;
};

export type FunctionReturn = "Void" | "Number" | "String" | "Boolean";

export type Function = {
  name: string;
  args: Array<Variable>;
  return: FunctionReturn;
};
