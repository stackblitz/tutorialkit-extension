import path from 'path';
import * as vscode from 'vscode';

export function getIcon(
  context: vscode.ExtensionContext,
  filename: string,
): { light: string | vscode.Uri; dark: string | vscode.Uri } {
  const iconsPath = [__filename, '..', '..', '..', 'resources', 'icons'];
  console.log({ iconsPath, extensionUri: context.extensionUri });
  return {
    // light: path.join(...iconsPath, 'light', filename),
    // dark: path.join(...iconsPath, 'dark', filename),
    // light: vscode.Uri.joinPath(
    //   context.extensionUri,
    //   'resources',
    //   'icons',
    //   'light',
    //   filename,
    // ),
    // dark: vscode.Uri.joinPath(
    //   context.extensionUri,
    //   'resources',
    //   'icons',
    //   'dark',
    //   filename,
    // ),
    light: vscode.Uri.file(
      context.asAbsolutePath(`/resources/icons/light/${filename}`),
    ),
    dark: vscode.Uri.file(
      context.asAbsolutePath(`/resources/icons/dark/${filename}`),
    ),
  };
}
