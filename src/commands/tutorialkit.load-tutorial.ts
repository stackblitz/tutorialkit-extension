import * as vscode from 'vscode';
import {
    LessonsTreeDataProvider,
    getLessonsTreeDataProvider,
    setLessonsTreeDataProvider,
} from '../views/lessonsTree';

export async function loadTutorial(
  context: vscode.ExtensionContext,
  uri: vscode.Uri,
) {
  setLessonsTreeDataProvider(
    new LessonsTreeDataProvider(uri, context),
  );
  context.subscriptions.push(
    vscode.window.createTreeView('tutorialkit-lessons-tree', {
      treeDataProvider: getLessonsTreeDataProvider(),
      canSelectMany: true,
    }),
  );
}
