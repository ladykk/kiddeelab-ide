export type Toast = {
  id: string;
  title: string;
  type: "default" | "success" | "warning" | "failure" | "update" | "loading";
  message?: string;
  timeout?: number;
};
