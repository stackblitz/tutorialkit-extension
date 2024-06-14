import { Lesson } from '../models/Lesson';
import { addLesson } from '../tutorialkit';

export default (parent: Lesson) => {
  addLesson(parent);
};
