'use client';

import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      setUser(decoded);
    } catch {
      router.push('/login');
    }
  }, []);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/companies/my-profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setCompany(data);
        }
      } catch (err) {
        console.error('❌ Could not fetch company:', err);
      }
    };

    fetchCompany();
  }, []);

  const handleDelete = async () => {
    const confirmDelete = confirm('Are you sure you want to delete your company profile?');
    if (!confirmDelete) return;

    try {
      const res = await fetch('http://localhost:5000/api/companies/delete', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      alert('✅ Company deleted');
      setCompany(null);
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-14">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-start">
        
        {/* ✅ Left Section */}
        <div className="md:w-2/3 space-y-6">
          <h1 className="text-4xl font-extrabold text-indigo-600">
            Welcome{user?.email ? `, ${user.email}` : ''}!
          </h1>
          <p className="text-lg text-gray-700">
            This is your dashboard. Manage your company profile here.
          </p>

          {company ? (
            <div className="border rounded-lg p-6 bg-gray-50 shadow space-y-4">
              <h2 className="text-2xl font-semibold text-black">{company.name}</h2>
              <p className="text-gray-700 italic">Industry: {company.industry}</p>
              <p className="text-gray-600">{company.description}</p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/companies/edit"
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-yellow-400 hover:text-black transition font-medium"
                >
                  Edit Profile
                </Link>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-medium"
                >
                  Delete Profile
                </button>
              </div>
            </div>
          ) : (
             <div className="space-y-8 pt-4">
    <p className="text-gray-700 text-lg">
      You haven’t created a company profile yet.
    </p>
    <Link
      href="/companies/edit"
      className="bg-black text-white text-lg px-8 py-3 rounded-lg hover:bg-yellow-400 hover:text-black transition font-medium"
    >
      Create Company Profile
    </Link>
  </div>
          )}
        </div>

        {/* ✅ Right Section - Image */}
        <div className="hidden md:block md:w-1/3">
          <img
            src="/Dashboard.svg"
            alt="Dashboard illustration"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
