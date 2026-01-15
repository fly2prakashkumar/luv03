
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Archive, LayoutGrid, BarChart, Users } from 'lucide-react';
import { useState } from "react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="bg-muted/40 flex-1 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <RadioGroup defaultValue="overview" className="flex items-center space-x-2 bg-background p-1 rounded-lg max-w-sm mb-8 shadow-sm border" onValueChange={setActiveTab}>
          <RadioGroupItem value="overview" id="overview" className="peer sr-only" />
          <Label
            htmlFor="overview"
            className="flex-1 text-center py-2 px-4 rounded-md cursor-pointer transition-colors text-muted-foreground peer-data-[state=checked]:bg-card peer-data-[state=checked]:text-foreground peer-data-[state=checked]:shadow-sm"
          >
            Overview
          </Label>
          <RadioGroupItem value="products" id="products" className="peer sr-only" />
          <Label
            htmlFor="products"
            className="flex-1 text-center py-2 px-4 rounded-md cursor-pointer transition-colors text-muted-foreground peer-data-[state=checked]:bg-card peer-data-[state=checked]:text-foreground peer-data-[state=checked]:shadow-sm"
          >
            Products
          </Label>
          <RadioGroupItem value="outfits" id="outfits" className="peer sr-only" />
          <Label
            htmlFor="outfits"
            className="flex-1 text-center py-2 px-4 rounded-md cursor-pointer transition-colors text-muted-foreground peer-data-[state=checked]:bg-card peer-data-[state=checked]:text-foreground peer-data-[state=checked]:shadow-sm"
          >
            Outfits
          </Label>
        </RadioGroup>

        {activeTab === 'overview' && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Archive className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">155</div>
                  <p className="text-xs text-muted-foreground">Across all categories</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Outfits</CardTitle>
                  <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">28</div>
                  <p className="text-xs text-muted-foreground">Curated collections</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Categories</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground">Active categories</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Newsletter</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-xs text-muted-foreground">Subscribers (mock)</p>
                </CardContent>
              </Card>
            </div>
        )}
      </div>
    </div>
  );
}
