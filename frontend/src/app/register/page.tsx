'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Account created! Redirecting to login...');
        setTimeout(() => router.push('/login'), 1500);
      } else {
        setMessage('❌ ' + (data.message || 'Something went wrong'));
      }
    } catch (err) {
      setMessage('❌ Failed to connect to server');
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-black mb-6 text-center">Register</h2>

          {message && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
              required
            />
            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded-lg font-semibold"
            >
              Register
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-accent font-semibold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>

      {/* Image Section */}
      <div className="hidden md:block md:w-1/2">
        <img
          src="/auth-register.svg"
          alt="Register illustration"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
