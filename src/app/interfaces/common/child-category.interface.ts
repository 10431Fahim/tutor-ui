import {SubCategory} from "./sub-category.interface";
import {Category} from './category.interface';

export interface ChildCategory {
  _id?: string;
  name?: string;
  slug: any;
  image?: string;
  category?: Category;
  subCategory?: SubCategory;
  select: Boolean;
  status?: string;
  priority?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
