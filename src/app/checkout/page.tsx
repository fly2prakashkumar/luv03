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


const GooglePayIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M10.182,15.118a1.565,1.565,0,0,1,1.1,2.586,1.574,1.574,0,0,1-2.593-1.1,1.563,1.563,0,0,1,1.5-1.489Z" fill="#34a853"/>
      <path d="M11.668,12.545a1.56,1.56,0,0,1,.015,3.12,1.554,1.554,0,0,1-.015-3.12Z" fill="#fbbc04"/>
      <path d="M11.668,9.455a1.56,1.56,0,0,1,0,3.12,1.56,1.56,0,0,1,0-3.12Z" fill="#ea4335"/>
      <path d="M10.182,6.364a1.563,1.563,0,0,1,1.488-1.5,1.574,1.574,0,0,1,1.1,2.593,1.565,1.565,0,0,1-2.593-1.1Z" fill="#4285f4"/>
      <path d="M20.25,10.636V9.25a6.5,6.5,0,0,0-6.5-6.5H9.25a6.5,6.5,0,0,0-6.5,6.5v5.5a6.5,6.5,0,0,0,6.5,6.5h4.273a2.91,2.91,0,0,0,2.909-2.909V15.5a2,2,0,0,0-2-2H13.5a1,1,0,0,1-1-1V12.045a1,1,0,0,1,1-1h.432a2.5,2.5,0,0,0,2.5-2.5V8.136a2.5,2.5,0,0,0-2.5-2.5h-.932a2.864,2.864,0,0,0-2.864,2.864v.409H9.25A4.5,4.5,0,0,1,13.75,4.75h1A4.5,4.5,0,0,1,22.25,9.25v1.386a4.25,4.25,0,0,1-2,0Zm-3.114,7.728a.909.909,0,0,1-.909.909H9.25a4.5,4.5,0,0,1-4.5-4.5v-5.5a4.5,4.5,0,0,1,4.5-4.5h4.5a4.5,4.5,0,0,1,4.5,4.5v.909a.5.5,0,0,1-.5.5h-3a.5.5,0,0,1-.5-.5V8.545a.864.864,0,0,0-.864-.864h-.932a.5.5,0,0,0-.5.5v2.955a3,3,0,0,0,3,3h.409a4,4,0,0,1,4,4v2.636a.909.909,0,0,1-.909.909Z"/>
    </svg>
);
const PhonePeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.23 15.17c-2.3-.5-4.07-2.3-4.5-4.6-.1-.58.38-1.08.97-1.08h.02c.45 0 .83.33.95.77.37 1.45 1.58 2.58 3.06 2.94.56.13 1.05-.33 1.05-.9V12.5c0-1.12-.6-2.16-1.55-2.65l-2.6-1.3c-.63-.3-1.04-.94-1.04-1.63 0-.96.76-1.74 1.7-1.84 1.83-.2 3.4.9 4.12 2.5.2.43.64.65 1.08.53s.76-.5.66-.96C14.7.7 12.35 4.62 9.6 5.5c-1.1.34-1.85 1.35-1.85 2.52 0 1.3.8 2.47 2 3.02l2.6 1.3c.63.3 1.04.94 1.04 1.63v.8c0 1.25-.97 2.3-2.22 2.4z" fill="#6739B7"/>
    </svg>
);
const PaytmIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg height="24" viewBox="0 0 64 22" width="64" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M1.462 2.11h6.216l3.352 11.208L14.382 2.11h6.216V20h-4.32V6.012l-3.24 10.98H9.79L6.55 6.012V20h-4.32V2.11zM23.11 20h14.904V2.11H23.11V20zm4.32-4.32h6.264v-7.344H27.43v7.344zM40.542 2.11h6.216l6.408 17.892h-4.608l-1.224-3.744h-6.264l-1.224 3.744h-4.608L40.542 2.11zm2.376 10.332l-2.016-6.3-2.016 6.3h4.032zM55.698 2.11h4.32v12.312h4.5V20h-8.82V2.11z" fill="#00baf2"/>
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

  function onSubmit(values: FormValues) {
    console.log("Order submitted:", values);
    toast({
      title: "Order Placed!",
      description: "Thank you for your purchase. We are preparing your order.",
    });
    dispatch({ type: 'CLEAR_CART' });
    // In a real app, you would create an order and get an ID
    const mockOrderId = `luv-${Date.now()}`;
    router.push(`/orders/${mockOrderId}`);
  }

  useEffect(() => {
    // This effect will run on the client side after the component mounts.
    // If the cart is empty, it redirects the user to the products page.
    if (state.cartItems.length === 0) {
      router.push('/products');
    }
  }, [state.cartItems.length, router]);

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
                            className="flex items-center gap-4 rounded-md border p-3 cursor-pointer has-[:checked]:border-primary has-[:checked]:ring-1 has-[:checked]:ring-primary"
                        >
                            <RadioGroupItem value="gpay" id="gpay" />
                            <GooglePayIcon className="h-6" />
                            <span>Google Pay</span>
                        </Label>
                        <Label
                            htmlFor="phonepe"
                            className="flex items-center gap-4 rounded-md border p-3 cursor-pointer has-[:checked]:border-primary has-[:checked]:ring-1 has-[:checked]:ring-primary"
                        >
                            <RadioGroupItem value="phonepe" id="phonepe" />
                            <PhonePeIcon className="h-6" />
                            <span>PhonePe</span>
                        </Label>
                        <Label
                            htmlFor="paytm"
                            className="flex items-center gap-4 rounded-md border p-3 cursor-pointer has-[:checked]:border-primary has-[:checked]:ring-1 has-[:checked]:ring-primary"
                        >
                            <RadioGroupItem value="paytm" id="paytm" />
                            <PaytmIcon className="h-6" />
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
