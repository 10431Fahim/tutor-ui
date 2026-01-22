export interface ExamModuleSettings {
  _id?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroButtonText?: string;
  featuresTitle?: string;
  benefitsTitle?: string;
  scheduleTitle?: string;
  coursesTitle?: string;
  features?: Array<{
    icon: string;
    title: string;
  }>;
  benefits?: Array<{
    icon: string;
    text: string;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}
