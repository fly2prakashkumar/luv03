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
import { CreditCard } from "lucide-react";

const formSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  cardName: z.string().min(1, "Name on card is required"),
  cardNumber: z.string().regex(/^\d{16}$/, "Invalid card number"),
  cardExpiry: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Invalid expiry date (MM/YY)"),
  cardCvc: z.string().regex(/^\d{3,4}$/, "Invalid CVC"),
});

type FormValues = z.infer<typeof formSchema>;

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

  if (state.cartItems.length === 0 && typeof window !== 'undefined') {
    router.push('/products');
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
                         <FormField control={form.control} name="cardName" render={({ field }) => (
                            <FormItem><FormLabel>Name on Card</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                         <FormField control={form.control} name="cardNumber" render={({ field }) => (
                            <FormItem><FormLabel>Card Number</FormLabel><FormControl><Input icon={<CreditCard/>} {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <div className="flex gap-4"><FormField control={form.control} name="cardExpiry" render={({ field }) => (
                            <FormItem className="flex-1"><FormLabel>Expiry (MM/YY)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/><FormField control={form.control} name="cardCvc" render={({ field }) => (
                            <FormItem className="flex-1"><FormLabel>CVC</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/></div>
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
