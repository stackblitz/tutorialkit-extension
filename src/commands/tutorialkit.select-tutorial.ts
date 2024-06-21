import * as vscode from 'vscode';
import isTutorialKitWorkspace from '../utils/isTutorialKit';
import { cmd } from '.';

export async function selectTutorial(context: vscode.ExtensionContext) {
  const tutorialWorkpaces = (vscode.workspace.workspaceFolders || []).filter(
    isTutorialKitWorkspace,
  );
  const selectedWorkspace =
    tutorialWorkpaces.length === 1
      ? tutorialWorkpaces[0]
      : await vscode.window
          .showQuickPick(
            tutorialWorkpaces.map((workspace) => workspace.name),
            {
              placeHolder: 'Select a workspace',
            },
          )
          .then((selected) =>
            tutorialWorkpaces.find((workspace) => workspace.name === selected),
          );

  if (selectedWorkspace) {
    cmd.loadTutorial(context, selectedWorkspace.uri);
  }
}
