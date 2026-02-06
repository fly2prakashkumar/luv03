'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const productFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().positive('Price must be a positive number'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  category: z.string().min(1, 'Category is required'),
  imageUrl1: z.string().min(1, 'At least one image is required.'),
  imageUrl2: z.string().optional().or(z.literal('')),
  imageUrl3: z.string().optional().or(z.literal('')),
  imageUrl4: z.string().optional().or(z.literal('')),
  imageUrl5: z.string().optional().or(z.literal('')),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

const productCategories = ["Bath & Body", "Skin care", "Toothpaste", "Handwash"];

export function AddProductDialog() {
  const [open, setOpen] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gallery upload state
  const [activeImageField, setActiveImageField] = useState<keyof ProductFormValues | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      imageUrl1: '',
      imageUrl2: '',
      imageUrl3: '',
      imageUrl4: '',
      imageUrl5: '',
    },
  });

  const triggerFileSelect = (field: keyof ProductFormValues) => {
    setActiveImageField(field);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeImageField) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        form.setValue(activeImageField, dataUri);
        toast({
          title: "Image Uploaded",
          description: "File has been selected and added.",
        });
        setActiveImageField(null);
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = (values: ProductFormValues) => {
    if (!firestore || !user) {
      return;
    }
    
    setIsSubmitting(true);
    const productsCollection = collection(firestore, 'products');

    const { imageUrl1, imageUrl2, imageUrl3, imageUrl4, imageUrl5, ...rest } = values;
    const imageUrls = [imageUrl1, imageUrl2, imageUrl3, imageUrl4, imageUrl5].filter(url => url && url.trim() !== '');
    
    addDoc(productsCollection, { ...rest, imageUrls })
      .then(() => {
        toast({
          title: 'Product Added',
          description: `${values.name} has been added to Firestore.`,
        });
        form.reset();
        setOpen(false);
      })
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: productsCollection.path,
            operation: 'create',
            requestResourceData: { ...rest, imageUrls },
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
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new product. You can type a URL or upload from your gallery.
          </DialogDescription>
        </DialogHeader>

        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <div className="max-h-[60vh] overflow-y-auto space-y-3 p-1">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
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
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., A potent Vitamin C serum..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" step="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {productCategories.map(category => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-3 border-t pt-4">
                <p className="text-sm font-medium">Product Images</p>
                {[1, 2, 3, 4, 5].map((num) => (
                  <FormField
                    key={num}
                    control={form.control}
                    name={`imageUrl${num}` as keyof ProductFormValues}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Image {num}</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input placeholder={`Image URL ${num}...`} {...field} />
                          </FormControl>
                          <Button 
                            type="button" 
                            size="icon" 
                            variant="outline" 
                            onClick={() => triggerFileSelect(`imageUrl${num}` as keyof ProductFormValues)}
                            title="Upload from gallery"
                          >
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>
            <DialogFooter className="pt-4">
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Product'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
