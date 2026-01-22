export interface Notification {
  _id?: string;
  title: string;
  message: string;
  type?: 'general' | 'course' | 'circular' | 'assignment' | 'live-class';
  courseId?: string | any;
  targetAudience?: 'all' | 'course-students' | 'specific-students' | 'instructors';
  targetUserIds?: string[];
  circularFile?: string;
  isRead?: Array<{
    userId: string;
    readAt: Date;
  }>;
  sendEmail?: boolean;
  sendSms?: boolean;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: 'draft' | 'sent';
  sentAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}



