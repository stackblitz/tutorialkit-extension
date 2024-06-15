import { Lesson } from '../models/Lesson';
import { addChapter } from '../tutorialkit';

export default (parent: Lesson) => {
  addChapter(parent);
};
