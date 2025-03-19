import React from 'react';
import { Code } from 'lucide-react';
import SellCodeForm from '@/components/SellCodeForm';

const SellCode = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2">
            <Code className="text-teal-500" size={24} />
            <h1 className="text-xl font-bold">Sell Your Code</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Create a New Listing</h2>
            <p className="text-slate-400">
              List your code on the marketplace and earn ETH. All listings are priced at 0.03 ETH.
            </p>
          </div>

          <div className="bg-slate-800 rounded-lg p-6">
            <SellCodeForm />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SellCode; 