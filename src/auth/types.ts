export type IUser = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  avatar: string | null;
  organization: string;
  organizationRole: string;
  profileLanguage: string;
};

export type UserType = IUser | null;

export type IAuthContext = {
  user: UserType;
  permissions: string[];
  loading: boolean;
  authenticated: boolean;
  checkUserSession?: () => Promise<void>;
};

export type AuthState = {
  user: UserType;
  loading: boolean;
};

export type AuthContextValue = {
  user: UserType;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  checkUserSession?: () => Promise<void>;
};
