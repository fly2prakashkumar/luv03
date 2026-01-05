"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { generateRecommendations } from "./actions";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  skinType: z.string().min(1, "Please select your skin type."),
  skinConcerns: z.string().min(3, "Please describe your skin concerns."),
});

type FormValues = z.infer<typeof formSchema>;

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skinType: "",
      skinConcerns: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setRecommendations(null);
    const result = await generateRecommendations(values);
    setIsLoading(false);

    if (result.success) {
      setRecommendations(result.recommendations);
    } else {
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: result.error,
      });
    }
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 md:py-20">
      <div className="text-center mb-10">
        <Wand2 className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold font-headline">
          Personalized Recommendations
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Let our AI expert analyze your skin needs and recommend the perfect products for you.
        </p>
      </div>
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="skinType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skin Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your skin type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="oily">Oily</SelectItem>
                        <SelectItem value="dry">Dry</SelectItem>
                        <SelectItem value="combination">Combination</SelectItem>
                        <SelectItem value="sensitive">Sensitive</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      This helps us understand your skin's base characteristics.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="skinConcerns"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skin Concerns</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., acne, fine lines, dark spots, redness"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      List any issues you'd like to address. Be as specific as you like.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Analyzing..." : "Get Recommendations"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="text-center mt-8">
            <p>Our AI is crafting your personalized routine...</p>
        </div>
      )}

      {recommendations && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Your Personalized Routine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
              {recommendations}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
