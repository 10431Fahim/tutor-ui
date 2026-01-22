export interface Contact {
  select: boolean;
  _id?: string;
  readOnly?: boolean;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNo?: string;
  companyName?: string;
  shortDesc?: string;
}
