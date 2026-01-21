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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";


const formSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
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
}

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
      },
      orderDate: serverTimestamp(),
      status: 'placed',
    };

    try {
      const ordersCollection = collection(firestore, 'users', user.uid, 'orders');
      const docRef = await addDoc(ordersCollection, orderPayload);
      
      toast({
        title: 'Order Placed!',
        description: 'Thank you for your purchase. We are preparing your order.',
      });
      dispatch({ type: 'CLEAR_CART' });
      router.push(`/orders/${docRef.id}`);

    } catch (serverError) {
        const ordersCollection = collection(firestore, 'users', user.uid, 'orders');
        const permissionError = new FirestorePermissionError({
            path: ordersCollection.path,
            operation: 'create',
            requestResourceData: orderPayload,
        });
        errorEmitter.emit('permission-error', permissionError);
    }
  }

  useEffect(() => {
    // This effect will run on the client side after the component mounts.
    // If the cart is empty, it redirects the user to the products page.
    if (state.cartItems.length === 0) {
      router.push('/products');
    }
  }, [state.cartItems.length, router]);

  const handleAddressSelect = (addressId: string) => {
    const selectedAddress = addresses?.find(a => a.id === addressId);
    if (selectedAddress) {
      form.setValue('firstName', selectedAddress.firstName);
      form.setValue('lastName', selectedAddress.lastName);
      form.setValue('address', selectedAddress.address);
      form.setValue('city', selectedAddress.city);
      form.setValue('postalCode', selectedAddress.postalCode);
      form.setValue('country', selectedAddress.country);
    }
  };

  // If the cart is empty, we can return null to prevent rendering the checkout form
  // while the redirection is in progress.
  if (state.cartItems.length === 0) {
    return null;
  }
  
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
      <h1 className="text-3xl md:text-5xl font-bold font-headline text-center mb-8">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <div className="md:order-last">
            <h2 className="text-xl font-headline font-semibold mb-4">Order Summary</h2>
            <Card>
                <CardContent className="p-4 md:p-6 space-y-4">
                    {state.cartItems.map(item => (
                        <div key={item.product.id} className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">{item.product.name} x {item.quantity}</span>
                            <span>₹{(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <Separator/>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>₹{shipping.toFixed(2)}</span>
                    </div>
                    <Separator/>
                     <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div>
          <h2 className="text-xl font-headline font-semibold mb-4">Shipping & Payment</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Card>
                    <CardHeader><CardTitle className="text-lg md:text-xl font-headline">Contact Information</CardTitle></CardHeader>
                    <CardContent>
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle className="text-lg md:text-xl font-headline">Shipping Address</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
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
                                 <div className="relative my-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-card px-2 text-muted-foreground">
                                        Or enter a new one
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="flex flex-col md:flex-row gap-4"><FormField control={form.control} name="firstName" render={({ field }) => (
                            <FormItem className="flex-1"><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/><FormField control={form.control} name="lastName" render={({ field }) => (
                            <FormItem className="flex-1"><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/></div>
                        <FormField control={form.control} name="address" render={({ field }) => (
                            <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <div className="flex flex-col md:flex-row gap-4"><FormField control={form.control} name="city" render={({ field }) => (
                            <FormItem className="flex-1"><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/><FormField control={form.control} name="postalCode" render={({ field }) => (
                            <FormItem className="flex-1"><FormLabel>Postal Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/></div>
                        <FormField control={form.control} name="country" render={({ field }) => (
                            <FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle className="text-lg md:text-xl font-headline">Payment Details</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <RadioGroup defaultValue="gpay" className="space-y-2">
                        <Label
                            htmlFor="gpay"
                            className="flex items-center gap-2 rounded-md border p-3 cursor-pointer has-[:checked]:border-primary has-[:checked]:ring-1 has-[:checked]:ring-primary"
                        >
                            <RadioGroupItem value="gpay" id="gpay" />
                            <span>Google Pay</span>
                        </Label>
                        <Label
                            htmlFor="phonepe"
                            className="flex items-center gap-2 rounded-md border p-3 cursor-pointer has-[:checked]:border-primary has-[:checked]:ring-1 has-[:checked]:ring-primary"
                        >
                            <RadioGroupItem value="phonepe" id="phonepe" />
                            <span>PhonePe</span>
                        </Label>
                        <Label
                            htmlFor="paytm"
                            className="flex items-center gap-2 rounded-md border p-3 cursor-pointer has-[:checked]:border-primary has-[:checked]:ring-1 has-[:checked]:ring-primary"
                        >
                            <RadioGroupItem value="paytm" id="paytm" />
                            <span>Paytm</span>
                        </Label>
                        </RadioGroup>
                        <div className="relative my-2">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                            Or pay with UPI ID
                            </span>
                        </div>
                        </div>
                        <div className="flex gap-2">
                            <Input icon={<UpiIcon />} placeholder="your-upi-id@okhdfcbank" />
                            <Button variant="outline">Verify</Button>
                        </div>
                    </CardContent>
                </Card>
              <Button type="submit" className="w-full" size="lg">Pay ₹{total.toFixed(2)}</Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
