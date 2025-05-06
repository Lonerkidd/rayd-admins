'use client';

import { useAuth } from '@/context/Authcontext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Page from "./dashboard/page";
import BreadcrumbBar from "@/components/breadcrumber"

export default function Home() {

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto">
        <BreadcrumbBar />
        <Page />
      </div>
    </div>
  );
}
