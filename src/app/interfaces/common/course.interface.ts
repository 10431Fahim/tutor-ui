import { ChildCategory } from './child-category.interface';
import { Instructor } from './instructor.interface';
import { SubCategory } from './sub-category.interface';
import { Tag } from './tag.interface';
import {Quiz} from './quiz.interface';
import {Category} from './category.interface';

export interface Course {
  _id?: string;
  name: string;
  slug: string;
  type: 'video-course' | 'live-course' | 'lecture-sheet' | 'exam-based-course' | 'combo-course';
  description?: string;
  bannerImage?: string;
  image?:string;
  introYoutubeVideo?: string;
  subCategories: any[];
  category?: Category;
  subCategory?: SubCategory;
  tag?: Tag;
  instructor?: Instructor[]; // [CHANGED] Now an array for preview/collapse logic
  learningScopes?: string[];
  benefits?: string[];
  opportunities?: string[];
  whatNeed?: string[];
  isLiveClass?: boolean;
  groupLink?: string;
  courseModules?: CourseModule[];
  prices?: Price[];
  childCategory?:ChildCategory,
  isMultiplePrice?: boolean;
  salePrice?: number;
  discountType?: number;
  discountAmount?: number;
  totalSold?: number;
  totalDuration?: string;
  totalUsers?: string;
  totalExam?: string;
  totalClass?: string;
  isAdmission?: boolean;
  pdfAttachments?: PDFAttachment[];
  canSaleAttachment?: boolean;
  specifications?: any;
  attachmentSalePrice?: number;
  attachmentDiscountType?: number;
  attachmentDiscountAmount?: number;
  question?: Quiz;
  status?: string;
  priority?: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
  orderType?: 'video-course' | 'live-course' | 'lecture-sheet' | 'exam-based-course' | 'combo-course';
}

export interface CourseModule {
  _id?: string;
  name?: string;
  description?: string;
  video?: string;
  attachment?: string;
  quiz?: Quiz;
  type?: string;
  contentType?: 'video' | 'live-class' | 'recorded-class' | 'pdf' | 'image' | 'assignment' | 'blog' | 'external-link' | 'notification' | 'circular' | 'routine' | 'class-notes';
  videoUrl?: string;
  videoProvider?: 'youtube' | 'vimeo' | 'self-hosted' | 'cloudflare-stream';
  isProtected?: boolean;
  liveClassUrl?: string;
  liveClassPlatform?: 'zoom' | 'google-meet' | 'microsoft-teams' | 'custom';
  scheduledDateTime?: Date | string;
  recordedClassUrl?: string;
  assignmentId?: string | any;
  blogContent?: string;
  externalUrl?: string;
  openInNewTab?: boolean;
  notificationTitle?: string;
  notificationMessage?: string;
  circularFile?: string;
  circularDescription?: string;
  routineFile?: string;
  routineDescription?: string;
  classNotesFile?: string;
  classNotesContent?: string;
  isFree?: boolean;
  isFeatured?: boolean;
  url?: string;
  classes?: any[];
}

export interface Price {
  _id?: string;
  unit?: string;
  name?: string;
  duration: number,
  costPrice: number,
  salePrice: number,
  discountType: number,
  discountAmount: number;
  specifications: any;
}


export interface PDFAttachment {
  name?: string;
  url?: string;
}
