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
    <svg viewBox="0 0 55 22" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M9.47957 12.3242L9.47957 9.87116C9.47957 8.94363 9.33649 8.20455 9.05034 7.65391C8.76419 7.09455 8.35626 6.68661 7.82654 6.43007C7.30554 6.16481 6.6976 6.03218 6.00275 6.03218C5.00364 6.03218 4.1476 6.32845 3.43464 6.921C2.72167 7.51354 2.36519 8.33924 2.36519 9.39707V12.3242H0.25V5.0063H2.36519V6.44751C2.92455 5.56354 3.73481 5.06649 4.79264 4.9563C5.90833 4.83739 6.89701 5.12354 7.75218 5.81481C8.59863 6.50607 9.05034 7.46804 9.10818 8.69145L9.16602 9.08669L9.47957 9.08669V5.0063H11.5947V15.9922H9.47957V12.3242Z" fill="#5F6368"/>
        <path d="M19.1293 11.2335C19.1293 10.3582 18.8953 9.64344 18.4271 9.08924C17.959 8.52632 17.3216 8.24486 16.5149 8.24486C15.7082 8.24486 15.0665 8.52632 14.5896 9.08924C14.1128 9.64344 13.8744 10.3582 13.8744 11.2335C13.8744 12.1089 14.1128 12.8236 14.5896 13.3865C15.0665 13.9407 15.7082 14.2222 16.5149 14.2222C17.3216 14.2222 17.959 13.9407 18.4271 13.3865C18.8953 12.8236 19.1293 12.1089 19.1293 11.2335ZM16.9242 11.2335C16.9242 12.0156 16.7358 12.5662 16.359 12.885C16.2081 13.0177 16.0397 13.084 15.8538 13.084C15.4053 13.084 15.0785 12.8398 14.8734 12.3514C14.7545 12.0494 14.6951 11.669 14.6951 11.2112C14.6951 10.1533 15.0933 9.62363 15.8913 9.62363C16.6893 9.62363 16.9242 10.1621 16.9242 11.2335Z" fill="#5F6368"/>
        <path d="M25.3217 8.46234C25.8623 8.00451 26.4789 7.77559 27.1725 7.77559C28.2391 7.77559 28.9406 8.27264 29.2773 9.26678L29.5634 9.99289H21.2483C21.3062 10.602 21.4648 11.1077 21.7243 11.5113C21.9926 11.9062 22.3478 12.2139 22.7905 12.4344C23.2332 12.6549 23.7251 12.7651 24.2657 12.7651C25.3323 12.7651 26.0696 12.3486 26.4776 11.5157L28.3752 12.3228C27.8158 13.5032 26.7388 14.2222 25.1441 14.2222C24.0371 14.2222 23.0907 13.9034 22.3052 13.2659C21.5196 12.6284 21.0428 11.7733 20.8744 10.7005C20.7061 9.62777 21.0023 8.7303 21.7629 8.00854C22.5322 7.27807 23.6392 6.91284 25.0863 6.91284C25.9616 6.91284 26.7095 7.1881 27.3301 7.73873L25.3217 8.46234ZM26.9632 9.28857C26.5467 8.78286 25.9261 8.53001 25.1014 8.53001C24.4065 8.53001 23.8335 8.73514 23.3821 9.1454C22.9307 9.54694 22.6554 10.044 22.5685 10.6365H26.9632Z" fill="#5F6368"/>
        <path d="M30.0886 16.2244H32.2038V5.0063H30.0886V16.2244Z" fill="#5F6368"/>
        <path d="M3.78455 21.1444C2.76802 21.1444 1.93994 20.8077 1.30086 20.1343C0.661781 19.4609 0.342245 18.5991 0.342245 17.5488V5.0063H2.45742V17.3882C2.45742 18.0489 2.65651 18.5742 3.05469 18.9635C3.4616 19.3527 3.96805 19.5473 4.57404 19.5473C5.1713 19.5473 5.66835 19.3527 6.06653 18.9635C6.46471 18.5742 6.6638 18.0489 6.6638 17.3882V5.0063H8.77898V17.5488C8.77898 18.5991 8.45944 19.4609 7.82037 20.1343C7.18129 20.8077 6.35321 21.1444 5.33667 21.1444H3.78455Z" fill="#EA4335"/>
        <path d="M16.486 21.1444C15.2024 21.1444 14.1358 20.7365 13.2863 19.921C12.4368 19.1055 12 18.0389 12 16.7212C12 15.4034 12.4368 14.3368 13.2863 13.5213C14.1358 12.7058 15.2024 12.2979 16.486 12.2979C17.7697 12.2979 18.8363 12.7058 19.6858 13.5213C20.5353 14.3368 20.96 15.4034 20.96 16.7212C20.96 18.0389 20.5353 19.1055 19.6858 19.921C18.8363 20.7365 17.7697 21.1444 16.486 21.1444ZM16.486 19.5473C17.1594 19.5473 17.7175 19.3225 18.1592 18.8729C18.6096 18.4233 18.8344 17.6972 18.8344 16.7024C18.8344 15.6988 18.6096 14.9621 18.1592 14.4926C17.7175 14.0231 17.1594 13.7884 16.486 13.7884C15.8127 13.7884 15.2546 14.0231 14.8129 14.4926C14.3712 14.9621 14.1503 15.6988 14.1503 16.7024C14.1503 17.6972 14.3712 18.4233 14.8129 18.8729C15.2546 19.3225 15.8127 19.5473 16.486 19.5473Z" fill="#FBBC04"/>
        <path d="M22.8447 21.1444V12.5312H24.9599V14.1107C25.4322 13.4373 26.0827 12.9726 26.9118 12.7161C27.7408 12.4595 28.5987 12.422 29.4855 12.5497L28.9884 14.3948C28.2373 14.1957 27.5358 14.1681 26.8837 14.3134C26.2403 14.4587 25.7529 14.7339 25.4217 15.139C25.2166 15.4042 25.1141 15.7178 25.1141 16.0796V21.1444H22.8447Z" fill="#34A853"/>
        <path d="M37.5255 16.7212C37.5255 17.6574 37.2828 18.4278 36.7967 19.0325C36.3192 19.6372 35.6891 20.0387 34.906 20.2378L35.6321 22H33.0903L31.6215 19.8242L31.1394 20.0116V22H29.0242V12.5312H31.6889C33.1577 12.5312 34.3381 12.8333 35.2292 13.4379C36.129 14.0426 36.579 14.8683 36.579 15.915C36.579 16.6341 36.3752 17.2191 35.9673 17.6698C35.5594 18.1204 34.9864 18.3957 34.2486 18.4952L36.3638 15.4271L32.8407 14.1681H31.157V18.7303L34.1911 22L37.5255 16.7212ZM32.6167 16.7781C33.321 16.7781 33.8267 16.6454 34.1332 16.379C34.4397 16.1125 34.5929 15.7588 34.5929 15.318C34.5929 14.8023 34.4245 14.4219 34.0878 14.1777C33.7598 13.9248 33.2441 13.7971 32.5398 13.7971H31.157V16.7781H32.6167Z" fill="#4285F4"/>
        <path d="M47.7853 11.2335C47.7853 10.3582 47.5513 9.64344 47.0831 9.08924C46.615 8.52632 45.9776 8.24486 45.1709 8.24486C44.3642 8.24486 43.7225 8.52632 43.2456 9.08924C42.7688 9.64344 42.5304 10.3582 42.5304 11.2335C42.5304 12.1089 42.7688 12.8236 43.2456 13.3865C43.7225 13.9407 44.3642 14.2222 45.1709 14.2222C45.9776 14.2222 46.615 13.9407 47.0831 13.3865C47.5513 12.8236 47.7853 12.1089 47.7853 11.2335ZM45.5802 11.2335C45.5802 12.0156 45.3918 12.5662 45.015 12.885C44.8641 13.0177 44.6957 13.084 44.5098 13.084C44.0613 13.084 43.7345 12.8398 43.5294 12.3514C43.4105 12.0494 43.3511 11.669 43.3511 11.2112C43.3511 10.1533 43.7493 9.62363 44.5473 9.62363C45.3453 9.62363 45.5802 10.1621 45.5802 11.2335Z" fill="#5F6368"/>
        <path d="M54.218 8.46234C54.7586 8.00451 55.3752 7.77559 56.0688 7.77559C57.1354 7.77559 57.8369 8.27264 58.1736 9.26678L58.4597 9.99289H50.1446C50.2024 10.602 50.3611 11.1077 50.6206 11.5113C50.8889 11.9062 51.2441 12.2139 51.6868 12.4344C52.1295 12.6549 52.6214 12.7651 53.162 12.7651C54.2286 12.7651 54.9659 12.3486 55.3739 11.5157L57.2715 12.3228C56.7121 13.5032 55.6351 14.2222 54.0404 14.2222C52.9334 14.2222 51.987 13.9034 51.2015 13.2659C50.4159 12.6284 49.9391 11.7733 49.7707 10.7005C49.6024 9.62777 49.8986 8.7303 50.6592 8.00854C51.4285 7.27807 52.5355 6.91284 53.9826 6.91284C54.8579 6.91284 55.6058 7.1881 56.2264 7.73873L54.218 8.46234ZM55.8595 9.28857C55.443 8.78286 54.8224 8.53001 53.9977 8.53001C53.3028 8.53001 52.7298 8.73514 52.2784 9.1454C51.827 9.54694 51.5517 10.044 51.4648 10.6365H55.8595Z" fill="#5F6368"/>
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
                            <GooglePayIcon className="h-6 w-auto" />
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
