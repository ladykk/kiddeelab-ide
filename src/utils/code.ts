export const convertName = (name: string) =>
  name
    .split("")
    .map((c) => (c === " " ? "_" : c))
    .join("");

export const convertVariableName = (name: string) =>
  convertName(name).toLowerCase();

export const convertDefine = (name: string) => convertName(name).toUpperCase();
