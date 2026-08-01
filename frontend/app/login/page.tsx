"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (email === "admin@omsai.com" && password === "admin123") {
      localStorage.setItem("auth", "true");
      router.push("/");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sidebar">
      <div className="w-full max-w-md px-8 py-10 rounded-2xl border border-primary/30 bg-primary/10 flex flex-col items-center gap-6">
        
        {/* Logo */}
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
          <span className="text-beige text-2xl font-bold">OS</span>
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-beige text-2xl font-bold">Welcome Back</h1>
          <p className="text-soft text-sm mt-1">Sign in to Om Sai Enterprises</p>
        </div>

        {/* Form */}
        <div className="w-full flex flex-col gap-4">
          {/* Email */}
          <div className="flex items-center gap-3 bg-sidebar border border-primary/30 rounded-xl px-4 py-3">
            <Mail size={18} className="text-soft" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent text-beige placeholder:text-soft/40 text-sm outline-none flex-1"
            />
          </div>

          {/* Password */}
          <div className="flex items-center gap-3 bg-sidebar border border-primary/30 rounded-xl px-4 py-3">
            <Lock size={18} className="text-soft" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent text-beige placeholder:text-soft/40 text-sm outline-none flex-1"
            />
            <button onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff size={18} className="text-soft" />
              ) : (
                <Eye size={18} className="text-soft" />
              )}
            </button>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-xs text-center">{error}</p>
          )}

          {/* Submit */}
          <button
            onClick={handleLogin}
            className="w-full bg-primary text-beige py-3 rounded-xl text-sm font-semibold hover:bg-secondary transition-colors mt-2"
          >
            Sign In
          </button>
        </div>

        {/* Hint */}
        <p className="text-soft/40 text-xs">
          admin@omsai.com / admin123
        </p>
      </div>
    </div>
  );
}