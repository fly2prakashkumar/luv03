'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DollarSign, ShoppingCart, Users, Package, ArrowUp, Star, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Product, Order } from "@/lib/types";
import { AddProductDialog } from "@/components/admin/add-product-dialog";
import { EditProductDialog } from "@/components/admin/edit-product-dialog";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, collectionGroup } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteProductDialog } from "@/components/admin/delete-product-dialog";
import { useIsMobile } from "@/hooks/use-mobile";

const salesData = [
  { name: 'Jan', revenue: 4000, orders: 2400 },
  { name: 'Feb', revenue: 3000, orders: 1398 },
  { name: 'Mar', revenue: 5000, orders: 9800 },
  { name: 'Apr', revenue: 4780, orders: 3908 },
  { name: 'May', revenue: 5890, orders: 4800 },
  { name: 'Jun', revenue: 4390, orders: 3800 },
  { name: 'Jul', revenue: 5490, orders: 4300 },
];

const bestSellers = [
  { name: 'Radiant Glow Serum', sales: 1203, imageUrl: 'https://picsum.photos/seed/bestseller1/100/100' },
  { name: 'Hydro-Boost Moisturizer', sales: 987, imageUrl: 'https://picsum.photos/seed/bestseller2/100/100' },
  { name: 'Gentle Purifying Cleanser', sales: 754, imageUrl: 'https://picsum.photos/seed/bestseller3/100/100' },
];

const reviews = [
    {
        name: "Priya S.",
        rating: 5,
        review: "Absolutely in love with the Radiant Glow Serum! My skin has never looked better.",
        avatarId: "testimonial-1",
    },
    {
        name: "Ananya R.",
        rating: 5,
        review: "The Hydro-Boost Moisturizer is a game-changer for my dry skin. So hydrating!",
        avatarId: "testimonial-3",
    },
    {
        name: "Vikram K.",
        rating: 4,
        review: "Good products, but the delivery took a bit longer than expected. Overall satisfied.",
        avatarId: "testimonial-4",
    },
];

