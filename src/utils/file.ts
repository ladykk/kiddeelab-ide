import { serialization, WorkspaceSvg } from "blockly";
import { setFile } from "../redux/file";
import {
  initWorkspace,
  loadProjectJson,
  ProjectState,
  setChange,
} from "../redux/project";
import { AppDispatch } from "../redux/store";
import { OpenResult, ProjectJson } from "../types/project";

export const createProjectJson = (
  project: ProjectState
): ProjectJson | null => {
  if (!project.workspace || !project.deviceId) return null;
  const workspace = serialization.workspaces.save(project.workspace);
  return {
    projectName: project.projectName,
    workspace: workspace,
    deviceId: project.deviceId,
    variables: project.variables,
    functions: project.functions,
  };
};

export const readProjectJson = (workspace: WorkspaceSvg, json: ProjectJson) => {
  serialization.workspaces.load(json.workspace, workspace);
  return {
    projectName: json.projectName,
    deviceId: json.deviceId,
    variables: json.variables,
    functions: json.functions,
  };
};

export const newProject = (dispatch: AppDispatch) => {
  dispatch(initWorkspace());
  dispatch(setFile(""));
};

export const handleLoadProject = async (
  dispatch: AppDispatch,
  path: string
) => {
  if (!path) return;
  const result = await window.file.openFile(path);
  if (result.status === "success") {
    dispatch(loadProjectJson(result.data));
    dispatch(setFile(result.path));
  }
};

export const handleSaveFile = async (
  dispatch: AppDispatch,
  project: ProjectState,
  file?: string
) => {
  const json = createProjectJson(project);
  if (!json) return;
  const result = await window.file.saveFile(json, file ? file : undefined);
  if (result.status === "success") {
    dispatch(setFile(result.path));
    dispatch(setChange(false));
  }
};
