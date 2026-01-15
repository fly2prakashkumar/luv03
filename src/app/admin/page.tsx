
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
        <RadioGroup
          value={activeTab}
          onValueChange={setActiveTab}
          className="relative grid grid-cols-3 items-center gap-2 rounded-lg bg-gray-200 p-2"
        >
          <RadioGroupItem value="overview" id="overview" className="sr-only peer" />
          <Label
            htmlFor="overview"
            className="flex h-full w-full cursor-pointer items-center justify-center rounded-md p-2 text-center text-sm font-medium text-gray-500 transition-all peer-data-[state=checked]:bg-white peer-data-[state=checked]:text-gray-900 peer-data-[state=checked]:shadow-sm"
          >
            Overview
          </Label>
          <RadioGroupItem value="products" id="products" className="sr-only peer" />
          <Label
            htmlFor="products"
            className="flex h-full w-full cursor-pointer items-center justify-center rounded-md p-2 text-center text-sm font-medium text-gray-500 transition-all peer-data-[state=checked]:bg-white peer-data-[state=checked]:text-gray-900 peer-data-[state=checked]:shadow-sm"
          >
            Products
          </Label>
          <RadioGroupItem value="outfits" id="outfits" className="sr-only peer" />
          <Label
            htmlFor="outfits"
            className="flex h-full w-full cursor-pointer items-center justify-center rounded-md p-2 text-center text-sm font-medium text-gray-500 transition-all peer-data-[state=checked]:bg-white peer-data-[state=checked]:text-gray-900 peer-data-[state=checked]:shadow-sm"
          >
            Outfits
          </Label>
        </RadioGroup>

        {activeTab === 'overview' && (
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
