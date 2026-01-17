
'use client';

import { useState } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import type { Product } from '@/lib/types';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';

interface DeleteProductDialogProps {
  product: Product;
}

export function DeleteProductDialog({ product }: DeleteProductDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();
  const { user } = useUser();

  const handleDelete = async () => {
    if (!firestore || !user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to delete a product.',
      });
      return;
    }
    if (user.email !== 'admin@gmail.com') {
      toast({
        variant: 'destructive',
        title: 'Permission Denied',
        description: 'You do not have permission to delete products.',
      });
      return;
    }

    setIsDeleting(true);
    const productRef = doc(firestore, 'products', product.id);

    deleteDoc(productRef)
      .then(() => {
        toast({
          title: 'Product Deleted',
          description: `${product.name} has been removed.`,
        });
      })
      .catch((serverError) => {
        console.error('Error deleting product:', serverError);
        const permissionError = new FirestorePermissionError({
          path: productRef.path,
          operation: 'delete',
        });

        errorEmitter.emit('permission-error', permissionError);

        toast({
          variant: 'destructive',
          title: 'Error deleting product',
          description: serverError.message || 'You may not have the required permissions.',
        });
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the product
            "{product.name}" from your database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
