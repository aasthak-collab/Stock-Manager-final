"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import api from "../../libraries/axios";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/api/auth/login", {
        email: email.trim(),
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      await signIn(
        "google",
        {
          callbackUrl: "/",
        },
        {
          prompt: "select_account",
        }
      );
    } catch {
      setError("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#141414] px-5 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[420px] flex-col justify-center">
        {/* Logo */}
        <div className="mb-12 flex justify-center">
          <img
            src="/logo.png"
            alt="Om Sai Enterprises"
            className="h-32 w-auto object-contain sm:h-36"
          />
        </div>

        <form onSubmit={handleLogin} className="w-full">
          {/* Email */}
          <div className="mb-6">
            <label htmlFor="email" className="sr-only">
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="h-[60px] w-full rounded-full border border-[#3a3a3a] bg-[#1b1b1b] px-5 text-base text-white outline-none transition placeholder:text-[#8a8a8a] focus:border-[#5685ff] focus:ring-1 focus:ring-[#5685ff]"
            />
          </div>

          {/* Password */}
          <div className="relative mb-6">
            <label htmlFor="password" className="sr-only">
              Password
            </label>

            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="h-[60px] w-full rounded-full border border-[#3a3a3a] bg-[#1b1b1b] px-5 pr-14 text-base text-white outline-none transition placeholder:text-[#8a8a8a] focus:border-[#5685ff] focus:ring-1 focus:ring-[#5685ff]"
            />

            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-[#d5d5d5] transition hover:text-white"
            >
              {showPassword ? (
                <EyeOff size={21} />
              ) : (
                <Eye size={21} />
              )}
            </button>
          </div>

          {/* Terms */}
          <p className="mb-6 text-sm leading-6 text-[#bdbdbd]">
            By signing up or logging in, you consent to Om Sai Enterprises&apos;
            <br />
            <a
              href="/terms"
              className="text-white underline underline-offset-2 hover:text-[#5685ff]"
            >
              Terms of Use
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="text-white underline underline-offset-2 hover:text-[#5685ff]"
            >
              Privacy Policy
            </a>
            .
          </p>

          {/* Error */}
          {error && (
            <p
              role="alert"
              className="mb-5 text-center text-sm text-red-400"
            >
              {error}
            </p>
          )}

          {/* Links */}
          <div className="mb-5 flex items-center justify-between text-sm">
            <a
              href="/forgot-password"
              className="text-[#5685ff] transition hover:text-[#80a2ff]"
            >
              Forgot password?
            </a>

            <a
              href="/signup"
              className="text-[#5685ff] transition hover:text-[#80a2ff]"
            >
              Sign up
            </a>
          </div>

          {/* Email login */}
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="h-[54px] w-full rounded-full bg-[#5685ff] text-base font-medium text-white transition hover:bg-[#4678f4] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#3a3a3a]" />
            <span className="text-sm text-[#8a8a8a]">or</span>
            <div className="h-px flex-1 bg-[#3a3a3a]" />
          </div>

          {/* Google login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading || googleLoading}
            className="flex h-[54px] w-full items-center justify-center gap-3 rounded-full border border-[#3a3a3a] bg-[#1b1b1b] text-sm font-medium text-white transition hover:bg-[#252525] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />

              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />

              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />

              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
            </svg>

            {googleLoading ? "Connecting..." : "Continue with Google"}
          </button>
        </form>
      </div>
    </main>
  );
}