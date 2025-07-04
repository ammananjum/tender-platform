'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function CompanyProfilePage() {
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await fetch(`https://aaf66dd5-0f58-4260-b5c7-2500d873a104-00-1nmayt2nnhqz.sisko.replit.dev/api/companies/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Error fetching company');
        setCompany(data);
      } catch (err) {
        console.error('Error loading company:', err);
        setCompany(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCompany();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-white p-6">Loading company...</div>;
  }

  if (!company) {
    return <div className="min-h-screen bg-white p-6 text-red-500">Company not found.</div>;
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center px-6 py-10"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=1400&q=80')`, // you can change this
      }}
    >
      <div className="bg-white bg-opacity-90 max-w-4xl mx-auto flex flex-col md:flex-row gap-10 p-8 rounded shadow-lg">
        {/* Left content */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-black mb-4">{company.name}</h1>
          <p className="text-gray-700 mb-2 italic">Industry: {company.industry}</p>
          <p className="text-gray-600 mb-4">{company.description}</p>

          {company.services && company.services.length > 0 && (
            <p className="text-sm text-gray-500">
              Services: {company.services.join(', ')}
            </p>
          )}
        </div>

        {/* Right content (logo) */}
        <div className="w-full md:w-60">
          {company.logo_url ? (
            <img
              src={company.logo_url}
              alt={`${company.name} logo`}
              className="rounded-lg shadow-md w-full h-auto object-contain"
            />
          ) : (
            <div className="w-full h-40 bg-gray-200 rounded flex items-center justify-center text-gray-400">
              No Logo
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
