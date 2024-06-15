import * as vscode from 'vscode';
import tutorialkitGoto from './tutorialkit.goto';
import tutorialkitAddLesson from './tutorialkit.add-lesson';
import tutorialkitRefresh from './tutorialkit.refresh';

export const CMD = {
  GOTO: 'tutorialkit.goto',
  ADD_LESSON: 'tutorialkit.add-lesson',
  REFRESH: 'tutorialkit.refresh',
} as const;

export function useCommands() {
  vscode.commands.registerCommand(CMD.GOTO, tutorialkitGoto);
  vscode.commands.registerCommand(CMD.ADD_LESSON, tutorialkitAddLesson);
  vscode.commands.registerCommand(CMD.REFRESH, tutorialkitRefresh);
}
