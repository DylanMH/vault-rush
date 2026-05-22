"use client";

import { useState } from "react";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ChevronRight,
  Shield,
  Gamepad2,
  AlertTriangle,
  Check,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface AuthScreenProps {
  onGuestMode: () => void;
  onAuthenticated: () => void;
}

export default function AuthScreen({ onGuestMode, onAuthenticated }: AuthScreenProps) {
  const [mode, setMode] = useState<"signin" | "signup" | "guest-warning">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [usernameValid, setUsernameValid] = useState(false);

  const validateUsername = (value: string) => {
    if (value.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      setUsernameValid(false);
      return;
    }
    if (value.length > 20) {
      setUsernameError("Username must be at most 20 characters");
      setUsernameValid(false);
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      setUsernameError("Only letters, numbers, and underscores allowed");
      setUsernameValid(false);
      return;
    }
    setUsernameError(null);
    setUsernameValid(true);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!username || username.length < 3) {
      setError("Username must be at least 3 characters");
      setIsLoading(false);
      return;
    }

    if (!usernameValid) {
      setError(usernameError || "Please enter a valid username");
      setIsLoading(false);
      return;
    }

    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            display_name: username,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (signUpData.user) {
        // Auto sign-in after successful sign-up
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        // Explicitly create player profile in the database
        if (signInData.user) {
          const { error: insertError } = await supabase
            .from('players')
            .upsert({
              user_id: signInData.user.id,
              username: username,
              display_name: username,
              email: email,
              gems: 0,
              keys: 3,
              revive_tokens: 1,
              level: 1,
              xp: 0,
              xp_to_next_level: 200,
              streak: 0,
              last_daily_claim: null,
              is_subscribed: false,
              subscription_expiry: null,
              is_ad_free: false,
              total_gems_earned: 0,
              total_vaults_opened: 0,
              trap_count: 0,
              jackpot_count: 0,
              best_run_gems: 0,
              longest_streak: 0,
              longest_run: 0,
              highest_jackpot: 0,
              weekly_score: 0,
              cosmetic_shards: 0,
              owned_cosmetics: ["vault-default", "avatar-basic", "banner-default"],
              active_vault_skin: "vault-default",
              active_avatar: "avatar-basic",
              active_badge_frame: "banner-default",
            }, { onConflict: 'user_id' });

          if (insertError) {
            console.error('Player profile creation error:', insertError);
          }
        }

        onAuthenticated();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sign up failed";
      if (msg.toLowerCase().includes("already registered") || msg.toLowerCase().includes("user already registered") || msg.includes("422")) {
        setError("An account with this email already exists.");
      } else {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (data.user) {
        if (rememberMe) {
          localStorage.setItem("vr_remember_email", email);
        } else {
          localStorage.removeItem("vr_remember_email");
        }

        onAuthenticated();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestContinue = () => {
    setMode("guest-warning");
  };

  const handleConfirmGuest = () => {
    onGuestMode();
  };

  return (
    <div className="flex flex-col min-h-screen bg-vault-900 items-center justify-center px-4">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-vault-gold to-vault-goldLight flex items-center justify-center shadow-lg glow-gold">
          <Gamepad2 size={40} className="text-vault-900" />
        </div>
        <h1 className="text-3xl font-black tracking-tight">
          <span className="gold-text">VAULT</span>{" "}
          <span className="text-white">RUSH</span>
        </h1>
        <p className="text-vault-400 text-sm mt-1">Risk it all. Bank the gems.</p>
      </div>

      {/* Guest Warning Modal */}
      {mode === "guest-warning" && (
        <div className="w-full max-w-sm">
          <div className="bg-vault-800 rounded-2xl p-5 border border-vault-700 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle size={24} className="text-vault-gold" />
              <h3 className="text-lg font-bold text-white">Play as Guest</h3>
            </div>
            <div className="space-y-3 text-sm text-vault-300">
              <p>
                <span className="text-vault-gold font-bold">Your progress will NOT be saved to the cloud.</span>
              </p>
              <p>If you clear your browser data, switch devices, or use private mode, you will lose:</p>
              <ul className="space-y-1 ml-4">
                <li className="flex items-center gap-2">
                  <span className="text-vault-danger">&times;</span> All gems, keys, and cosmetics
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-vault-danger">&times;</span> Level progress and stats
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-vault-danger">&times;</span> Leaderboard rankings
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-vault-danger">&times;</span> Streak and achievements
                </li>
              </ul>
              <p className="text-vault-gold font-semibold">
                We strongly recommend creating a free account to keep your progress forever.
              </p>
            </div>
            <div className="flex flex-col gap-2 mt-5">
              <button
                onClick={() => setMode("signup")}
                className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-vault-gold to-vault-goldLight text-vault-900 shadow-lg active:scale-[0.98] transition"
              >
                Create Free Account
              </button>
              <button
                onClick={handleConfirmGuest}
                className="w-full py-3 rounded-xl font-semibold text-sm text-vault-400 bg-transparent border border-vault-600 active:scale-[0.98] transition hover:text-white"
              >
                Continue as Guest Anyway
              </button>
              <button
                onClick={() => setMode("signin")}
                className="text-xs text-vault-400 hover:text-vault-gold transition mt-1"
              >
                Already have an account? Sign In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sign In / Sign Up Forms */}
      {mode !== "guest-warning" && (
        <div className="w-full max-w-sm">
          {/* Tabs */}
          <div className="flex bg-vault-800 rounded-xl p-1 mb-6 border border-vault-700">
            <button
              onClick={() => { setMode("signin"); setError(null); }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${
                mode === "signin"
                  ? "bg-vault-gold text-vault-900"
                  : "text-vault-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode("signup"); setError(null); }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${
                mode === "signup"
                  ? "bg-vault-gold text-vault-900"
                  : "text-vault-400 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-vault-danger/10 border border-vault-danger/30 rounded-xl p-3 mb-4">
              <p className="text-sm text-vault-danger font-medium">{error}</p>
              {error === "An account with this email already exists." && (
                <button
                  onClick={() => { setMode("signin"); setError(null); }}
                  className="text-sm text-vault-gold font-semibold mt-2 hover:text-white transition underline underline-offset-2"
                >
                  Sign in with this email instead
                </button>
              )}
            </div>
          )}

          {/* Sign In Form */}
          {mode === "signin" && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="text-xs text-vault-400 font-semibold uppercase tracking-wider mb-1.5 block">
                  Email
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-vault-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full bg-vault-800 border border-vault-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-vault-500 focus:outline-none focus:border-vault-gold transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-vault-400 font-semibold uppercase tracking-wider mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-vault-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    minLength={6}
                    className="w-full bg-vault-800 border border-vault-700 rounded-xl py-3 pl-10 pr-10 text-sm text-white placeholder-vault-500 focus:outline-none focus:border-vault-gold transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-vault-400 hover:text-white transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-vault-600 bg-vault-800 text-vault-gold focus:ring-vault-gold focus:ring-offset-vault-900"
                  />
                  <span className="text-sm text-vault-300">Remember me</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-vault-gold to-vault-goldLight text-vault-900 shadow-lg glow-gold active:scale-[0.98] transition disabled:opacity-50"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>

              <button
                type="button"
                onClick={handleGuestContinue}
                className="w-full py-3 rounded-xl font-semibold text-sm text-vault-400 bg-transparent border border-vault-700 active:scale-[0.98] transition hover:text-white hover:border-vault-500"
              >
                Continue as Guest
              </button>
            </form>
          )}

          {/* Sign Up Form */}
          {mode === "signup" && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="text-xs text-vault-400 font-semibold uppercase tracking-wider mb-1.5 block">
                  Username
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-vault-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      validateUsername(e.target.value);
                    }}
                    placeholder="Choose a username"
                    required
                    minLength={3}
                    maxLength={20}
                    className="w-full bg-vault-800 border border-vault-700 rounded-xl py-3 pl-10 pr-10 text-sm text-white placeholder-vault-500 focus:outline-none focus:border-vault-gold transition"
                  />
                  {usernameValid && (
                    <Check size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-vault-gem" />
                  )}
                  {usernameError && (
                    <AlertTriangle size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-vault-danger" />
                  )}
                </div>
                {usernameError && (
                  <p className="text-xs text-vault-danger mt-1">{usernameError}</p>
                )}
                {usernameValid && (
                  <p className="text-xs text-vault-gem mt-1">Looks good!</p>
                )}
              </div>

              <div>
                <label className="text-xs text-vault-400 font-semibold uppercase tracking-wider mb-1.5 block">
                  Email
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-vault-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full bg-vault-800 border border-vault-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-vault-500 focus:outline-none focus:border-vault-gold transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-vault-400 font-semibold uppercase tracking-wider mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-vault-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password (min 6 chars)"
                    required
                    minLength={6}
                    className="w-full bg-vault-800 border border-vault-700 rounded-xl py-3 pl-10 pr-10 text-sm text-white placeholder-vault-500 focus:outline-none focus:border-vault-gold transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-vault-400 hover:text-white transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-vault-800/50 rounded-lg p-3 border border-vault-700/50">
                <Shield size={16} className="text-vault-gold mt-0.5 shrink-0" />
                <p className="text-xs text-vault-400">
                  By creating an account, your game progress is saved to the cloud. You can play on any device and never lose your data.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading || !usernameValid}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-vault-gold to-vault-goldLight text-vault-900 shadow-lg glow-gold active:scale-[0.98] transition disabled:opacity-50"
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </button>

              <button
                type="button"
                onClick={handleGuestContinue}
                className="w-full py-3 rounded-xl font-semibold text-sm text-vault-400 bg-transparent border border-vault-700 active:scale-[0.98] transition hover:text-white hover:border-vault-500"
              >
                Continue as Guest
              </button>
            </form>
          )}

          {/* Benefits section */}
          <div className="mt-8 bg-vault-800/50 rounded-2xl p-4 border border-vault-700/50">
            <h4 className="text-sm font-bold text-vault-gold mb-3 flex items-center gap-2">
              <Shield size={16} />
              Why create an account?
            </h4>
            <div className="space-y-2">
              <BenefitItem text="Cloud saves - never lose progress" />
              <BenefitItem text="Cross-device play" />
              <BenefitItem text="Real leaderboard rankings" />
              <BenefitItem text="Permanent stats & achievements" />
              <BenefitItem text="Free forever - no credit card" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-vault-300">
      <Check size={14} className="text-vault-gem shrink-0" />
      <span>{text}</span>
    </div>
  );
}
