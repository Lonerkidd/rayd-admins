'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import PortfolioList from '@/app/portfolio-list/components/portfoliolist'
import BreadcrumbBar from "@/components/breadcrumber"

const PortfolioPage = () => {
  const router = useRouter();
  return (
    
      <div>
        <BreadcrumbBar />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 ml-4 gap-2 mb-3">
          <div>
            <h1 className="text-3xl font-heading font-medium text-white">Portfolio Gallery</h1>
            <p className="mt-1 text-gray-400">Manage all your portfolio items</p>
          </div>
          <button 
            onClick={() => router.push('/upload')}
            className="mt-4 mr-5 md:mt-0 inline-flex items-center justify-center rounded-md bg-gradient-to-r from-[#F57C1F] to-[#0F9B99] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 cursor-pointer"
          >
            + Add New Item
          </button>
        </div>
        
        <div className="bg-transparent p-6 rounded-lg shadow-md mt-4">
          <PortfolioList />
        </div>
      </div>
  );
};

export default PortfolioPage;
