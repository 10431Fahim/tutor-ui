export interface ExamCourse {
  _id?: string;
  name: string;
  slug?: string;
  description?: string;
  totalSeats?: number;
  courseFee?: number;
  mcqExamCount?: number;
  writtenExamCount?: number;
  modelTestCount?: number;
  omrSheetUrl?: string;
  examRoutineUrl?: string;
  courseDetailsHTML?: string;
  status?: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}
