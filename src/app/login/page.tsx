
'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUser, useAuth } from "@/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" {...props} fill="currentColor">
      <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.2 74.2C313.6 113.4 283.3 97.4 248 97.4c-85.3 0-153.9 68.6-153.9 158.6s68.6 158.6 153.9 158.6c99.9 0 137.3-82.9 140.8-120.9H248v-94.2h236.3c4.7 25.4 7.7 54.2 7.7 84.1z"/>
    </svg>
  );

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && user) {
        if (user.email === 'admin@gmail.com') {
            router.push('/admin');
        } else {
            router.push('/account');
        }
    }
  }, [user, isUserLoading, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        // The useEffect will handle the redirect
      })
      .catch((error: any) => {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: error.message || "Invalid email or password.",
        });
      });
  };

  const handleGoogleSignIn = () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(() => {
        toast({
          title: "Login Successful",
          description: "Welcome!",
        });
         // The useEffect will handle the redirect
      })
      .catch((error: any) => {
        toast({
          variant: "destructive",
          title: "Google Sign-In Failed",
          description: error.message || "Could not sign in with Google.",
        });
      });
  };

  if (isUserLoading || user) {
    // Show a loading indicator while checking auth state or if user is already logged in (and redirecting)
    return <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">Loading...</div>;
  }

  return (
    <div className="w-full flex items-center justify-center py-12 min-h-[calc(100vh-8rem)]">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold font-headline">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input 
                id="password" 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
           <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                    </span>
                </div>
            </div>
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
               <GoogleIcon className="mr-2 h-4 w-4" />
               Sign in with Google
            </Button>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </div>
    </div>
  );
}
