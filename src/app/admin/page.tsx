
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
import { cn } from "@/lib/utils";

const TABS = ["overview", "products", "outfits"];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const activeIndex = TABS.indexOf(activeTab);

  return (
    <div className="bg-muted/40 flex-1 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
            <RadioGroup
              value={activeTab}
              onValueChange={setActiveTab}
              className="relative grid grid-cols-3 items-center bg-white shadow-[0_0_1px_0_rgba(24,94,224,0.15),0_6px_12px_0_rgba(24,94,224,0.15)] p-1 rounded-full"
            >
                {TABS.map((tab) => (
                    <div key={tab} className="flex justify-center">
                        <RadioGroupItem value={tab} id={tab} className="sr-only peer" />
                        <Label
                            htmlFor={tab}
                            className={cn(
                                "flex items-center justify-center h-8 w-full text-sm font-medium rounded-full cursor-pointer transition-colors z-10",
                                activeTab === tab ? "text-blue-600" : "text-black"
                            )}
                        >
                            <span className="capitalize">{tab}</span>
                        </Label>
                    </div>
                ))}
              <div
                className="absolute h-8 w-1/3 bg-blue-100/70 rounded-full z-0 transition-transform duration-300 ease-out flex items-center justify-center"
                style={{ transform: `translateX(${activeIndex * 100}%)` }}
              >
              </div>
            </RadioGroup>
        </div>

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
