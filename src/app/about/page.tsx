
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Target, Eye } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold font-headline">About Luv O3</h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground">
          Crafting purity, powered by nature.
        </p>
      </div>

      <div className="space-y-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-2xl">
              <Leaf className="text-primary" /> Our Story
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <p>
              Luv O3 was born from a simple yet powerful idea: to harness the purifying properties of ozone and combine them with the finest organic ingredients. Our journey began in a small lab, driven by a passion for creating skincare that is both effective and gentle. We believe in the synergy of science and nature to deliver products that not only beautify but also respect the skin's natural balance.
            </p>
            <p>
              We are proud to be India's first advanced skin and oral care brand utilizing ozonated organic oils. Every product is a testament to our commitment to quality, innovation, and sustainability.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                        <Target className="text-primary" /> Our Mission
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                    <p>
                        To provide advanced, safe, and effective skincare solutions by blending cutting-edge ozone technology with nature's purest ingredients, promoting healthier skin and a healthier planet.
                    </p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                        <Eye className="text-primary" /> Our Vision
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                   <p>
                        To be the leading innovator in ozonated personal care, inspiring a movement towards conscious beauty that prioritizes both personal well-being and environmental responsibility.
                   </p>
                </CardContent>
            </Card>
        </div>

      </div>
    </div>
  );
}
