export interface User {
  _id?: string;
  name?: string;
  username?: string;
  phone?: string;
  email?: string;
  phoneNo?: string;
  password?: string;
  gender?: string;
  classLevel?: string;
  registrationType?: string;
  profileImg?: string;
  joinDate?: string;
  occupation?: string;
  hasAccess?: boolean;
  // Role System
  role?: 'student' | 'guardian' | 'instructor' | 'manager';
  userType?: string | any;
  // Guardian-related fields
  guardianId?: string;
  guardianType?: 'parent' | 'guardian' | 'relative';
  // Instructor link
  instructorId?: string;
  // Manager-related fields
  managerType?: 'examiner' | 'inventory_manager';
  managerPermissions?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserAuthResponse {
  success: boolean;
  token?: string;
  tokenExpiredInDays?: string;
  data?: any;
  message?: string;
}

export interface UserJwtPayload {
  _id?: string;
  username: string;
  role?: string;
}
