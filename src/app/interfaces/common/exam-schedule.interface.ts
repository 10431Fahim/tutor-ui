import { ExamCourse } from './exam-course.interface';

export interface ExamSchedule {
  _id?: string;
  examName: string;
  examType: 'mcq' | 'written';
  examDate: Date | string;
  examTime: string;
  examCourse?: string | ExamCourse;
  links?: Array<{
    name: string;
    url: string;
  }>;
  video?: string;
  status?: 'upcoming' | 'ongoing' | 'completed';
  createdAt?: Date;
  updatedAt?: Date;
}
