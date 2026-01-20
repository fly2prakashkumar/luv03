'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">Loading...</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-bold font-headline">My Account</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and track your orders.</p>
      </div>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
          <TabsTrigger value="orders">Order History</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal details here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-sm text-muted-foreground">{user.displayName || 'N/A'}</p>
              </div>
              <Separator/>
              <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user.email || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="addresses">
          <Card>
            <CardHeader>
              <CardTitle>Saved Addresses</CardTitle>
              <CardDescription>
                Manage your shipping and billing addresses.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-10">
              <p className="text-muted-foreground mb-4">No saved addresses found.</p>
              <Button>Add Address</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>
                View your past purchases.
              </CardDescription>
            </CardHeader>
            <CardContent>
                 <p className="text-sm text-muted-foreground">You haven't placed any orders yet.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
