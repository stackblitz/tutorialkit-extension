import * as vscode from 'vscode';
import tutorialkitGoto from './tutorialkit.goto';
import tutorialkitRefresh from './tutorialkit.refresh';
import { addChapter, addLesson } from './tutorialkit.add';

// No need to use these consts outsite of this file
// – use `cmd[name].command` instead
const CMD = {
  GOTO: 'tutorialkit.goto',
  ADD_LESSON: 'tutorialkit.add-lesson',
  ADD_CHAPTER: 'tutorialkit.add-chapter',
  REFRESH: 'tutorialkit.refresh',
} as const;

// Register all commands in Code IDE
export function useCommands() {
  vscode.commands.registerCommand(CMD.GOTO, tutorialkitGoto);
  vscode.commands.registerCommand(CMD.ADD_LESSON, addLesson);
  vscode.commands.registerCommand(CMD.ADD_CHAPTER, addChapter);
  vscode.commands.registerCommand(CMD.REFRESH, tutorialkitRefresh);
}

// Create typesafe commands
export const cmd = {
  goto: createExecutor<typeof tutorialkitGoto>(CMD.GOTO),
  addLesson: createExecutor<typeof addLesson>(CMD.ADD_LESSON),
  addChapter: createExecutor<typeof addChapter>(CMD.ADD_CHAPTER),
  refresh: createExecutor<typeof tutorialkitRefresh>(CMD.REFRESH),
};

function createExecutor<T extends (...args: any) => any>(name: string) {
  function executor(...args: Parameters<T>) {
    return vscode.commands.executeCommand(name, ...args);
  }
  executor.command = name;
  return executor;
}
