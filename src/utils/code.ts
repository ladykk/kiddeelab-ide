export const convertName = (name: string) =>
  name
    .split("")
    .map((c) => (c === " " ? "_" : c))
    .join("");

export const convertDefine = (name: string) => convertName(name).toUpperCase();
