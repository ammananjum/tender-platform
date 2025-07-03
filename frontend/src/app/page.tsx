'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Text Content */}
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Empowering Companies to Find the Right Opportunities
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            CareerTender connects businesses with tenders and services that match their needs. Create a profile, post or apply to tenders, and grow your reach.
             Whether you're posting a project or applying to one, our modern tender-management platform helps
            simplify and speed up the entire process with clarity and professionalism.
          </p>
          <Link href="/signup">
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition">
              Get Started
            </button>
          </Link>
        </div>

        {/* Image */}
        <div className="w-full">
          <Image
            src="/hero.jpg"
            alt="CareerTender Hero"
            width={600}
            height={400}
            priority
            className="w-full rounded-xl shadow-lg object-cover"
          />
        </div>

      </div>
    </main>
  );
}
