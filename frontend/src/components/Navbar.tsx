'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Tenders', path: '/tenders' },
    { name: 'Companies', path: '/companies' },
    { name: 'Login', path: '/login' },
  ];

  return (
    <nav className="bg-white shadow-md px-6 py-5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-extrabold text-black">CareerTender</div>

        {/* Hamburger - mobile only */}
        <div className="md:hidden">
          <button
            onClick={() => setOpen(!open)}
            className="text-3xl text-black focus:outline-none"
          >
            ☰
          </button>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 items-center">
          {navItems.map((item, i) => (
            <Link
              key={i}
              href={item.path}
              className={`text-lg font-bold px-4 py-2 rounded transition ${
                item.name === 'Login'
                  ? 'bg-black text-white hover:bg-yellow-400 hover:text-black'
                  : 'text-black hover:bg-black hover:text-white'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden mt-2 space-y-2 px-4 pb-4">
          {navItems.map((item, i) => (
            <Link
              key={i}
              href={item.path}
              className={`block text-lg font-bold px-4 py-2 rounded transition ${
                item.name === 'Login'
                  ? 'bg-black text-white hover:bg-yellow-400 hover:text-black'
                  : 'text-black hover:bg-black hover:text-white'
              }`}
              onClick={() => setOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}