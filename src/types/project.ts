import { Variable, Function, Pin } from "./code";
import { DeviceIds } from "./device";

export type ProjectJson = {
  projectName: string;
  workspace: { [index: string]: any };
  deviceId: DeviceIds;
  pins: Array<Pin>;
  variables: Array<Variable>;
  functions: Array<Function>;
};

export type OpenResult =
  | {
      status: "success";
      path: string;
      data: ProjectJson;
    }
  | { status: "canceled" };

export type SaveResult =
  | {
      status: "success";
      path: string;
    }
  | { status: "canceled" };

export type BuildResult =
  | {
      status: "success";
      reason: string;
      output: string;
    }
  | {
      status: "error";
      reason: string;
      error: Error;
    };
