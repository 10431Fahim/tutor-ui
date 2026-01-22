export interface Blog {
  _id?: string;
  name?: string;
  slug?: string;
  image?: string;
  mobileImage?: string;
  description?: string;
  shortDesc?:string;
  seoKeyword?:string;
  priority?:number;
  createdAt?: Date;
  updatedAt?: Date;
}
