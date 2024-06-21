import * as vscode from 'vscode';
import isTutorialKitWorkspace from '../utils/isTutorialKit';
import { cmd } from '.';

export async function initializeTutorialKit(context: vscode.ExtensionContext) {
  const tutorialWorkpaces = (vscode.workspace.workspaceFolders || []).filter(
    isTutorialKitWorkspace,
  );
  if (tutorialWorkpaces.length === 1) {
    cmd.loadTutorial(context, tutorialWorkpaces[0].uri);
    vscode.commands.executeCommand('setContext', 'tutorialkit:tree', true);
  } else if (tutorialWorkpaces.length > 1) {
    vscode.commands.executeCommand(
      'setContext',
      'tutorialkit:multiple-tutorials',
      true,
    );
  }
}
