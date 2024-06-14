import * as vscode from 'vscode';
import { useLessonTree } from './views/lessonsTree';
import { Lesson } from './models/Lesson';
import { addLesson } from './tutorialkit';

export function activate(context: vscode.ExtensionContext) {
  vscode.commands.registerCommand(
    'tutorial.goto',
    (path: string, meta: Lesson['metadata']) => {
      vscode.commands
        .executeCommand('revealInExplorer', vscode.Uri.file(path))
        .then(() => {
          if (meta?.type === 'lesson') {
            vscode.workspace.openTextDocument(meta._path).then((document) => {
              vscode.window.showTextDocument(document);
            });
          }
        })
        .then(() => {
          setTimeout(
            () => {
              vscode.commands.executeCommand('tutorialkit-lessons-tree.focus');
            },
            meta?.type === 'lesson' ? 30 : 0,
          );
        });
    },
  );

  vscode.commands.registerCommand(
    'tutorialkit.add-lesson',
    (parent: Lesson) => {
      addLesson(parent);
    },
  );

  useLessonTree(context);
}

export function deactivate() {}
