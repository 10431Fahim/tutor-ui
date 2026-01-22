import {Category} from './category.interface';


export interface SubCategory {
  _id?: string;
  name?: string;
  courseCount?: any;
  image?: string;
  slug: any;
  type?: string;
  category?: Category;
  select: Boolean;
  status?: string;
  priority?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
