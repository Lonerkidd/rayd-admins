'use client'

import PortfolioList from '@/app/portfolio-list/components/portfoliolist'
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { NumberTicker } from "@/components/magicui/number-ticker";
import Breadcrumber from "@/components/breadcrumber"
import { TypingAnimation } from "@/components/magicui/typing-animation"

export default function DashboardPage() {
  const router = useRouter();
  return (
    <div className="flex flex-col min-h-screen">
      <Breadcrumber />
      {/* Header Section */}
      <header className="w-full bg-black p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-0 p-1">
        <div>
        <TypingAnimation className="text-3xl font-heading font-medium text-white">Welcome to RayDawn Admin</TypingAnimation>
        <p className="mt-1 text-1xl font-semibold text-white">Manage your portfolio content from here</p>
        </div>
        <button 
          onClick={()=>router.push('/uploads')}
          className="mt-4 md:mt-0 inline-flex items-center justify-center rounded-md bg-gradient-to-r from-[#F57C1F] to-[#0F9B99] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 cursor-pointer"
          >
          + Add New Item
         </button>
        
        </div>
      </header>

      {/* Main Content Section */}
          <main className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        {/* Portfolio Items Card */}
        <div className="rounded-xl p-[2px] bg-gradient-to-r from-[#F57C1F] to-[#0F9B99]">
          <div className="aspect-video rounded-xl bg-background p-0 flex flex-col border-2 border-transparent">
            <h3 className="font-heading text-4xl font-bold text-white p-4 pb-0">Portfolio Items</h3>
            <div className="flex flex-col items-start gap-2 justify-center flex-grow px-4">
            <NumberTicker
                value={18}
                className="whitespace-pre-wrap text-8xl font-medium tracking-tighter text-[#0F9B99] dark:text-white"
              />
              <p className="mt-1 text-1xl font-medium text-white">Total portfolio items</p>
            </div>
          </div>
        </div>
        {/* Categories Card */}
        <div className="rounded-xl p-[2px] bg-gradient-to-r from-[#F57C1F] to-[#0F9B99]">
          <div className="aspect-video rounded-xl bg-background p-0 flex flex-col border-2 border-transparent">
            <h3 className="font-heading text-4xl font-bold text-white p-4 pb-0">Categories</h3>
            <div className="flex flex-col items-start gap-2 justify-center flex-grow px-4">
              <NumberTicker
                value={8}
                className="whitespace-pre-wrap text-8xl font-medium tracking-tighter text-[#F57C1F] dark:text-white"
              />
              <p className="mt-1 mb-3 text-1xl font-medium text-white">Different content categories</p>
            </div>
          </div>
        </div>
        {/* Clients Card */}
        <div className="rounded-xl p-[2px] bg-gradient-to-r from-[#F57C1F] to-[#0F9B99]">
          <div className="aspect-video rounded-xl bg-background p-0 flex flex-col border-2 border-transparent">
            <h3 className="font-heading text-4xl font-bold text-white p-4 pb-0">Clients</h3>
            <div className="flex flex-col items-start gap-2 justify-center flex-grow px-4">
            <NumberTicker
              value={42}
              className="whitespace-pre-wrap text-8xl font-medium tracking-tighter text-[#0F9B99] dark:text-white"
            />
              <p className="mt-1 text-1xl font-medium text-white">Total clients featured</p>
            </div>
          </div>
        </div>
      </div>
      {/* Recent Portfolio Items Card */}
      <div className="rounded-xl p-[2px] bg-black mb-8">
        <Card className="bg-black p-6 rounded-lg shadow-md border-2 border-transparent">
          <h2 className="text-4xl font-heading font-medium mb-4 text-white">Recent Portfolio Items</h2>
          <PortfolioList />
        </Card>
      </div>
    </div>
      </main>
    </div>
  );
}
