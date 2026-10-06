export type UserRole = "Employee" | "Department Manager";

export interface UserAccount {
  id: string; // EMP-####
  name: string;
  email: string;
  username: string;
  password: string;
  role: UserRole;
  department: string;
  position: string;
  isActivated: boolean;
  needsCredentialUpdate: boolean;
  defaultPassword?: string;
  avatarUrl?: string;
}

export type AuthScreen = "login" | "activate" | "update-credentials" | "forgot-password";
