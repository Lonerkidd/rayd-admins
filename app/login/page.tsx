"use client";

import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import logo from "@/public/images/logo.png";

const LoginPage = () => {

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-6">
      <div className="w-full pb-2 ml-15 max-w-md text-center">
        <Image
          src={logo}
          alt="logo"
          className="w-30 h-30 mx-auto mb-3 ml-40"
        />
        <h1 className="text-4xl font-heading font-bold text-white">
          RayDawn Admin
        </h1>
        <p className="mt-2 text-gray-400">
          Portfolio Management Dashboard
        </p>
      </div>

      <div className="bg-black p-8 rounded-lg w-100 ml-17 shadow-md border-2 border-[#0F9B99]">
        <h2 className="text-xl font-medium mb-6 text-white">
          Welcome to the admin portal
        </h2>
        
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-gradient-to-r from-[#F57C1F] to-[#0F9B99] hover:opacity-90 text-white',
              card: 'bg-transparent',
              headerTitle: 'text-white',
              headerSubtitle: 'text-gray-400',
              formFieldLabel: 'text-gray-300',
              formFieldInput: 'bg-gray-800 text-white border-gray-700',
            }
          }}
        />

        <div className="mt-5 pt-5 ml-3 items-center justify-between border-t border-gray-800 text-sm text-gray-400">
          <p>Access the portfolio management system</p>
        </div>
      </div>

      <div className="mt-8 text-sm ml-13 text-gray-400">
        &copy; {new Date().getFullYear()} RayDawn. All rights reserved.
      </div>
    </div>
  );
};

export default LoginPage;