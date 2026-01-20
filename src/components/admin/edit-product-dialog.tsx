
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirestore, useUser } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Pencil } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';
import type { Product } from '@/lib/types';

const productFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().positive('Price must be a positive number'),
  category: z.string().min(1, 'Category is required'),
  imageUrl: z.string().url('Please enter a valid image URL.'),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface EditProductDialogProps {
  product: Product & { id: string };
  categories: string[];
}

export function EditProductDialog({ product, categories }: EditProductDialogProps) {
  const [open, setOpen] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product.name || '',
      description: product.description || '',
      price: product.price || 0,
      category: product.category || '',
      imageUrl: product.imageUrl || '',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        category: product.category || '',
        imageUrl: product.imageUrl || '',
      });
    }
  }, [product, form, open]);

  const onSubmit = (values: ProductFormValues) => {
    if (!firestore || !user) {
      return;
    }

    setIsSubmitting(true);
    const productRef = doc(firestore, 'products', product.id);

    updateDoc(productRef, values)
      .then(() => {
        toast({
          title: 'Product Updated',
          description: `${values.name} has been updated.`,
        });
        setOpen(false);
      })
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
          path: productRef.path,
          operation: 'update',
          requestResourceData: values,
        });

        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update the product details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
            <div className="max-h-[60vh] overflow-y-auto space-y-1 p-1">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Radiant Glow Serum" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., A potent Vitamin C serum..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 1250.00" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {categories.map(category => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormDescription>
                      To add a new category, use the "Add Product" dialog.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.png" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the full URL for the product image.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="pt-2">
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
