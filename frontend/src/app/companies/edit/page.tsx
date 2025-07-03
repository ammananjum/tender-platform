'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CompanyEditPage() {
  const [company, setCompany] = useState<any>(null);
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch('http://localhost:5000/api/companies/my-profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setCompany(data);
          setName(data.name || '');
          setIndustry(data.industry || '');
          setDescription(data.description || '');
        } else if (res.status === 404) {
          setCompany(null);
        } else {
          const error = await res.json();
          console.error('❌ Fetch error:', error.message);
        }
      } catch (error) {
        console.error('❌ Error fetching company:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setMessage('Saving...');

    const method = company ? 'PUT' : 'POST';
    const url = company
      ? 'http://localhost:5000/api/companies/update'
      : 'http://localhost:5000/api/companies';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name, industry, description }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');

      if (logoFile) {
        const formData = new FormData();
        formData.append('file', logoFile);

        const uploadRes = await fetch('http://localhost:5000/api/companies/upload-logo', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.message || 'Upload failed');
      }

      setMessage('✅ Company profile saved!');
      router.push('/companies');
    } catch (err: any) {
      console.error('❌ Submit error:', err);
      setMessage(err.message || 'Something went wrong');
    }
  };

  const handleDelete = async () => {
    const confirmed = confirm('Are you sure you want to delete your company profile?');
    if (!confirmed) return;

    try {
      const res = await fetch('http://localhost:5000/api/companies/delete', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete');

      alert('Deleted successfully!');
      router.push('/companies');
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  if (loading) return <p className="p-10 text-gray-600">Loading profile...</p>;

  return (
    <div className="min-h-screen bg-white px-10 py-12 flex flex-col lg:flex-row gap-10 items-start">
      {/* ✅ Left: Form */}
      <div className="w-full lg:w-1/2 space-y-6">
        <h1 className="text-3xl font-extrabold text-blue-600">
          {company ? 'Update Company Profile' : 'Create Company Profile'}
        </h1>

        {message && <p className="text-green-600 font-medium">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Company Name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg"
            required
          />
          <input
            type="text"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="Industry"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg"
            rows={4}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
            className="w-full text-sm"
          />

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              type="submit"
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-yellow-400 hover:text-black font-medium transition"
            >
              {company ? 'Update Profile' : 'Create Profile'}
            </button>

            {company && (
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-400 font-medium transition"
              >
                Delete Profile
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ✅ Right: Default Image */}
      <div className="hidden lg:block lg:w-1/2">
        <img
          src="/Profile.svg" // ✅ Replace this path with your own later
          alt="Company form illustration"
          className="w-full h-auto rounded-lg shadow-md"
        />
      </div>
    </div>
  );
}
