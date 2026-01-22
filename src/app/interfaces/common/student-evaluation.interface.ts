export interface StudentEvaluation {
  _id?: string;
  studentId?: string | any;
  courseId?: string | any;
  instructorId?: string | any;
  evaluationType: 'quiz' | 'assignment' | 'exam' | 'overall';
  quizId?: string | any;
  assignmentId?: string | any;
  examId?: string;
  marksObtained?: number;
  totalMarks?: number;
  percentage?: number;
  grade?: string;
  feedback?: string;
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string;
  evaluatedAt?: Date;
  evaluatedBy?: string | any;
  createdAt?: Date;
  updatedAt?: Date;
}



