
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

  return (
    <>
    <style>{`
      .admin-tabs .radio-label {
        transition: background-color 0.5s ease, font-weight 0.5s ease, color 0.5s ease;
      }
      .admin-tabs [data-state=checked] ~ .radio-label {
        background-color: #4d4a45;
        font-weight: 600;
        color: #fff;
        clip-path: polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%);
      }
    `}</style>
    <div className="bg-muted/40 flex-1 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-center">
            <RadioGroup
              value={activeTab}
              onValueChange={setActiveTab}
              className="admin-tabs grid grid-cols-3 items-center bg-black p-1 rounded-md w-full max-w-md"
            >
                {TABS.map((tab) => (
                    <div key={tab} className="flex justify-center text-center">
                        <RadioGroupItem value={tab} id={tab} className="sr-only" />
                        <Label
                            htmlFor={tab}
                            className={cn(
                                "radio-label flex items-center justify-center h-10 w-full text-sm font-medium rounded-sm cursor-pointer",
                                activeTab !== tab ? "text-neutral-400" : "text-white"
                            )}
                        >
                            <span className="capitalize">{tab}</span>
                        </Label>
                    </div>
                ))}
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
    </>
  );
}
