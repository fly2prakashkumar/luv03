
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
              Luv O3 Pvt Ltd is a pioneer in ozone-infused skincare and herbal cream formulations. Leveraging innovative ozone technology, we develop high-quality, natural, and skin-friendly products designed to nourish, protect, and rejuvenate. With a strong foundation in chemical engineering and years of experience working with ozone applications, our mission is to bring safe, eco-conscious, and effective skincare solutions to the market.
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
                        To provide high-quality, science-backed, natural cosmetic products that promote healthy, radiant skin while maintaining the highest standards of safety and efficacy.
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
                        To become a trusted global brand recognized for excellence in ozone and herbal skincare, setting new standards for quality and innovation in the cosmetics industry.
                   </p>
                </CardContent>
            </Card>
        </div>

      </div>
    </div>
  );
}
