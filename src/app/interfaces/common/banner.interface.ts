
export interface Banner {
  _id?: string;
  select: boolean;
  name?: string;
  title?: string;
  image?: string;
  type?: string;
  title2?: string;
  url?: string;
  urlType?: string;
  priority?: number;
  bannerType?:string;
  status?: 'publish' | 'draft';
  createdAt?: Date;
  updatedAt?: Date;
}
