import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import grayMatter from 'gray-matter';

const metadataFiles = ['meta.md', 'meta.mdx', 'content.md', 'content.mdx'];

class Lesson {
    constructor(public name: string, public readonly children: Lesson[] = []) {}
}

class LessonsTreeDataProvider implements vscode.TreeDataProvider<Lesson> {
    private lessons: Lesson[] = [];

    constructor(private readonly workspaceRoot: string) {
        this.loadLessons();
    }

    private loadLessons(): void {
        const tutorialFolderPath = path.join(this.workspaceRoot, 'src', 'content', 'tutorial');
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
                const lesson = new Lesson(lessonName, subLessons);

                // Check if the folder directly includes one of the metadata files
                const folderFiles = fs.readdirSync(filePath);
                const metadataFile = folderFiles.find((folderFile) => metadataFiles.includes(folderFile));
                if (metadataFile) {
                    const metadataFilePath = path.join(filePath, metadataFile);
                    const metadataFileContent = fs.readFileSync(metadataFilePath, 'utf8');
                    const parsedContent = grayMatter(metadataFileContent);
                    lesson.name = parsedContent.data.title;
                    lessons.push(lesson);
                }
            }
        }

        return lessons;
    }

    private _onDidChangeTreeData: vscode.EventEmitter<Lesson | undefined> = new vscode.EventEmitter<Lesson | undefined>();
    readonly onDidChangeTreeData: vscode.Event<Lesson | undefined> = this._onDidChangeTreeData.event;

    refresh(): void {
        this.loadLessons();
        // this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: Lesson): vscode.TreeItem {
        const treeItem = new vscode.TreeItem(element.name);
        treeItem.collapsibleState = element.children.length > 0 ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None;
        return treeItem;
    }

    getChildren(element?: Lesson): Lesson[] {
        if (element) {
            return element.children;
        }
        return this.lessons;
    }
}

export function useLessonTree() {
    const workspaceRoot = vscode.workspace.rootPath;
    if (workspaceRoot) {
        const lessonsTreeDataProvider = new LessonsTreeDataProvider(workspaceRoot);
        vscode.window.createTreeView('tutorialkit-lessons-tree', {
            treeDataProvider: lessonsTreeDataProvider,
            canSelectMany: true
        });

        vscode.commands.registerCommand('lessonsTree.refresh', () => {
            lessonsTreeDataProvider.refresh();
        });
    } else {
        vscode.window.showErrorMessage('Please open a workspace to use the lessons tree.');
    }
}