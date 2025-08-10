import { useEffect, useMemo, useState } from "react";
import type { createAuthClient } from "better-auth/react";
import { authClient as defaultAuthClient } from "../lib/auth-client";
import { signInWithAlbedo } from "../lib/stellar";
import { Button } from "./ui/button";

type View = "login" | "signup" | "forgot" | "reset" | "success";

export function AuthModal({
  open,
  onClose,
  client,
}: {
  open: boolean;
  onClose: () => void;
  client?: ReturnType<typeof createAuthClient>;
}) {
  const authClient = client ?? defaultAuthClient;
  const [view, setView] = useState<View>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [newPassword, setNewPassword] = useState("");

  // Detect reset token from URL if present
  const resetToken = useMemo(() => {
    try {
      const url = new URL(window.location.href);
      return url.searchParams.get("token");
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (open) {
      setError(null);
      setMessage(null);
      // Auto-switch to reset view if token exists
      if (resetToken) setView("reset");
    }
  }, [open, resetToken]);

  const close = () => {
    if (loading) return;
    onClose();
  };

  async function signInWithGoogle() {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "http://localhost:5173",
      });
    } catch (e: any) {
      setError(e?.message ?? "Failed to sign in with Google");
    }
  }

  async function signInWithStellar() {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await signInWithAlbedo(authClient);
      // Eagerly refresh session so UI reflects signed-in state
      try {
        const anyClient = authClient as any;
        const refresh = anyClient.getSession || anyClient.session?.get;
        if (typeof refresh === "function") {
          await refresh();
        } else if (typeof anyClient.$fetch === "function") {
          await anyClient.$fetch("/get-session", { method: "GET" });
        }
      } catch {
        // ignore refresh errors; fallback to reload below
      }

      setMessage("Signed in with Stellar.");
      setView("success");
      // Ensure hooks see the new cookie in all cases
      setTimeout(() => {
        try {
          window.location.reload();
        } catch {}
      }, 0);
    } catch (e: any) {
      setError(e?.message ?? "Failed to sign in with Stellar");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp() {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await authClient.signUp.email({ name, email, password });
      setMessage(
        "Account created. Please check your email to verify your account."
      );
      setView("success");
    } catch (e: any) {
      setError(e?.message ?? "Failed to sign up");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignIn() {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await authClient.signIn.email(
        { email, password, rememberMe },
        {
          onSuccess: () => {
            setMessage("Signed in successfully.");
            setView("success");
          },
          onError: async (ctx) => {
            if (ctx.error?.status === 403) {
              setError(
                "Please verify your email address. We can resend the verification link."
              );
            } else {
              setError(ctx.error?.message ?? "Failed to sign in");
            }
          },
        }
      );
    } catch (e: any) {
      setError(e?.message ?? "Failed to sign in");
    } finally {
      setLoading(false);
    }
  }

  async function resendVerification() {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await authClient.sendVerificationEmail({
        email,
        callbackURL: window.location.origin,
      });
      setMessage("Verification email sent. Check your inbox.");
    } catch (e: any) {
      setError(e?.message ?? "Failed to send verification email");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}?callback=/login`,
      });
      setMessage(
        "If an account exists for this email, a reset link has been sent."
      );
      setView("success");
    } catch (e: any) {
      setError(e?.message ?? "Failed to request password reset");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    if (!resetToken) {
      setError("Missing or invalid reset token.");
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await authClient.resetPassword({ newPassword, token: resetToken });
      setMessage("Password has been reset. You can now sign in.");
      setView("login");
    } catch (e: any) {
      setError(e?.message ?? "Failed to reset password");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Connect</h2>
          <button onClick={close} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="mb-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={signInWithGoogle}
            disabled={loading}
          >
            Continue with Google
          </Button>
        </div>
        <div className="mb-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={signInWithStellar}
            disabled={loading}
          >
            Continue with Stellar (Albedo)
          </Button>
        </div>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-500">Or continue with email</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="mb-4 flex gap-2">
          <TabButton active={view === "login"} onClick={() => setView("login")}>
            Login
          </TabButton>
          <TabButton
            active={view === "signup"}
            onClick={() => setView("signup")}
          >
            Sign Up
          </TabButton>
          <TabButton
            active={view === "forgot"}
            onClick={() => setView("forgot")}
          >
            Forgot
          </TabButton>
        </div>

        {error && (
          <p className="mb-3 rounded bg-red-50 p-2 text-sm text-red-700">
            {error}
          </p>
        )}
        {message && (
          <p className="mb-3 rounded bg-green-50 p-2 text-sm text-green-700">
            {message}
          </p>
        )}

        {view === "signup" && (
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              handleSignUp();
            }}
          >
            <TextInput label="Name" value={name} onChange={setName} required />
            <TextInput
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              required
            />
            <TextInput
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              required
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create account"}
              </Button>
            </div>
          </form>
        )}

        {view === "login" && (
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              handleSignIn();
            }}
          >
            <TextInput
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              required
            />
            <TextInput
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              required
            />
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                className="size-4"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>

            {error?.toLowerCase().includes("verify") && (
              <div className="flex items-center justify-between text-sm text-gray-700">
                <button
                  type="button"
                  className="underline"
                  onClick={resendVerification}
                  disabled={loading}
                >
                  Resend verification email
                </button>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                className="text-sm underline"
                onClick={() => setView("forgot")}
              >
                Forgot password?
              </button>
              <Button type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>
        )}

        {view === "forgot" && (
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              handleForgotPassword();
            }}
          >
            <TextInput
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              required
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send reset link"}
              </Button>
            </div>
          </form>
        )}

        {view === "reset" && (
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              handleResetPassword();
            }}
          >
            <TextInput
              label="New Password"
              type="password"
              value={newPassword}
              onChange={setNewPassword}
              required
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Reset password"}
              </Button>
            </div>
          </form>
        )}

        {view === "success" && (
          <div className="space-y-3 text-sm text-gray-700">
            <p>Done. You can close this window.</p>
            <div className="flex justify-end">
              <Button onClick={close}>Close</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded px-3 py-1 text-sm ${
        active
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );
}

function TextInput({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="grid gap-1">
      <label htmlFor={id} className="text-sm text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none ring-2 ring-transparent focus:border-gray-400 focus:ring-gray-200"
      />
    </div>
  );
}
