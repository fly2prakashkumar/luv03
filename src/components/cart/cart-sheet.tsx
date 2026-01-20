"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, X, Plus, Minus } from "lucide-react";

export function CartSheet() {
  const { state, dispatch } = useCart();
  const subtotal = state.cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity: Math.max(0, quantity) } });
  };
  
  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  };

  return (
    <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
      <SheetHeader className="space-y-2.5 pr-6">
        <SheetTitle>Cart ({state.cartItems.length})</SheetTitle>
        <Separator />
      </SheetHeader>
      {state.cartItems.length > 0 ? (
        <>
          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-6 pr-6">
              {state.cartItems.map((item) => {
                return (
                  <div key={item.product.id} className="flex items-start gap-4">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden">
                       {item.product.imageUrls && item.product.imageUrls[0] && <Image src={item.product.imageUrls[0]} alt={item.product.name} fill className="object-cover" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{item.product.name}</h3>
                      <p className="text-muted-foreground text-sm">₹{item.product.price.toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                         <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeItem(item.product.id)}>
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove item</span>
                    </Button>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
          <SheetFooter className="mt-auto flex-col space-y-4 pr-6">
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Shipping and taxes will be calculated at checkout.
            </p>
            <SheetClose asChild>
              <Button asChild className="w-full">
                <Link href="/checkout">Continue to Checkout</Link>
              </Button>
            </SheetClose>
          </SheetFooter>
        </>
      ) : (
        <div className="flex h-full flex-col items-center justify-center space-y-4">
          <ShoppingCart className="h-16 w-16 text-muted-foreground" />
          <p className="text-muted-foreground">Your cart is empty</p>
          <SheetClose asChild>
            <Button asChild variant="secondary">
              <Link href="/products">Start Shopping</Link>
            </Button>
          </SheetClose>
        </div>
      )}
    </SheetContent>
  );
}

    