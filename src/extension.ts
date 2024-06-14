import * as vscode from 'vscode';
import { useCommands } from './commands';
import { useLessonTree } from './views/lessonsTree';

export function activate(context: vscode.ExtensionContext) {
  useCommands();
  useLessonTree(context);
}

export function deactivate() {}
