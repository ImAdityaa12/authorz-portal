"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Leaf, EnvelopeSimple, Lock, ArrowRight, CircleNotch } from "@phosphor-icons/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(
          data.user.role === "admin" ? "/admin/dashboard" : "/author/dashboard"
        );
      } else {
        setError("Invalid email or password");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-zinc-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(5,150,105,0.15),_transparent_60%)]" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <Leaf className="text-white" size={22} weight="bold" />
            </div>
            <span className="text-xl font-semibold text-white tracking-tight">
              BookLeaf
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-semibold text-white tracking-tighter leading-none mb-4">
              Author Support
              <br />
              & Communication
              <br />
              Portal
            </h1>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
              Manage your publications, track royalties, and connect with
              our support team in one place.
            </p>
          </motion.div>

          <div className="flex gap-6">
            <div>
              <p className="text-2xl font-semibold text-white font-mono">10</p>
              <p className="text-sm text-zinc-500">Authors</p>
            </div>
            <div className="w-px bg-zinc-800" />
            <div>
              <p className="text-2xl font-semibold text-white font-mono">18</p>
              <p className="text-sm text-zinc-500">Books</p>
            </div>
            <div className="w-px bg-zinc-800" />
            <div>
              <p className="text-2xl font-semibold text-white font-mono">6.1K+</p>
              <p className="text-sm text-zinc-500">Copies Sold</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[380px]"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
              <Leaf className="text-white" size={20} weight="bold" />
            </div>
            <span className="text-lg font-semibold tracking-tight">BookLeaf</span>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 mb-1">
            Welcome back
          </h2>
          <p className="text-sm text-muted mb-8">
            Sign in to your BookLeaf account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <EnvelopeSimple
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                  size={18}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-white text-sm placeholder:text-zinc-400 focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                  size={18}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-white text-sm placeholder:text-zinc-400 focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors outline-none"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-danger bg-red-50 px-3 py-2 rounded-lg"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-zinc-900 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-zinc-800 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <CircleNotch size={18} className="animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight size={16} weight="bold" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 p-4 rounded-xl bg-zinc-50 border border-border">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
              Demo credentials
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Admin</span>
                <code className="text-xs bg-white px-2 py-0.5 rounded border border-border font-mono">
                  admin@bookleaf.in / admin123
                </code>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Author</span>
                <code className="text-xs bg-white px-2 py-0.5 rounded border border-border font-mono">
                  priya.sharma@email.com / author123
                </code>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
