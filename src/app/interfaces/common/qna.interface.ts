export interface QnA {
  _id?: string;
  select?: boolean;
  question: string;
  answer?: string;
  category: 'course' | 'general';
  courseId?: string;
  courseName?: string;
  askedBy?: string;
  answeredBy?: string;
  answerSource?: 'ai' | 'admin' | 'manual';
  status?: 'pending' | 'answered';
  createdAt?: Date;
  updatedAt?: Date;
}

