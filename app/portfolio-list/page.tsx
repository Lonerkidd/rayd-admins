'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import PortfolioList from '@/app/portfolio-list/components/portfoliolist'
import BreadcrumbBar from "@/components/breadcrumber"

const PortfolioPage = () => {
  const router = useRouter();
  return (
    
      <div className="max-w-7xl mx-auto m-5">
        <BreadcrumbBar />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Portfolio Gallery</h1>
            <p className="mt-1 text-muted-foreground">Manage all your portfolio items</p>
          </div>
          <button 
            onClick={() => router.push('/uploads')}
            className="mt-4 md:mt-0 inline-flex items-center justify-center rounded-md bg-gradient-to-r from-[#F57C1F] to-[#0F9B99] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 cursor-pointer"
          >
            + Add New Item
          </button>
        </div>
        
        <div className="bg-secondary p-6 rounded-lg shadow-md border-2 border-accent">
          <PortfolioList />
        </div>
      </div>
  );
};

export default PortfolioPage;
