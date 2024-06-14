import * as vscode from 'vscode';

export function getIcon(
  context: vscode.ExtensionContext,
  filename: string,
): { light: string | vscode.Uri; dark: string | vscode.Uri } {
  const iconsPath = [__filename, '..', '..', '..', 'resources', 'icons'];
  console.log({ iconsPath, extensionUri: context.extensionUri });
  return {
    light: vscode.Uri.file(
      context.asAbsolutePath(`/resources/icons/light/${filename}`),
    ),
    dark: vscode.Uri.file(
      context.asAbsolutePath(`/resources/icons/dark/${filename}`),
    ),
  };
}
