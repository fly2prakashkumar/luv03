
"use client";

import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface AddToCartButtonProps {
    product: Product & { id: string };
    quantity?: number;
    className?: string;
}

export function AddToCartButton({ product, quantity = 1, className }: AddToCartButtonProps) {
    const { dispatch } = useCart();
    const { toast } = useToast();

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
        toast({
            title: "Added to cart",
            description: `${product.name} has been added to your cart.`,
        });
    };

    return (
        <Button onClick={handleAddToCart} className={className}>
            Add to Cart
        </Button>
    );
}
