export interface IUser {
  createdAt: string;
  email: string;
  fullName?: string;
  isBanned?: boolean;
}

export interface ISelf extends IUser {
  _id: string;
  role?: string;
  phone?: string;
  interests?: string[];
  company?: string;
  isOnboardingComplete: boolean;
}

export interface IAuthentication {
  email: string;
  password: string;
}
