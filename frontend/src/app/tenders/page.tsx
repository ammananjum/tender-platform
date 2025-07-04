'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Tender {
  id: number;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  company_id: number;
  created_at: string;
}

export default function TendersPage() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const res = await fetch('https://aaf66dd5-0f58-4260-b5c7-2500d873a104-00-1nmayt2nnhqz.sisko.replit.dev/api/tenders');
        const data = await res.json();
        setTenders(data);
      } catch (error) {
        console.error('Error fetching tenders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTenders();
  }, []);

  if (loading) return <p className="p-10 text-gray-600">Loading tenders...</p>;

  return (
    <div className="min-h-screen bg-white px-10 py-12 flex flex-col lg:flex-row gap-12 items-start">
      {/* Left: Tender Cards */}
      <div className="w-full lg:w-2/3">
        <h1 className="text-3xl font-bold text-blue-700 mb-8">All Tenders</h1>

        {tenders.length === 0 ? (
          <p className="text-gray-600">No tenders available right now.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {tenders.map((tender) => (
              <div
                key={tender.id}
                className="border p-6 rounded-lg shadow hover:shadow-md transition bg-gray-50"
              >
                <h2 className="text-xl font-semibold text-black mb-2">{tender.title}</h2>
                <p className="text-gray-700 mb-2 line-clamp-3">{tender.description}</p>
                <p className="text-sm text-gray-500 mb-2">
                  Budget: <span className="font-medium">${tender.budget}</span>
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Deadline: <span className="font-medium">{tender.deadline}</span>
                </p>
                <Link
                  href={`/tenders/${tender.id}`}
                  className="text-white bg-black px-4 py-2 rounded hover:bg-yellow-400 hover:text-black transition text-sm font-medium"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: Illustration */}
      <div className="hidden lg:block lg:w-1/3">
        <img
          src="/Product.svg"  
          alt="Tender Illustration"
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
}
