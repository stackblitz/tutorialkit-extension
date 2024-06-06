export class Lesson {
  constructor(
    public name: string,
    public readonly path: string,
    public readonly children: Lesson[] = [],
    public metadata?: {
      _path: string;
      title: string;
      type: 'lesson' | 'chapter' | 'part';
      description?: string;
    },
  ) {}
}
