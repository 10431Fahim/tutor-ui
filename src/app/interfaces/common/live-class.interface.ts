export interface LiveClass {
  _id?: string;
  courseId?: string | any;
  courseModuleId?: string;
  title: string;
  description?: string;
  instructorId?: string | any;
  platform: 'zoom' | 'google-meet' | 'microsoft-teams' | 'custom';
  meetingUrl?: string;
  meetingId?: string;
  meetingPassword?: string;
  scheduledDateTime: Date | string;
  duration?: number;
  recordedClassUrl?: string;
  recordingStatus?: 'not-recorded' | 'recording' | 'recorded' | 'processing';
  attendees?: Array<{
    userId?: string | any;
    joinedAt?: Date;
    leftAt?: Date;
  }>;
  status?: 'scheduled' | 'live' | 'completed' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}



