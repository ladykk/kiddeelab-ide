import { DevicePort } from "./device";
import { OpenResult, ProjectJson, SaveResult, BuildResult } from "./project";

export {};

declare global {
  interface Window {
    file: {
      openFile: (path?: string) => Promise<OpenResult>;
      saveFile: (project: ProjectJson, path?: string) => Promise<SaveResult>;
    };
    build: {
      verify: (fqbn: string, code: string) => Promise<BuildResult>;
      upload: (
        port: string,
        fqbn: string,
        code: string
      ) => Promise<BuildResult>;
    };
    device: {
      fetchDevice: () => Promise<Array<DevicePort>>;
    };
    core: {
      isInstalled: () => Promise<boolean>;
      updateIndex: () => Promise<boolean>;
      installList: () => Promise<Array<string>>;
      installCore: (platform: string) => Promise<boolean>;
    };
  }
}
