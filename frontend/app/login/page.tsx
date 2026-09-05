"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import api from "../../libraries/axios";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="w-full max-w-md px-8 py-10 rounded-2xl border border-gray-200 bg-card shadow-lg flex flex-col items-center gap-6">

        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
          <span className="text-white text-2xl font-bold">OS</span>
        </div>

        <div className="text-center">
          <h1 className="text-beige text-2xl font-bold">Welcome Back</h1>
          <p className="text-soft text-sm mt-1">Sign in to Om Sai Enterprises</p>
        </div>

        <div className="w-full flex flex-col gap-4">
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
            <Mail size={18} className="text-soft" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent text-beige placeholder:text-soft/40 text-sm outline-none flex-1"
            />
          </div>

          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
            <Lock size={18} className="text-soft" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent text-beige placeholder:text-soft/40 text-sm outline-none flex-1"
            />
            <button onClick={() => setShowPassword(!showPassword)}>
              {showPassword
                ? <EyeOff size={18} className="text-soft" />
                : <Eye size={18} className="text-soft" />
              }
            </button>
          </div>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-xl text-sm font-semibold hover:bg-secondary transition-colors mt-2 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}