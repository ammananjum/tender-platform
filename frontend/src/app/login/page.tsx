'use client';
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const res = await fetch("https://aaf66dd5-0f58-4260-b5c7-2500d873a104-00-1nmayt2nnhqz.sisko.replit.dev/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (err) {
      setErrorMsg("Server error. Try again later.");
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-black mb-6 text-center">Login</h2>

          {errorMsg && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded-lg font-semibold"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link href="/register" className="text-accent font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>

      {/* Image Section */}
      <div className="hidden md:block md:w-1/2">
        <img
          src="/auth-login.svg"
          alt="Login illustration"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
