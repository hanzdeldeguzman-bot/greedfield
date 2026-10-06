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
  const stored =
    sessionStorage.getItem(ACTIVE_SESSION_KEY) ?? localStorage.getItem(ACTIVE_SESSION_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/** Remember me checked: LocalStorage (survives restarts). Unchecked: SessionStorage (ends with the tab). */
export function setActiveSession(user: UserAccount | null, remember = true): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACTIVE_SESSION_KEY);
  sessionStorage.removeItem(ACTIVE_SESSION_KEY);
  if (user) {
    (remember ? localStorage : sessionStorage).setItem(ACTIVE_SESSION_KEY, JSON.stringify(user));
  }
}

export const PASSWORD_RULE_MESSAGE =
  "Password must be at least 8 characters with at least one letter and one number.";

export function isValidPassword(pass: string): boolean {
  return pass.length >= 8 && /[A-Za-z]/.test(pass) && /\d/.test(pass);
}

export function authenticateUser(
  emailOrUsername: string,
  pass: string
): { success: boolean; user?: UserAccount; error?: string } {
  const users = getStoredUsers();
  const trimmed = emailOrUsername.trim().toLowerCase();

  // Email works from activation; username only once credentials are updated.
  const user = users.find(
    (u) =>
      u.email.toLowerCase() === trimmed ||
      (!u.needsCredentialUpdate && u.username.toLowerCase() === trimmed)
  );

  const invalid = { success: false, error: "Invalid email or password." };
  if (!user) return invalid;

  // The default password is only valid until credentials are updated.
  const passOk =
    user.password === pass || (user.needsCredentialUpdate && user.defaultPassword === pass);
  if (!passOk) return invalid;

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
  if (user.isActivated && !user.needsCredentialUpdate) {
    return { success: false, error: "This account is already activated. Please log in." };
  }
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

  // Verify old password (the default password only counts on first login)
  const oldOk =
    user.password === oldPass || (user.needsCredentialUpdate && user.defaultPassword === oldPass);
  if (!oldOk) {
    return { success: false, error: "Old password does not match our records." };
  }

  if (!newUsername || newUsername.trim().length < 3) {
    return { success: false, error: "Username must be at least 3 characters." };
  }

  if (!isValidPassword(newPass)) {
    return { success: false, error: PASSWORD_RULE_MESSAGE };
  }

  user.username = newUsername.trim();
  user.password = newPass;
  user.needsCredentialUpdate = false;
  user.defaultPassword = undefined;
  users[userIdx] = user;
  saveStoredUsers(users);

  return { success: true, user };
}
