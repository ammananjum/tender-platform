'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  // Decode user ID from token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserId(decoded.id?.toString() || decoded.userId?.toString() || null);
      } catch {
        setUserId(null);
      }
    }
  }, []);

  // ✅ Fetch companies
  const fetchCompanies = async (query = '') => {
    try {
      setLoading(true);
      const url = query
        ? `https://aaf66dd5-0f58-4260-b5c7-2500d873a104-00-1nmayt2nnhqz.sisko.replit.dev/api/companies/search?query=${query}`
        : `https://aaf66dd5-0f58-4260-b5c7-2500d873a104-00-1nmayt2nnhqz.sisko.replit.dev/api/companies`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch companies');
      const data = await res.json();
      setCompanies(data);
      setMessage(data.length === 0 ? 'No companies found.' : '');
    } catch (err) {
      console.error(err);
      setMessage('Error loading companies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // ✅ Search form
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCompanies(search);
  };

  // ✅ Delete company
  const handleDelete = async () => {
    const confirmed = confirm('Are you sure you want to delete your company?');
    if (!confirmed) return;

    try {
      const res = await fetch('https://aaf66dd5-0f58-4260-b5c7-2500d873a104-00-1nmayt2nnhqz.sisko.replit.dev/api/companies/delete', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      alert('Company deleted successfully');
      fetchCompanies();
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-white p-10">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10">
        {/* Left Side - Companies */}
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold text-black mb-6">All Companies</h1>

          <form onSubmit={handleSearch} className="mb-6 flex gap-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, industry, or service"
              className="w-full px-4 py-2 border rounded"
            />
            <button
              type="submit"
              className="bg-black text-white px-6 py-2 rounded hover:bg-yellow-400 hover:text-black"
            >
              Search
            </button>
          </form>

          {loading ? (
            <p className="text-gray-600">Loading companies...</p>
          ) : message ? (
            <p className="text-gray-600">{message}</p>
          ) : (
            <div className="space-y-6">
              {companies.map((company: any) => (
                <div
                  key={company.id}
                  className="border rounded-lg p-6 bg-gray-50 shadow relative"
                >
                  <h3 className="text-xl font-bold text-black mb-1">{company.name}</h3>
                  <p className="text-gray-700 italic mb-1">Industry: {company.industry}</p>
                  <p className="text-gray-600 mb-2">{company.description}</p>

                  {company.services?.length > 0 && (
                    <p className="text-sm text-gray-500 mb-2">
                      Services: {company.services.join(', ')}
                    </p>
                  )}

                  <Link
                    href={`/companies/${company.id}`}
                    className="inline-block bg-black text-white px-4 py-2 rounded hover:bg-yellow-400 hover:text-black mt-2"
                  >
                    View Profile
                  </Link>

                  {/* ✅ Show Edit/Delete only if it's user's own company */}
                  {userId && company.user_id === userId && (
                    <div className="flex gap-4 mt-3">
                      <Link
                        href="/companies/edit"
                        className="text-green-600 font-semibold underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={handleDelete}
                        className="text-red-600 font-semibold underline"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side - Illustration */}
        <div className="hidden md:block md:w-1/3">
          <img
            src="/company.svg"
            alt="Company illustration"
            className="w-full h-auto rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
