export interface Category {
  readOnly?: boolean;
  _id?: string;
  name: string;
  courseCount: any;
  description?: string;
  slug?: string;
  image?:string;
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
}
