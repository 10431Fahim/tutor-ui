
export interface Faq {
  _id?: string;
  select: boolean;
  name?: string;
  title?: string;
  image?: string;
  type?: string;
  answer?: string;
  title2?: string;
  url?: string;
  urlType?: string;
  priority?: number;
  status?: 'publish' | 'draft';
  createdAt?: Date;
  updatedAt?: Date;
}
