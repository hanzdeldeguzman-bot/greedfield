"use client";

import React, { useState, useEffect } from "react";
import { EMSLogo } from "./components/EMSLogo";
import { BackgroundPolygons } from "./components/BackgroundPolygons";
import { AuthScreen, UserAccount } from "./types/auth";
import {
  authenticateUser,
  activateUserAccount,
  updateUserCredentials,
  getActiveSession,
  setActiveSession,
} from "./lib/authStore";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  LogOut,
} from "lucide-react";

export default function AuthPage() {
  const [screen, setScreen] = useState<AuthScreen>("login");
  const [activeUser, setActiveUser] = useState<UserAccount | null>(null);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Activation Form State
  const [actEmployeeId, setActEmployeeId] = useState("");
  const [actCompanyEmail, setActCompanyEmail] = useState("");
  const [actError, setActError] = useState("");
  const [actSuccess, setActSuccess] = useState("");
  const [actLoading, setActLoading] = useState(false);

  // Update Credentials State
  const [pendingEmployeeId, setPendingEmployeeId] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [credError, setCredError] = useState("");
  const [credSuccess, setCredSuccess] = useState("");
  const [credLoading, setCredLoading] = useState(false);

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

  useEffect(() => {
    const session = getActiveSession();
    if (session) {
      setActiveUser(session);
    }
  }, []);

  // Handle Login Submit
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError("Invalid email or password.");
      return;
    }

    setLoginLoading(true);
    setTimeout(() => {
      const result = authenticateUser(loginEmail, loginPassword);
      setLoginLoading(false);

      if (!result.success || !result.user) {
        setLoginError(result.error || "Invalid email or password.");
        return;
      }

      const user = result.user;
      if (user.needsCredentialUpdate) {
        setPendingEmployeeId(user.id);
        setNewUsername(user.username || user.name.split(" ")[0].toLowerCase());
        setOldPassword(loginPassword);
        setScreen("update-credentials");
        return;
      }

      setActiveSession(user);
      setActiveUser(user);
    }, 450);
  };

  // Handle Account Activation Submit
  const handleActivation = (e: React.FormEvent) => {
    e.preventDefault();
    setActError("");
    setActSuccess("");

    if (!actEmployeeId.trim() || !actCompanyEmail.trim()) {
      setActError("Employee ID and company email are both required.");
      return;
    }

    setActLoading(true);
    setTimeout(() => {
      const result = activateUserAccount(actEmployeeId, actCompanyEmail);
      setActLoading(false);

      if (!result.success || !result.user) {
        setActError(result.error || "Employee ID and company email do not match our records.");
        return;
      }

      setActSuccess(`Account verified! Default password sent: ${result.defaultPassword}`);
      setTimeout(() => {
        setPendingEmployeeId(result.user!.id);
        setLoginEmail(result.user!.email);
        setLoginPassword(result.defaultPassword || "TempPass123!");
        setScreen("login");
      }, 1500);
    }, 500);
  };

  // Handle Update User Credentials Submit
  const handleUpdateCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setCredError("");
    setCredSuccess("");

    if (!newUsername.trim() || !oldPassword.trim() || !newPassword.trim()) {
      setCredError("All fields are required.");
      return;
    }

    setCredLoading(true);
    setTimeout(() => {
      const result = updateUserCredentials(
        pendingEmployeeId || "EMP-1020",
        newUsername,
        oldPassword,
        newPassword
      );
      setCredLoading(false);

      if (!result.success || !result.user) {
        setCredError(result.error || "Failed to update credentials.");
        return;
      }

      setCredSuccess("Credentials updated successfully! Signing you in...");
      setTimeout(() => {
        setActiveSession(result.user!);
        setActiveUser(result.user!);
      }, 1200);
    }, 500);
  };

  // Logout
  const handleLogout = () => {
    setActiveSession(null);
    setActiveUser(null);
    setScreen("login");
    setLoginPassword("");
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center py-6 px-4 select-none">
      {/* Background Graphic Polygons & Glowing 3D Crystal */}
      <BackgroundPolygons />

      {/* Main Form Centerpiece */}
      <main className="relative z-10 w-full flex-1 flex items-center justify-center my-auto">
        {/* If user is logged in, show authenticated dashboard preview */}
        {activeUser ? (
          <div className="glass-panel w-full max-w-lg p-8 md:p-10 rounded-[32px] text-center text-white relative transition-all duration-500 animate-in fade-in zoom-in-95">
            <div className="flex justify-center mb-5">
              <EMSLogo size={100} />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <CheckCircle size={14} />
              <span>Logged In • {activeUser.role}</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
              Welcome, {activeUser.name}!
            </h1>
            <p className="text-sm text-teal-100/80 mb-6 max-w-sm mx-auto">
              You are signed in as <span className="font-semibold text-white">{activeUser.position}</span> ({activeUser.department} Department).
            </p>

            <div className="bg-white/10 rounded-2xl p-4 mb-6 border border-white/20 text-left text-xs space-y-2 text-teal-100">
              <div className="flex justify-between">
                <span className="text-white/60">Employee ID:</span>
                <span className="font-mono font-medium text-white">{activeUser.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Email:</span>
                <span className="font-mono text-white">{activeUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Username:</span>
                <span className="text-white">@{activeUser.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Role Mode:</span>
                <span className="font-semibold text-teal-300">{activeUser.role}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="btn-teal w-full py-3 px-6 rounded-2xl font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut size={16} />
              <span>Log Out & Return to Login</span>
            </button>
          </div>
        ) : (
          /* Glassmorphic Auth Card */
          <div className="glass-panel w-full max-w-[460px] p-8 md:p-10 rounded-[34px] relative transition-all duration-300">
            {/* Logo Emblem Header */}
            <div className="flex justify-center mb-4">
              <EMSLogo size={104} />
            </div>

            {/* SCREEN 1: LOGIN */}
            {screen === "login" && (
              <form onSubmit={handleLogin} className="flex flex-col text-white">
                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-extrabold text-center tracking-wider text-white uppercase mb-1 drop-shadow-sm">
                  LOGIN
                </h1>
                
                {/* Subtitle */}
                <p className="text-center text-sm md:text-base text-teal-50/90 font-medium mb-4">
                  Welcome back.
                </p>

                {/* Inline Error Message */}
                {loginError && (
                  <p className="text-red-500 text-xs md:text-sm font-semibold mb-3 text-left transition-all animate-shake">
                    {loginError}
                  </p>
                )}

                {/* Email Field */}
                <div className="mb-4">
                  <label htmlFor="loginEmail" className="block text-xs md:text-sm font-medium text-teal-50 mb-1.5 pl-1">
                    Email
                  </label>
                  <div className="glass-input-wrapper rounded-2xl flex items-center px-4 py-3 text-white">
                    <Mail size={18} className="text-white/70 mr-3 shrink-0" />
                    <input
                      id="loginEmail"
                      type="text"
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value);
                        if (loginError) setLoginError("");
                      }}
                      placeholder="Example@Email.com"
                      className="w-full bg-transparent border-none outline-none text-sm text-white placeholder-white/50 focus:ring-0"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="mb-3">
                  <label htmlFor="loginPassword" aria-label="Password" className="block text-xs md:text-sm font-medium text-teal-50 mb-1.5 pl-1">
                    Password
                  </label>
                  <div className="glass-input-wrapper rounded-2xl flex items-center px-4 py-3 text-white">
                    <Lock size={18} className="text-white/70 mr-3 shrink-0" />
                    <input
                      id="loginPassword"
                      type={showLoginPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        if (loginError) setLoginError("");
                      }}
                      placeholder="Password"
                      className="w-full bg-transparent border-none outline-none text-sm text-white placeholder-white/50 focus:ring-0"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="ml-2 w-7 h-7 rounded-full bg-[#102428] border border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors shrink-0"
                      title={showLoginPassword ? "Hide password" : "Show password"}
                    >
                      {showLoginPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {/* Auxiliary Controls: Forgot Password & Remember Me */}
                <div className="flex items-center justify-between text-xs mb-6 mt-1 px-1">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-cyan-300 hover:text-cyan-200 underline transition-colors cursor-pointer"
                  >
                    Forgot Password
                  </button>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-white/80">Remember me</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={rememberMe}
                      onClick={() => setRememberMe(!rememberMe)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                        rememberMe ? "bg-teal-400" : "bg-white/40"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          rememberMe ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </label>
                </div>

                {/* Primary Action Button */}
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="btn-teal w-full py-3.5 px-6 rounded-2xl font-extrabold text-sm tracking-wider uppercase text-white cursor-pointer mb-5 shadow-lg disabled:opacity-60"
                >
                  {loginLoading ? "LOGGING IN..." : "LOG IN"}
                </button>

                {/* Footer Switch Link */}
                <div className="text-center text-xs md:text-sm text-teal-100/90 font-medium">
                  <span>Have not active your account? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setScreen("activate");
                      setLoginError("");
                    }}
                    className="text-cyan-300 hover:text-cyan-200 font-semibold underline underline-offset-2 ml-1 cursor-pointer transition-colors"
                  >
                    Active Here!
                  </button>
                </div>
              </form>
            )}

            {/* SCREEN 2: ACTIVE ACCOUNT */}
            {screen === "activate" && (
              <form onSubmit={handleActivation} className="flex flex-col text-white">
                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-extrabold text-center tracking-wider text-white uppercase mb-1 drop-shadow-sm">
                  ACTIVE ACCOUNT
                </h1>

                {/* Subtitle */}
                <p className="text-center text-xs md:text-sm text-teal-50/90 font-medium mb-4 leading-relaxed">
                  Verify your Employee ID and Company Email to activate your account.
                </p>

                {/* Inline Error / Success */}
                {actError && (
                  <p className="text-red-500 text-xs md:text-sm font-semibold mb-3 text-left">
                    {actError}
                  </p>
                )}
                {actSuccess && (
                  <p className="text-emerald-400 text-xs md:text-sm font-semibold mb-3 text-left">
                    {actSuccess}
                  </p>
                )}

                {/* Employee ID Field */}
                <div className="mb-4">
                  <label htmlFor="actEmployeeId" className="block text-xs md:text-sm font-medium text-teal-50 mb-1.5 pl-1">
                    Employee ID
                  </label>
                  <div className="glass-input-wrapper rounded-2xl flex items-center px-4 py-3 text-white">
                    <User size={18} className="text-white/70 mr-3 shrink-0" />
                    <input
                      id="actEmployeeId"
                      type="text"
                      value={actEmployeeId}
                      onChange={(e) => {
                        setActEmployeeId(e.target.value);
                        if (actError) setActError("");
                      }}
                      placeholder="@Example (e.g. EMP-1012)"
                      className="w-full bg-transparent border-none outline-none text-sm text-white placeholder-white/50 focus:ring-0"
                    />
                  </div>
                </div>

                {/* Company Email Field */}
                <div className="mb-6">
                  <label htmlFor="actCompanyEmail" className="block text-xs md:text-sm font-medium text-teal-50 mb-1.5 pl-1">
                    Company Email
                  </label>
                  <div className="glass-input-wrapper rounded-2xl flex items-center px-4 py-3 text-white">
                    <Mail size={18} className="text-white/70 mr-3 shrink-0" />
                    <input
                      id="actCompanyEmail"
                      type="text"
                      value={actCompanyEmail}
                      onChange={(e) => {
                        setActCompanyEmail(e.target.value);
                        if (actError) setActError("");
                      }}
                      placeholder="Example@Email.com"
                      className="w-full bg-transparent border-none outline-none text-sm text-white placeholder-white/50 focus:ring-0"
                    />
                  </div>
                </div>

                {/* Primary Action Button */}
                <button
                  type="submit"
                  disabled={actLoading}
                  className="btn-teal w-full py-3.5 px-6 rounded-2xl font-extrabold text-sm tracking-wider uppercase text-white cursor-pointer mb-5 shadow-lg disabled:opacity-60"
                >
                  {actLoading ? "VERIFYING..." : "Continue"}
                </button>

                {/* Footer Switch Link */}
                <div className="text-center text-xs md:text-sm text-teal-100/90 font-medium">
                  <span>Already have an account? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setScreen("login");
                      setActError("");
                    }}
                    className="text-cyan-300 hover:text-cyan-200 font-semibold underline underline-offset-2 ml-1 cursor-pointer transition-colors"
                  >
                    Login!
                  </button>
                </div>
              </form>
            )}

            {/* SCREEN 3: UPDATE USER CREDENTIALS */}
            {screen === "update-credentials" && (
              <form onSubmit={handleUpdateCredentials} className="flex flex-col text-white">
                {/* Title */}
                <h1 className="text-xl md:text-2xl font-extrabold text-center tracking-wider text-white uppercase mb-1 drop-shadow-sm leading-tight">
                  UPDATE USER CREDENTIALS
                </h1>

                {/* Subtitle */}
                <p className="text-center text-xs md:text-sm text-teal-50/90 font-medium mb-4 leading-relaxed">
                  Create a new username and password before accessing your account.
                </p>

                {/* Inline Error / Success */}
                {credError && (
                  <p className="text-red-500 text-xs md:text-sm font-semibold mb-3 text-left">
                    {credError}
                  </p>
                )}
                {credSuccess && (
                  <p className="text-emerald-400 text-xs md:text-sm font-semibold mb-3 text-left">
                    {credSuccess}
                  </p>
                )}

                {/* New Username Field */}
                <div className="mb-3">
                  <label htmlFor="newUsername" className="block text-xs md:text-sm font-medium text-teal-50 mb-1 pl-1">
                    New Username
                  </label>
                  <div className="glass-input-wrapper rounded-2xl flex items-center px-4 py-3 text-white">
                    <User size={18} className="text-white/70 mr-3 shrink-0" />
                    <input
                      id="newUsername"
                      type="text"
                      value={newUsername}
                      onChange={(e) => {
                        setNewUsername(e.target.value);
                        if (credError) setCredError("");
                      }}
                      placeholder="Peter"
                      className="w-full bg-transparent border-none outline-none text-sm text-white placeholder-white/50 focus:ring-0"
                    />
                  </div>
                </div>

                {/* Old / Temp Password Field */}
                <div className="mb-3">
                  <label htmlFor="oldPassword" aria-label="New Password" className="block text-xs md:text-sm font-medium text-teal-50 mb-1 pl-1">
                    New Password
                  </label>
                  <div className="glass-input-wrapper rounded-2xl flex items-center px-4 py-3 text-white">
                    <Lock size={18} className="text-white/70 mr-3 shrink-0" />
                    <input
                      id="oldPassword"
                      type={showOldPassword ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e) => {
                        setOldPassword(e.target.value);
                        if (credError) setCredError("");
                      }}
                      placeholder="ExamplePass321_2.0"
                      className="w-full bg-transparent border-none outline-none text-sm text-white placeholder-white/50 focus:ring-0"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="ml-2 w-7 h-7 rounded-full bg-[#102428] border border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors shrink-0"
                    >
                      {showOldPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {/* New Password / Confirm Field */}
                <div className="mb-5">
                  <label htmlFor="newPassword" aria-label="New Password" className="block text-xs md:text-sm font-medium text-teal-50 mb-1 pl-1">
                    New Password
                  </label>
                  <div className="glass-input-wrapper rounded-2xl flex items-center px-4 py-3 text-white">
                    <Lock size={18} className="text-white/70 mr-3 shrink-0" />
                    <input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        if (credError) setCredError("");
                      }}
                      placeholder="Password"
                      className="w-full bg-transparent border-none outline-none text-sm text-white placeholder-white/50 focus:ring-0"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="ml-2 w-7 h-7 rounded-full bg-[#102428] border border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors shrink-0"
                    >
                      {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {/* Primary Action Button */}
                <button
                  type="submit"
                  disabled={credLoading}
                  className="btn-teal w-full py-3.5 px-6 rounded-2xl font-extrabold text-sm tracking-wider uppercase text-white cursor-pointer mb-4 shadow-lg disabled:opacity-60"
                >
                  {credLoading ? "UPDATING..." : "CONFIRM"}
                </button>

                {/* Back to Login */}
                <div className="text-center text-xs text-teal-100/80">
                  <button
                    type="button"
                    onClick={() => setScreen("login")}
                    className="text-cyan-300 hover:text-cyan-200 underline cursor-pointer"
                  >
                    Cancel and return to Login
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </main>

      {/* Forgot Password Recovery Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-md p-6 md:p-8 rounded-3xl relative text-white">
            <h2 className="text-xl font-bold tracking-wide uppercase mb-2 text-center text-white">
              Password Recovery
            </h2>
            <p className="text-xs text-teal-100/90 text-center mb-5">
              Enter your registered company email to receive reset instructions.
            </p>

            {forgotMessage ? (
              <div className="p-4 rounded-xl bg-teal-900/60 border border-teal-400/40 text-xs text-teal-200 text-center mb-4">
                {forgotMessage}
              </div>
            ) : (
              <div className="mb-4">
                <label className="block text-xs font-medium text-teal-100 mb-1 pl-1">
                  Company Email
                </label>
                <div className="glass-input-wrapper rounded-2xl flex items-center px-4 py-3 text-white">
                  <Mail size={18} className="text-white/70 mr-3" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="john.doe@company.com"
                    className="w-full bg-transparent border-none outline-none text-sm text-white placeholder-white/50 focus:ring-0"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotMessage("");
                  setForgotEmail("");
                }}
                className="w-1/2 py-2.5 rounded-xl border border-white/30 text-white/80 hover:bg-white/10 text-xs font-semibold"
              >
                Close
              </button>
              {!forgotMessage && (
                <button
                  type="button"
                  onClick={() => {
                    if (!forgotEmail.trim()) {
                      setForgotMessage("Please enter your email address.");
                      return;
                    }
                    setForgotMessage(
                      `Password reset instructions have been dispatched to ${forgotEmail}.`
                    );
                  }}
                  className="btn-teal w-1/2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white"
                >
                  Send Link
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer System Version */}
      <footer className="relative z-10 text-center text-[11px] text-teal-200/50 pt-2 font-mono">
        Employee Management System (EMS) • v2.0 Demo Build • Designed with Agentic UI
      </footer>
    </div>
  );
}
