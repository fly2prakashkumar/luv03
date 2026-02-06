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
import { useCollection, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { collection, doc, deleteDoc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { AddAddressDialog } from "@/components/account/add-address-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import type { Order } from "@/lib/types";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";


interface Address {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export default function AccountPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const addressesCollection = useMemoFirebase(
    () => (firestore && user ? collection(firestore, 'users', user.uid, 'addresses') : null),
    [firestore, user]
  );
  const { data: addresses, isLoading: isLoadingAddresses } = useCollection<Address>(addressesCollection);
  
  const ordersCollection = useMemoFirebase(
    () => (firestore && user ? collection(firestore, 'users', user.uid, 'orders') : null),
    [firestore, user]
  );
  const { data: orders, isLoading: isLoadingOrders } = useCollection<Order>(ordersCollection);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleDeleteAddress = (addressId: string) => {
    if (!firestore || !user) return;
    const addressRef = doc(firestore, 'users', user.uid, 'addresses', addressId);
    
    deleteDoc(addressRef)
      .then(() => {
        toast({ title: "Address deleted" });
      })
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: addressRef.path,
            operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

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
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Saved Addresses</CardTitle>
                <CardDescription>
                  Manage your shipping and billing addresses.
                </CardDescription>
              </div>
              <AddAddressDialog />
            </CardHeader>
            <CardContent>
              {isLoadingAddresses ? (
                 <div className="space-y-4">
                    <Skeleton className="h-24 w-full rounded-md" />
                    <Skeleton className="h-24 w-full rounded-md" />
                  </div>
              ) : addresses && addresses.length > 0 ? (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <Card key={address.id} className="p-4 flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{address.firstName} {address.lastName}</p>
                        <p className="text-sm text-muted-foreground">{address.phone}</p>
                        <p className="text-sm text-muted-foreground">{address.address}</p>
                        <p className="text-sm text-muted-foreground">{address.city}, {address.postalCode}</p>
                        <p className="text-sm text-muted-foreground">{address.country}</p>
                      </div>
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem disabled>
                              <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                             <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </div>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>This will permanently delete this address.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteAddress(address.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-4">No saved addresses found.</p>
                  <AddAddressDialog />
                </div>
              )}
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
              {isLoadingOrders ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : orders && orders.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {orders.sort((a, b) => (b.orderDate?.seconds || 0) - (a.orderDate?.seconds || 0)).map((order) => (
                    <AccordionItem value={order.id} key={order.id}>
                      <AccordionTrigger>
                        <div className="flex justify-between w-full pr-4">
                          <div className="text-left">
                            <p className="font-semibold">Order ID: <span className="font-mono text-sm">{order.id}</span></p>
                            <p className="text-sm text-muted-foreground">
                              {order.orderDate?.seconds ? format(new Date(order.orderDate.seconds * 1000), 'PPP') : 'N/A'}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            <p className="font-semibold">₹{order.totalAmount.toFixed(2)}</p>
                            <Badge variant={
                                order.status === 'placed' ? 'default' : 
                                order.status === 'shipped' ? 'secondary' :
                                'outline'
                            } className="capitalize mt-1">{order.status}</Badge>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                           {order.items.map(item => (
                             <div key={item.productId} className="flex items-start gap-4">
                                <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                                    {item.imageUrls && item.imageUrls[0] ? (
                                        <Image src={item.imageUrls[0]} alt={item.name || 'Product Image'} fill className="object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center">
                                            <span className="text-xs text-muted-foreground">No Image</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <Link href={`/products/${item.productId}`} className="font-semibold hover:underline">{item.name || 'Unnamed Product'}</Link>
                                    <p className="text-sm text-muted-foreground">Qty: {item.quantity || 0}</p>
                                    <p className="text-sm text-muted-foreground">₹{(item.price || 0).toFixed(2)} each</p>
                                </div>
                                <div className="text-right font-semibold">
                                    <p>₹{((item.price || 0) * (item.quantity || 0)).toFixed(2)}</p>
                                </div>
                            </div>
                           ))}
                           <Separator />
                           <div className="flex justify-end">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={`/orders/${order.id}`}>View Full Order Details</Link>
                                </Button>
                           </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <p className="text-sm text-muted-foreground">You haven't placed any orders yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
