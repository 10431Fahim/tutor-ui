export interface Popup {
  _id?: string;
  select: boolean;
  name?: string;
  image?: string;
  type?: string;
  url?: string;
  enableVideo?: boolean;
  enableImage?: boolean;
  urlType?: string;
  urlLink?: string;
  priority?: number;
  status?: 'publish' | 'draft';
  createdAt?: Date;
  updatedAt?: Date;
}
