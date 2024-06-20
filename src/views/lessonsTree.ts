import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import grayMatter from 'gray-matter';
import { Lesson } from '../models/Lesson';
import { getIcon } from '../utils/getIcon';
import { cmd } from '../commands';

const metadataFiles = ['meta.md', 'meta.mdx', 'content.md', 'content.mdx'];
export const tutorialMimeType = 'application/tutorialkit.unit';

let lessonsTreeDataProvider: LessonsTreeDataProvider;
export function getLessonsTreeDataProvider() {
  return lessonsTreeDataProvider;
}
export function setLessonsTreeDataProvider(provider: LessonsTreeDataProvider) {
  lessonsTreeDataProvider = provider;
}

class LessonsTreeDataProvider implements vscode.TreeDataProvider<Lesson> {
  private lessons: Lesson[] = [];

  constructor(
    private readonly workspaceRoot: vscode.Uri,
    private context: vscode.ExtensionContext,
  ) {
    this.loadLessons();
  }

  private loadLessons(): void {
    const tutorialFolderPath = vscode.Uri.joinPath(
      this.workspaceRoot,
      'src',
      'content',
      'tutorial',
    ).fsPath;
    this.lessons = this.loadLessonsFromFolder(tutorialFolderPath);
  }

  private loadLessonsFromFolder(folderPath: string): Lesson[] {
    const lessons: Lesson[] = [];
    const files = fs.readdirSync(folderPath);

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        const lessonName = path.basename(filePath);
        const subLessons = this.loadLessonsFromFolder(filePath);
        const lesson = new Lesson(lessonName, filePath, subLessons);

        // Check if the folder directly includes one of the metadata files
        const folderFiles = fs.readdirSync(filePath);
        const metadataFile = folderFiles.find((folderFile) =>
          metadataFiles.includes(folderFile),
        );
        if (metadataFile) {
          const metadataFilePath = path.join(filePath, metadataFile);
          const metadataFileContent = fs.readFileSync(metadataFilePath, 'utf8');
          const parsedContent = grayMatter(metadataFileContent);
          lesson.name = parsedContent.data.title;
          lesson.metadata = {
            _path: metadataFilePath,
            ...(parsedContent.data as any),
          };
          lessons.push(lesson);
        }
      }
    }

    return lessons;
  }

  private _onDidChangeTreeData: vscode.EventEmitter<Lesson | undefined> =
    new vscode.EventEmitter<Lesson | undefined>();
  readonly onDidChangeTreeData: vscode.Event<Lesson | undefined> =
    this._onDidChangeTreeData.event;

  refresh(): void {
    this.loadLessons();
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(lesson: Lesson): vscode.TreeItem {
    const treeItem = new vscode.TreeItem(lesson.name);
    treeItem.collapsibleState =
      lesson.children.length > 0
        ? vscode.TreeItemCollapsibleState.Collapsed
        : vscode.TreeItemCollapsibleState.None;

    treeItem.contextValue = lesson.metadata?.type;

    const shouldOpenFile = lesson.metadata?.type === 'lesson';
    treeItem.command = {
      command: cmd.goto.command,
      title: 'Go to the lesson',
      arguments: [lesson.path, lesson.metadata, shouldOpenFile],
    };

    treeItem.iconPath =
      lesson.metadata?.type === 'lesson'
        ? getIcon(this.context, 'lesson.svg')
        : getIcon(this.context, 'chapter.svg');

    return treeItem;
  }

  getChildren(element?: Lesson): Lesson[] {
    if (element) {
      return element.children;
    }
    return this.lessons;
  }
}

export function useLessonTree(context: vscode.ExtensionContext) {
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri;
  if (workspaceRoot) {
    setLessonsTreeDataProvider(
      new LessonsTreeDataProvider(workspaceRoot, context),
    );
    context.subscriptions.push(
      vscode.window.createTreeView('tutorialkit-lessons-tree', {
        treeDataProvider: getLessonsTreeDataProvider(),
        canSelectMany: true,
      }),
    );
  } else {
    // No workspace.
  }
}
