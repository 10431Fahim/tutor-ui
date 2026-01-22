export interface Unit {
  select?: boolean;
  _id?: string;
  name?: string;
  value?: number;
  duration?:number;
  status?: string;
  priority?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
