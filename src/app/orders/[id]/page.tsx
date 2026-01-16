import Image from "next/image";
import Link from "next/link";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function OrderPage({ params }: { params: { id: string } }) {
  const orderImage = getPlaceholderImage("order-confirmed");

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 md:py-16">
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/50 p-6 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-2xl font-bold font-headline">Order Confirmed!</h1>
          <p className="text-muted-foreground">Thank you for your purchase.</p>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Order ID</p>
            <p className="font-mono text-base md:text-lg">{params.id}</p>
          </div>
          
          <div className="flex justify-center">
            {orderImage && (
              <Image
                src={orderImage.imageUrl}
                alt={orderImage.description}
                width={150}
                height={150}
                className="rounded-full"
                data-ai-hint={orderImage.imageHint}
              />
            )}
          </div>

          <div>
             <h3 className="text-lg font-semibold mb-4 text-center">Order Status</h3>
              <div className="flex justify-between items-center text-sm text-muted-foreground relative w-full max-w-xs sm:max-w-md mx-auto">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2"></div>
                <div className="absolute top-1/2 left-0 w-1/3 h-0.5 bg-primary -translate-y-1/2"></div>
                <div className="flex flex-col items-center relative z-10 text-center">
                    <div className="w-5 h-5 rounded-full bg-primary border-2 border-background flex items-center justify-center">
                       <div className="w-2 h-2 rounded-full bg-primary-foreground"></div>
                    </div>
                    <span className="text-xs mt-2 text-primary font-semibold">Placed</span>
                </div>
                <div className="flex flex-col items-center relative z-10 text-center">
                    <div className="w-5 h-5 rounded-full bg-border border-2 border-background"></div>
                    <span className="text-xs mt-2">Shipped</span>
                </div>
                 <div className="flex flex-col items-center relative z-10 text-center">
                    <div className="w-5 h-5 rounded-full bg-border border-2 border-background"></div>
                    <span className="text-xs mt-2">Delivered</span>
                </div>
              </div>
          </div>
          <Separator />
          <div className="text-center">
             <Button asChild>
                <Link href="/products">Continue Shopping</Link>
             </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
