export interface Instructor {
  select: boolean;
  _id?: string;
  name?: string;
  info?: string;
  image?: string;
  status?: string;
  priority?: number;
  // Instructor capabilities
  canCreateCourse?: boolean;
  canManageOwnCourse?: boolean;
  canUploadContent?: boolean;
  canCreateExam?: boolean;
  canCheckAssignment?: boolean;
  canAnswerQnA?: boolean;
  canEvaluateStudent?: boolean;
  assignedCourses?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
