import * as vscode from 'vscode';
import tutorialkitGoto from './tutorialkit.goto';
import tutorialkitAddLesson from './tutorialkit.add-lesson';

export const CMD = {
  GOTO: 'tutorialkit.goto',
  ADD_LESSON: 'tutorialkit.add-lesson',
} as const;

export function useCommands() {
  vscode.commands.registerCommand(CMD.GOTO, tutorialkitGoto);
  vscode.commands.registerCommand(CMD.ADD_LESSON, tutorialkitAddLesson);
}
