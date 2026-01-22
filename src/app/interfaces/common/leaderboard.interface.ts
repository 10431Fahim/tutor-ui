export interface Leaderboard {
  _id?: string;
  courseId?: string;
  quizId?: string;
  rankings?: {
    studentId: string;
    studentName: string;
    marks: number;
    percentage: number;
    rank: number;
    submissionTime?: Date;
    timeTaken?: number;
  }[];
  totalParticipants?: number;
  generatedAt?: Date;
  pdfUrl?: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
