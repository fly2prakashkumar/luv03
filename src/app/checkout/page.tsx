"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, serverTimestamp, runTransaction, doc, increment } from "firebase/firestore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ShieldCheck, CreditCard, Wallet } from "lucide-react";

const formSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().min(10, 'Please enter a valid 10-digit phone number.').max(10, 'Please enter a valid 10-digit phone number.'),
  paymentMethod: z.enum(["phonepe", "gpay", "paytm", "upi"]),
  upiId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

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

const PhonePeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="#6739B7"/>
    </svg>
);

const UpiIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256" {...props}>
      <path fill="#e3641b" d="M128.2 56.7V0h-2.4c-41.5 0-75.1 33.6-75.1 75.1v105.8h56.7V56.7z"/>
      <path fill="#1b459b" d="M128.2 56.7V0h2.4c41.5 0 75.1 33.6 75.1 75.1v105.8h-56.7V56.7z"/>
      <path fill="#219653" d="M50.7 180.9v-27.1h155.1v27.1c0 14.6-11.8 26.5-26.5 26.5H77.2c-14.7 0-26.5-11.9-26.5-26.5z"/>
    </svg>
);

export default function CheckoutPage() {
  const router = useRouter();
  const { state, dispatch } = useCart();
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const [isProcessing, setIsProcessing] = useState(false);

  const addressesCollection = useMemoFirebase(
    () => (firestore && user ? collection(firestore, 'users', user.uid, 'addresses') : null),
    [firestore, user]
  );
  const { data: addresses } = useCollection<Address>(addressesCollection);
  
  const subtotal = state.cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const shipping = 50.00;
  const total = subtotal + shipping;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        email: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        phone: "",
        paymentMethod: "phonepe",
        upiId: "",
    }
  });

  useEffect(() => {
    if (user) {
        if(user.email) form.setValue('email', user.email);
        if (user.displayName) {
            const nameParts = user.displayName.split(' ');
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(' ');
            if(!form.getValues('firstName')) form.setValue('firstName', firstName);
            if(!form.getValues('lastName')) form.setValue('lastName', lastName);
        }
    }
  }, [user, form]);

  async function onSubmit(values: FormValues) {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to place an order.',
      });
      return;
    }

    setIsProcessing(true);

    // Simulate Payment Gateway Redirect & Processing
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const orderPayload = {
      userAccountId: user.uid,
      items: state.cartItems.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        imageUrls: item.product.imageUrls,
      })),
      totalAmount: total,
      shippingAddress: {
        firstName: values.firstName,
        lastName: values.lastName,
        address: values.address,
        city: values.city,
        postalCode: values.postalCode,
        country: values.country,
        phone: values.phone,
      },
      paymentDetails: {
        method: values.paymentMethod,
        upiId: values.upiId,
      },
      orderDate: serverTimestamp(),
      status: 'placed',
    };

    try {
      const newOrderRef = doc(collection(firestore, 'users', user.uid, 'orders'));

      await runTransaction(firestore, async (transaction) => {
        const productRefs = state.cartItems.map(item => doc(firestore, 'products', item.product.id));
        const productDocs = await Promise.all(productRefs.map(ref => transaction.get(ref)));

        for (let i = 0; i < state.cartItems.length; i++) {
          const item = state.cartItems[i];
          const productDoc = productDocs[i];

          if (!productDoc.exists()) {
            throw new Error(`Product "${item.product.name}" is no longer available.`);
          }
          const currentStock = productDoc.data().stock;
          if (currentStock < item.quantity) {
            throw new Error(`Not enough stock for ${item.product.name}. Only ${currentStock} left.`);
          }
        }
        
        transaction.set(newOrderRef, orderPayload);

        for (const item of state.cartItems) {
          const productRef = doc(firestore, 'products', item.product.id);
          transaction.update(productRef, { stock: increment(-item.quantity) });
        }
      });

      toast({
        title: 'Order Placed!',
        description: 'Payment successful via PhonePe. Thank you for your purchase.',
      });
      dispatch({ type: 'CLEAR_CART' });
      router.push(`/orders/${newOrderRef.id}`);

    } catch (error: any) {
      console.error("Order transaction failed: ", error);
      toast({
        variant: 'destructive',
        title: 'Order Failed',
        description: error.message || 'There was a problem placing your order.',
      });
    } finally {
      setIsProcessing(false);
    }
  }

  useEffect(() => {
    if (state.cartItems.length === 0 && !isProcessing) {
      router.push('/products');
    }
  }, [state.cartItems.length, router, isProcessing]);

  const handleAddressSelect = (addressId: string) => {
    const selectedAddress = addresses?.find(a => a.id === addressId);
    if (selectedAddress) {
      form.setValue('firstName', selectedAddress.firstName);
      form.setValue('lastName', selectedAddress.lastName);
      form.setValue('address', selectedAddress.address);
      form.setValue('city', selectedAddress.city);
      form.setValue('postalCode', selectedAddress.postalCode);
      form.setValue('country', selectedAddress.country);
      form.setValue('phone', selectedAddress.phone);
    }
  };

  if (state.cartItems.length === 0 && !isProcessing) {
    return null;
  }
  
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl md:text-5xl font-bold font-headline mb-2">Checkout</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-4 py-2 rounded-full">
            <ShieldCheck className="h-4 w-4 text-green-600" />
            <span>Secure 256-bit SSL encrypted payment</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <div className="md:order-last space-y-6">
            <h2 className="text-xl font-headline font-semibold">Order Summary</h2>
            <Card className="border-2">
                <CardContent className="p-4 md:p-6 space-y-4">
                    {state.cartItems.map(item => (
                        <div key={item.product.id} className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground font-medium">{item.product.name} x {item.quantity}</span>
                            <span className="font-semibold">₹{(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <Separator/>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-medium">₹{shipping.toFixed(2)}</span>
                    </div>
                    <Separator className="h-0.5 bg-primary/20"/>
                     <div className="flex justify-between font-bold text-xl text-primary">
                        <span>Total Payable</span>
                        <span>₹{total.toFixed(2)}</span>
                    </div>
                </CardContent>
            </Card>
            
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                <h3 className="text-sm font-bold flex items-center gap-2 mb-2">
                    <CreditCard className="h-4 w-4" />
                    Why pay with PhonePe?
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                    PhonePe offers the fastest and most reliable UPI transactions in India. Get instant confirmation and easy refunds directly to your bank account.
                </p>
            </div>
        </div>

        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg md:text-xl font-headline">Shipping Details</CardTitle>
                        <CardDescription>Where should we send your ozonated skincare?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        {user && addresses && addresses.length > 0 && (
                            <div className="space-y-2">
                                <Label>Use a saved address</Label>
                                <Select onValueChange={handleAddressSelect}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a saved address" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {addresses.map((addr) => (
                                            <SelectItem key={addr.id} value={addr.id}>
                                                {`${addr.firstName} ${addr.lastName}, ${addr.address}, ${addr.city}`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        <div className="flex flex-col md:flex-row gap-4">
                            <FormField control={form.control} name="firstName" render={({ field }) => (
                                <FormItem className="flex-1"><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="lastName" render={({ field }) => (
                                <FormItem className="flex-1"><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                        <FormField control={form.control} name="address" render={({ field }) => (
                            <FormItem><FormLabel>Street Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="phone" render={({ field }) => (
                            <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" placeholder="10-digit number" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <div className="flex flex-col md:flex-row gap-4">
                            <FormField control={form.control} name="city" render={({ field }) => (
                                <FormItem className="flex-1"><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="postalCode" render={({ field }) => (
                                <FormItem className="flex-1"><FormLabel>Postal Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-primary/20">
                    <CardHeader className="bg-primary/5 border-b pb-4">
                        <CardTitle className="text-lg md:text-xl font-headline flex items-center gap-2">
                            <Wallet className="h-5 w-5 text-primary" />
                            Payment Method
                        </CardTitle>
                        <CardDescription>Powered by PhonePe Secure Gateway</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <FormField
                            control={form.control}
                            name="paymentMethod"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="grid gap-4"
                                        >
                                            <Label
                                                htmlFor="phonepe"
                                                className="flex items-center justify-between rounded-xl border-2 p-4 cursor-pointer hover:bg-muted/50 transition-all [&:has([aria-checked=true])]:border-primary [&:has([aria-checked=true])]:bg-primary/5"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <RadioGroupItem value="phonepe" id="phonepe" />
                                                    <div className="space-y-0.5">
                                                        <span className="font-bold">PhonePe</span>
                                                        <p className="text-xs text-muted-foreground">UPI, Cards, & Wallets</p>
                                                    </div>
                                                </div>
                                                <PhonePeIcon className="h-8 w-8" />
                                            </Label>

                                            <Label
                                                htmlFor="upi"
                                                className="flex items-center justify-between rounded-xl border-2 p-4 cursor-pointer hover:bg-muted/50 transition-all [&:has([aria-checked=true])]:border-primary [&:has([aria-checked=true])]:bg-primary/5"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <RadioGroupItem value="upi" id="upi" />
                                                    <div className="space-y-0.5">
                                                        <span className="font-bold">Other UPI ID</span>
                                                        <p className="text-xs text-muted-foreground">Google Pay, Paytm, etc.</p>
                                                    </div>
                                                </div>
                                                <UpiIcon className="h-6 w-6" />
                                            </Label>
                                        </RadioGroup>
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {form.watch("paymentMethod") === "upi" && (
                            <FormField
                                control={form.control}
                                name="upiId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Enter UPI ID</FormLabel>
                                        <div className="flex gap-2">
                                            <FormControl>
                                                <Input placeholder="your-upi-id@okhdfcbank" {...field} />
                                            </FormControl>
                                            <Button type="button" variant="outline">Verify</Button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <div className="pt-2">
                             <Button 
                                type="submit" 
                                className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]" 
                                disabled={isProcessing}
                             >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Redirecting to PhonePe...
                                    </>
                                ) : (
                                    `Pay ₹${total.toFixed(2)}`
                                )}
                            </Button>
                            <p className="text-[10px] text-center text-muted-foreground mt-3 uppercase tracking-widest font-bold">
                                100% Safe & Secure Payments
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
