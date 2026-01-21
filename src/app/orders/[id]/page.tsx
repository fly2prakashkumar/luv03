
'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Order } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { Suspense } from 'react';

function OrderDetails() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const userIdFromQuery = searchParams.get('userId');
  
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const orderRef = useMemoFirebase(() => {
    if (isUserLoading || !id || !firestore) return null;
    
    // Admins can view any order if userId is in query.
    // Regular users can only view their own orders.
    const effectiveUserId = user?.email === 'admin@gmail.com' && userIdFromQuery ? userIdFromQuery : user?.uid;

    if (!effectiveUserId) return null;
    
    return doc(firestore, 'users', effectiveUserId, 'orders', id);
  }, [firestore, id, user, isUserLoading, userIdFromQuery]);

  const { data: order, isLoading } = useDoc<Order>(orderRef);
  
  if (isLoading || isUserLoading) {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-8 md:py-16">
            <Skeleton className="h-10 w-24 mb-8" />
            <div className="space-y-6">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8 md:py-16 text-center">
         <h1 className="text-2xl font-bold font-headline mb-4">Order Not Found</h1>
         <p className="text-muted-foreground mb-6">We couldn't find the order you're looking for. It might have been moved or deleted.</p>
         <Button onClick={() => router.push('/')}>Go to Homepage</Button>
      </div>
    );
  }

  const subtotal = order.items?.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0) || 0;
  const totalAmount = order.totalAmount || 0;
  const shipping = totalAmount - subtotal > 0 ? totalAmount - subtotal : 0;
  
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-16">
        <div className="mb-6">
            <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
        </div>
      <div className="space-y-6">
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div>
                        <CardTitle className="text-2xl font-bold font-headline">Order Details</CardTitle>
                        <CardDescription>Order ID: <span className="font-mono">{order.id}</span></CardDescription>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        <p>Placed on: {order.orderDate?.seconds ? format(new Date(order.orderDate.seconds * 1000), 'PPP') : 'N/A'}</p>
                        <p>Status: <Badge variant={
                            order.status === 'placed' ? 'default' : 
                            order.status === 'shipped' ? 'secondary' :
                            'outline'
                        } className="capitalize ml-1">{order.status || 'unknown'}</Badge></p>
                    </div>
                </div>
            </CardHeader>
        </Card>
        <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Items Ordered</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {order.items?.map(item => (
                                <div key={item.productId} className="flex items-start gap-4">
                                    <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0 bg-muted">
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
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">₹{((item.price || 0) * (item.quantity || 0)).toFixed(2)}</p>
                                        <p className="text-sm text-muted-foreground">₹{(item.price || 0).toFixed(2)} each</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Shipping Address</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                        {order.shippingAddress ? (
                            <>
                                <p className="font-semibold">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                                <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
                                <p className="text-muted-foreground">{order.shippingAddress.address}</p>
                                <p className="text-muted-foreground">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                <p className="text-muted-foreground">{order.shippingAddress.country}</p>
                            </>
                        ) : (
                            <p className="text-muted-foreground">No shipping address provided.</p>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Shipping</span>
                            <span>₹{shipping.toFixed(2)}</span>
                        </div>
                        <Separator />
                         <div className="flex justify-between font-bold text-base">
                            <span>Total</span>
                            <span>₹{totalAmount.toFixed(2)}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}


export default function OrderPage() {
    return (
      <Suspense fallback={<div className="container mx-auto max-w-4xl px-4 py-8 md:py-16"><Skeleton className="h-screen w-full" /></div>}>
        <OrderDetails />
      </Suspense>
    );
}