export default function AdminPage() {
  const firestore = useFirestore();
  const productsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'products') : null, [firestore]);
  const { data: allProducts, isLoading: isLoadingProducts } = useCollection<Product>(productsCollection);

  const ordersCollectionGroup = useMemoFirebase(() => firestore ? collectionGroup(firestore, 'orders') : null, [firestore]);
  const { data: allOrders, isLoading: isLoadingOrders } = useCollection<Order>(ordersCollectionGroup);
  
  const usersCollection = useMemoFirebase(() => firestore ? collection(firestore, 'users') : null, [firestore]);
  const { data: allUsers, isLoading: isLoadingUsers } = useCollection(usersCollection);

  const totalUsers = useMemo(() => {
    if (!allUsers) return 0;
    return allUsers.length;
  }, [allUsers]);

  const totalStock = useMemo(() => {
    if (!allProducts) return 0;
    return allProducts.reduce((sum, product) => sum + (Number(product.stock) || 0), 0);
  }, [allProducts]);

  const totalSales = useMemo(() => {
    if (!allOrders) return 0;
    return allOrders.length;
  }, [allOrders]);

  const totalRevenue = useMemo(() => {
    if (!allOrders) return 0;
    return allOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  }, [allOrders]);

  const [filteredProducts, setFilteredProducts] = useState<(Product & { id: string })[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [allCategories, setAllCategories] = useState<string[]>(["All Categories"]);
  const [activeTab, setActiveTab] = useState("overview");
  const isMobile = useIsMobile();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (allProducts) {
      setFilteredProducts(allProducts);
      const categories = ["All Categories", ...Array.from(new Set(allProducts.map(p => p.category).filter(Boolean)))];
      setAllCategories(categories);
    }
  }, [allProducts]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (!allProducts) return;
    if (category === "All Categories") {
      setFilteredProducts(allProducts);
    } else {
      setFilteredProducts(allProducts.filter(p => p.category === category));
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 sm:p-6 md:p-8 pt-6 bg-muted/20">
        <div className="flex items-center justify-between space-y-2">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Luv O3 Dashboard</h2>
                <p className="text-muted-foreground">Welcome back! Here's a look at your store's performance.</p>
            </div>
            <div className="flex items-center space-x-2">
            </div>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {isMounted && isMobile ? (
                <div className="mb-4">
                    <Select value={activeTab} onValueChange={setActiveTab}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a view" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="overview">Overview</SelectItem>
                            <SelectItem value="products">Products</SelectItem>
                            <SelectItem value="orders">Orders</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            ) : (
                <TabsList className="grid w-full grid-cols-3 bg-muted/80 mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="products">Products</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                </TabsList>
            )}
            <TabsContent value="overview">
                <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                {isLoadingOrders ? (
                                    <div className="space-y-1">
                                        <Skeleton className="h-8 w-24" />
                                        <Skeleton className="h-4 w-28" />
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString('en-IN')}</div>
                                        <p className="text-xs text-muted-foreground">
                                            From {totalSales} orders
                                        </p>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                {isLoadingOrders ? (
                                    <div className="space-y-1">
                                        <Skeleton className="h-8 w-20" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-2xl font-bold">+{totalSales}</div>
                                        <p className="text-xs text-muted-foreground">Total orders placed</p>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                {isLoadingUsers ? (
                                    <div className="space-y-1">
                                        <Skeleton className="h-8 w-20" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-2xl font-bold">{totalUsers}</div>
                                        <p className="text-xs text-muted-foreground">Total registered users</p>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Inventory Stock</CardTitle>
                                <Package className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                {isLoadingProducts ? (
                                   <div className="space-y-1">
                                       <Skeleton className="h-8 w-20" />
                                       <Skeleton className="h-4 w-24" />
                                   </div>
                               ) : (
                                   <>
                                       <div className="text-2xl font-bold">{totalStock}</div>
                                       <p className="text-xs text-muted-foreground">Units available</p>
                                   </>
                               )}
                            </CardContent>
                        </Card>
                    </div>
                     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="lg:col-span-4">
                            <CardHeader>
                                <CardTitle>Sales Overview</CardTitle>
                                 <CardDescription>Revenue vs. Orders over the last 30 days.</CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <ResponsiveContainer width="100%" height={350}>
                                    <LineChart data={salesData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "hsl(var(--background))",
                                                borderColor: "hsl(var(--border))",
                                                borderRadius: "var(--radius)",
                                            }}
                                        />
                                        <Legend wrapperStyle={{fontSize: "12px"}}/>
                                        <Line type="monotone" dataKey="revenue" stroke="hsl(var(--foreground))" strokeWidth={2} activeDot={{ r: 8 }} />
                                        <Line type="monotone" dataKey="orders" stroke="hsl(var(--accent))" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                        <Card className="lg:col-span-3">
                             <CardHeader>
                                <CardTitle>Best Sellers</CardTitle>
                                <CardDescription>Your top-performing products this month.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {bestSellers.map(product => (
                                         <div key={product.name} className="flex items-center">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={product.imageUrl} alt={product.name}/>
                                                <AvatarFallback>{product.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="ml-4 space-y-1">
                                                <p className="text-sm font-medium leading-none">{product.name}</p>
                                            </div>
                                            <div className="ml-auto font-medium">{product.sales} sales</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Customer Reviews</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {reviews.map((review, index) => (
                                    <div key={index} className="flex items-start space-x-4">
                                        <Avatar>
                                            <AvatarImage src={`https://picsum.photos/seed/${review.avatarId}/100/100`} />
                                            <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="font-semibold">{review.name}</p>
                                                <div className="flex items-center">
                                                    {Array(5).fill(0).map((_, i) => (
                                                        <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}/>
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">{review.review}</p>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="products">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Product Management</CardTitle>
                            <CardDescription>Add, edit, or remove products from your catalog.</CardDescription>
                        </div>
                        <AddProductDialog />
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4">
                             <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                                <SelectTrigger className="w-full md:w-64">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    {allCategories.map(category => (
                                        <SelectItem key={category} value={category}>{category}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="hidden sm:table-cell">Image</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="hidden md:table-cell">Category</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoadingProducts ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell className="hidden sm:table-cell"><Skeleton className="h-12 w-12 rounded-md" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-[150px] md:w-[250px]" /></TableCell>
                                            <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-[100px]" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
                                            <TableCell><div className="flex gap-2"><Skeleton className="h-10 w-10" /><Skeleton className="h-10 w-10" /></div></TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    filteredProducts?.map(product => {
                                        return (
                                            <TableRow key={product.id}>
                                                <TableCell className="hidden sm:table-cell">
                                                    <div className="relative h-12 w-12 rounded-md overflow-hidden">
                                                        {product.imageUrls && product.imageUrls[0] && (
                                                            <Image 
                                                                src={product.imageUrls[0]} 
                                                                alt={product.name} 
                                                                fill 
                                                                className="object-cover"
                                                            />
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium">{product.name}</TableCell>
                                                <TableCell className="hidden md:table-cell">{product.category}</TableCell>
                                                <TableCell>₹{product.price.toFixed(2)}</TableCell>
                                                <TableCell>{product.stock}</TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <EditProductDialog product={product} />
                                                        <DeleteProductDialog product={product} />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="orders">
                <Card>
                    <CardHeader>
                        <CardTitle>Manage Orders</CardTitle>
                        <CardDescription>View and process customer orders.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Order management interface coming soon.</p>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
    