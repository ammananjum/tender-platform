'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function TenderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [tender, setTender] = useState<any>(null);
  const [proposal, setProposal] = useState('');
  const [message, setMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    const fetchTender = async () => {
      try {
        const res = await fetch(`https://aaf66dd5-0f58-4260-b5c7-2500d873a104-00-1nmayt2nnhqz.sisko.replit.dev/api/tenders`);
        const data = await res.json();
        const selectedTender = data.find((t: any) => t.id === Number(id));
        setTender(selectedTender);
      } catch (error) {
        console.error( Error fetching tender:', error);
      }
    };

    fetchTender();
  }, [id]);

  const handleApply = async () => {
    setMessage('Submitting...');
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('https://aaf66dd5-0f58-4260-b5c7-2500d873a104-00-1nmayt2nnhqz.sisko.replit.dev/api/tenders/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tender_id: id, proposal }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessage('Proposal submitted!');
      setProposal('');
    } catch (error: any) {
      console.error('Error applying:', error);
      setMessage(error.message || 'Submission failed');
    }
  };

  if (!tender) return <p className="p-10 text-gray-600">Loading tender details...</p>;

  return (
    <div className="min-h-screen w-full bg-white text-black px-6 py-12">
      <div className="max-w-3xl mx-auto bg-white">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">{tender.title}</h1>
        <p className="text-gray-800 mb-3">{tender.description}</p>
        <p className="text-gray-700 mb-1"> Budget: ${tender.budget}</p>
        <p className="text-gray-700 mb-6"> Deadline: {tender.deadline}</p>

        {isAuthenticated ? (
          <div className="space-y-4 mt-6">
            <textarea
              placeholder="Enter your proposal"
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              className="w-full border border-gray-300 rounded p-3"
              rows={5}
            ></textarea>

            <button
              onClick={handleApply}
              className="bg-black text-white px-6 py-2 rounded hover:bg-yellow-400 hover:text-black transition"
            >
              Submit Proposal
            </button>

            {message && <p className="text-blue-600">{message}</p>}
          </div>
        ) : (
          <p className="text-red-600 mt-6">
            Please{' '}
            <a href="/login" className="underline text-blue-600">
              log in
            </a>{' '}
            to apply for this tender.
          </p>
        )}
      </div>
    </div>
  );
}
