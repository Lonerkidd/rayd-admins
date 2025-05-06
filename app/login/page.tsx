"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/Authcontext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import logo from "@/public/images/logo.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login, user } = useAuth();
  console.log("useAuth login function:", login);
  const { toast } = useToast();

  useEffect(() => {
    console.log("User state updated:", user);
  }, [user]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleLogin triggered");

    if (email === "warren@gmail.com" && password === "123456789") {
      const user = {
        name: "Warren",
        email: "warren@gmail.com",
        avatar: "/avatars/shadcn.jpg",
      };
      console.log("Logging in user:", user);
      login(user); // Set the user in the AuthContext
      console.log("Redirecting to /dashboard");
      router.push("/dashboard"); // Redirect to the dashboard
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center  justify-center bg-black  p-6">
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

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-left">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-gray-700 bg-gray-800 text-white"
                required
              />
            </div>

            <div className="text-left pb-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-gray-700 bg-gray-800 text-white"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#F57C1F] to-[#0F9B99] hover:opacity-90 text-white"
            >
              Login
            </Button>
          </form>

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