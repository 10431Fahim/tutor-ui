export interface AssignmentSubmission {
  _id?: string;
  assignmentId?: string | any;
  studentId?: string | any;
  courseId?: string | any;
  submittedFiles?: string[];
  submissionText?: string;
  submittedAt?: Date;
  gradedAt?: Date;
  marksObtained?: number;
  feedback?: string;
  gradedBy?: string | any;
  status?: 'submitted' | 'graded' | 'returned';
  createdAt?: Date;
  updatedAt?: Date;
}



