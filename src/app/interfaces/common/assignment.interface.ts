export interface Assignment {
  _id?: string;
  title: string;
  description?: string;
  courseId?: string | any;
  courseModuleId?: string;
  instructorId?: string | any;
  dueDate?: Date | string;
  maxMarks?: number;
  instructions?: string;
  attachmentFiles?: string[];
  status?: 'draft' | 'publish';
  createdAt?: Date;
  updatedAt?: Date;
}



