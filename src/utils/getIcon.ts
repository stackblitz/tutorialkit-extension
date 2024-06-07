import path from 'path';

export function getIcon(filename: string): { light: string; dark: string } {
  const iconsPath = [__filename, '..', '..', '..', 'resources', 'icons'];
  return {
    light: path.join(...iconsPath, 'light', filename),
    dark: path.join(...iconsPath, 'dark', filename),
  };
}
