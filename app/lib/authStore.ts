"use client";

import { UserAccount } from "../types/auth";

const STORAGE_KEY = "ems_user_accounts_v2";
const ACTIVE_SESSION_KEY = "ems_active_session_v2";

export const INITIAL_SEED_USERS: UserAccount[] = [
  {
    id: "EMP-1012",
    name: "John Doe",
    email: "john.doe@company.com",
    username: "johndoe",
    password: "Password123!",
    role: "Employee",
    department: "Engineering",
    position: "Senior Frontend Engineer",
    isActivated: true,
    needsCredentialUpdate: false,
    defaultPassword: "TempPass123!",
  },
  {
    id: "EMP-1001",
    name: "Sarah Connor",
    email: "sarah.connor@company.com",
    username: "sarahc",
    password: "ManagerPass123!",
    role: "Department Manager",
    department: "Engineering",
    position: "Engineering Department Manager",
    isActivated: true,
    needsCredentialUpdate: false,
    defaultPassword: "TempPass123!",
  },
  {
    id: "EMP-1020",
    name: "Peter Vance",
    email: "Example@Email.com",
    username: "peter",
    password: "ExamplePass321_2.0",
    role: "Employee",
    department: "Marketing",
    position: "Content Strategist",
    isActivated: false,
    needsCredentialUpdate: true,
    defaultPassword: "TempPass123!",
  },
];

export function getStoredUsers(): UserAccount[] {
  if (typeof window === "undefined") return INITIAL_SEED_USERS;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_USERS));
    return INITIAL_SEED_USERS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_SEED_USERS;
  }
}

export function saveStoredUsers(users: UserAccount[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function getActiveSession(): UserAccount | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(ACTIVE_SESSION_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function setActiveSession(user: UserAccount | null): void {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
  }
}

export function authenticateUser(
  emailOrUsername: string,
  pass: string
): { success: boolean; user?: UserAccount; error?: string } {
  const users = getStoredUsers();
  const trimmed = emailOrUsername.trim().toLowerCase();
  
  const user = users.find(
    (u) => u.email.toLowerCase() === trimmed || u.username.toLowerCase() === trimmed
  );

  if (!user) {
    return { success: false, error: "Invalid email or password." };
  }

  // Check password
  if (user.password !== pass && user.defaultPassword !== pass) {
    return { success: false, error: "Invalid email or password." };
  }

  return { success: true, user };
}

export function activateUserAccount(
  employeeId: string,
  companyEmail: string
): { success: boolean; user?: UserAccount; error?: string; defaultPassword?: string } {
  const users = getStoredUsers();
  const cleanId = employeeId.trim().toUpperCase();
  const cleanEmail = companyEmail.trim().toLowerCase();

  const userIdx = users.findIndex(
    (u) => u.id.toUpperCase() === cleanId && u.email.toLowerCase() === cleanEmail
  );

  if (userIdx === -1) {
    return {
      success: false,
      error: "Employee ID and company email do not match our records.",
    };
  }

  const user = users[userIdx];
  user.isActivated = true;
  user.needsCredentialUpdate = true;
  user.defaultPassword = "TempPass123!";
  users[userIdx] = user;
  saveStoredUsers(users);

  return {
    success: true,
    user,
    defaultPassword: user.defaultPassword,
  };
}

export function updateUserCredentials(
  employeeId: string,
  newUsername: string,
  oldPass: string,
  newPass: string
): { success: boolean; user?: UserAccount; error?: string } {
  const users = getStoredUsers();
  const userIdx = users.findIndex((u) => u.id.toUpperCase() === employeeId.toUpperCase());

  if (userIdx === -1) {
    return { success: false, error: "Account not found." };
  }

  const user = users[userIdx];

  // Verify old password
  if (user.password !== oldPass && user.defaultPassword !== oldPass) {
    return { success: false, error: "Old password does not match our records." };
  }

  if (!newUsername || newUsername.trim().length < 3) {
    return { success: false, error: "Username must be at least 3 characters." };
  }

  if (!newPass || newPass.length < 6) {
    return { success: false, error: "New password must be at least 6 characters." };
  }

  user.username = newUsername.trim();
  user.password = newPass;
  user.needsCredentialUpdate = false;
  users[userIdx] = user;
  saveStoredUsers(users);

  return { success: true, user };
}
