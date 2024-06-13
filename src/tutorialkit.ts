import { Lesson } from './models/Lesson';
import * as vscode from 'vscode';

let kebabCase: any;

(async () => {
  const module = await import('case-anything');
  kebabCase = module.kebabCase;
})();

export async function addLesson(parent: Lesson) {
  const folderPath = parent.path;
  const lessonNumber = parent.children.length + 1;

  // Ask for the name of the new lesson
  const lessonName = await vscode.window.showInputBox({
    prompt: 'Enter the name of the new lesson',
    value: `Lesson ${lessonNumber}`,
  });

  // Break if no name provided
  if (!lessonName) {
    throw new Error('No lesson name provided');
  }

  // Create the lesson folder and content.mdx file
  const lessonFolderPath = `${folderPath}/${lessonNumber}-${kebabCase(
    lessonName,
  )}`;
  await vscode.workspace.fs.writeFile(
    vscode.Uri.file(`${lessonFolderPath}/content.mdx`),
    new TextEncoder().encode(`---\ntitle: ${lessonName}\ntype: lesson\n---\n`),
  );

  // Create the _files folder
  await vscode.workspace.fs.createDirectory(
    vscode.Uri.file(`${lessonFolderPath}/_files`),
  );

  // Refresh the tree view
  await vscode.commands.executeCommand('tutorialkit.refresh');

  // Open the new lesson
  return vscode.commands.executeCommand('tutorial.goto', lessonFolderPath, <Lesson['metadata']>{
    _path: `${lessonFolderPath}/content.mdx`,
    type: 'lesson',
    title: lessonName,
  });
}
