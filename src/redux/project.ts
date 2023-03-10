import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Blockly, { WorkspaceSvg } from "blockly";
import { DeviceIds } from "../types/device";
import deviceLists from "../devices";
import { defaultOptions } from "../configs/workspace";
import { RootState } from "./store";
import { Variable, Function, Pin } from "../types/code";
import { ToolboxDefinition } from "blockly/core/utils/toolbox";
import {
  createComponents,
  createFunctions,
  createPins,
  createVariables,
} from "../blocks";
import { ProjectJson } from "../types/project";
import { readProjectJson } from "../utils/file";
import { Component } from "../types/component";

type State = {
  workspace: WorkspaceSvg | null;
  deviceId: DeviceIds | null;
  port: string;
  showCode: boolean;
  pins: Array<Pin>;
  components: Array<Component>;
  variables: Array<Variable>;
  functions: Array<Function>;
  isChange: boolean;
};

export type ProjectState = State;

const initialState: State = {
  workspace: null,
  deviceId: null,
  port: "",
  showCode: false,
  pins: [],
  components: [],
  variables: [],
  functions: [],
  isChange: false,
};

const injectWorkspace = (
  pins: Array<Pin>,
  components: Array<Component>,
  variables: Array<Variable>,
  functions: Array<Function>,
  deviceId?: DeviceIds
): WorkspaceSvg =>
  Blockly.inject("blocklyDiv", {
    ...defaultOptions,
    toolbox: createToolbox(pins, components, variables, functions, deviceId),
  });

const createToolbox = (
  pins: Array<Pin>,
  components: Array<Component>,
  variables: Array<Variable>,
  functions: Array<Function>,
  deviceId?: DeviceIds | null
) => {
  if (!deviceId) return undefined;
  let toolbox: {
    kind: "categoryToolbox";
    contents: Array<{ [index: string]: any }>;
  } = {
    kind: "categoryToolbox",
    contents: [],
  };
  if (
    components.length > 0 ||
    pins.length > 0 ||
    variables.length > 0 ||
    functions.length > 0
  ) {
    if (components.length > 0)
      toolbox.contents.push(createComponents(components, deviceId));
    if (pins.length > 0) toolbox.contents.push(createPins(pins));
    if (variables.length > 0) toolbox.contents.push(createVariables(variables));
    if (functions.length > 0) toolbox.contents.push(createFunctions(functions));
    toolbox.contents.push({ kind: "sep" });
  }

  toolbox.contents = [
    //@ts-ignore
    ...deviceLists[deviceId].toolbox.contents,
    ...toolbox.contents,
  ];
  // @ts-ignore
  return toolbox as ToolboxDefinition;
};

const slice = createSlice({
  name: "project",
  initialState,
  reducers: {
    initWorkspace: (state) => {
      return {
        ...initialState,
        workspace: injectWorkspace(
          state.pins,
          state.components,
          state.variables,
          state.functions
        ),
      } as State;
    },
    setProjectName: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        projectName: action.payload,
        isChange: true,
      };
    },
    setDeviceId: (state, action: PayloadAction<DeviceIds>) => {
      return {
        ...state,
        workspace: injectWorkspace(
          state.pins,
          state.components,
          state.variables,
          state.functions,
          action.payload
        ),
        deviceId: action.payload,
        isChange: true,
      };
    },
    setShowCode: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        showCode: action.payload,
      };
    },
    addPin: (state, action: PayloadAction<Pin>) => {
      if (!state.workspace) return state;
      const new_pins = [...state.pins, action.payload];
      state.workspace.updateToolbox(
        createToolbox(
          new_pins,
          state.components,
          state.variables,
          state.functions,
          state.deviceId
        ) ?? null
      );
      state.pins = new_pins;
      return state;
    },
    removePin: (state, action: PayloadAction<string>) => {
      if (!state.workspace) return state;
      const new_pins = state.pins.filter((v) => v.name !== action.payload);
      state.workspace.updateToolbox(
        createToolbox(
          new_pins,
          state.components,
          state.variables,
          state.functions,
          state.deviceId
        ) ?? null
      );
      state.pins = new_pins;
      return state;
    },
    addComponent: (state, action: PayloadAction<Component>) => {
      if (!state.workspace) return state;
      const new_components = [...state.components, action.payload];
      state.workspace.updateToolbox(
        createToolbox(
          state.pins,
          new_components,
          state.variables,
          state.functions,
          state.deviceId
        ) ?? null
      );
      state.components = new_components;
      return state;
    },
    removeComponent: (state, action: PayloadAction<string>) => {
      if (!state.workspace) return state;
      const new_components = state.components.filter(
        (v) => v.name !== action.payload
      );
      state.workspace.updateToolbox(
        createToolbox(
          state.pins,
          new_components,
          state.variables,
          state.functions,
          state.deviceId
        ) ?? null
      );
      state.components = new_components;
      return state;
    },
    addVariable: (state, action: PayloadAction<Variable>) => {
      if (!state.workspace) return state;
      const new_variables = [...state.variables, action.payload];
      state.workspace.updateToolbox(
        createToolbox(
          state.pins,
          state.components,
          new_variables,
          state.functions,
          state.deviceId
        ) ?? null
      );
      state.variables = new_variables;
      return state;
    },
    removeVariable: (state, action: PayloadAction<string>) => {
      if (!state.workspace) return state;
      const new_variables = state.variables.filter(
        (v) => v.name !== action.payload
      );
      state.workspace.updateToolbox(
        createToolbox(
          state.pins,
          state.components,
          new_variables,
          state.functions,
          state.deviceId
        ) ?? null
      );
      state.variables = new_variables;
      return state;
    },
    addFunction: (state, action: PayloadAction<Function>) => {
      if (!state.workspace) return state;
      const new_functions = [...state.functions, action.payload];
      state.workspace.updateToolbox(
        createToolbox(
          state.pins,
          state.components,
          state.variables,
          new_functions,
          state.deviceId
        ) ?? null
      );
      state.functions = new_functions;
      return state;
    },
    removeFunction: (state, action: PayloadAction<string>) => {
      if (!state.workspace) return state;
      const new_functions = state.functions.filter(
        (f) => f.name !== action.payload
      );
      state.workspace.updateToolbox(
        createToolbox(
          state.pins,
          state.components,
          state.variables,
          new_functions,
          state.deviceId
        ) ?? null
      );
      state.functions = new_functions;

      return state;
    },
    loadProjectJson: (state, action: PayloadAction<ProjectJson>) => {
      const workspace = injectWorkspace(
        action.payload.pins,
        action.payload.components,
        action.payload.variables,
        action.payload.functions,
        action.payload.deviceId
      );
      const json = readProjectJson(workspace, action.payload);
      return {
        ...state,
        ...json,
        workspace: workspace,
        isChange: false,
      };
    },
    setChange: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        isChange: action.payload,
      };
    },
    setPort: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        port: action.payload,
      };
    },
  },
});

export const {
  initWorkspace,
  setProjectName,
  setDeviceId,
  setShowCode,
  addPin,
  removePin,
  addComponent,
  removeComponent,
  addVariable,
  removeVariable,
  addFunction,
  removeFunction,
  loadProjectJson,
  setChange,
  setPort,
} = slice.actions;
export default slice.reducer;

export const selectProject = (state: RootState) => state.project;
