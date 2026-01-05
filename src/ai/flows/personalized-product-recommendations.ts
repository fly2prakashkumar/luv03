'use server';

/**
 * @fileOverview Provides personalized skincare product recommendations based on user's skin type and concerns.
 *
 * - `getProductRecommendations` - A function that generates personalized product recommendations.
 * - `ProductRecommendationsInput` - The input type for the `getProductRecommendations` function.
 * - `ProductRecommendationsOutput` - The return type for the `getProductRecommendations` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductRecommendationsInputSchema = z.object({
  skinType: z
    .string()
    .describe('The user\'s skin type (e.g., oily, dry, combination, sensitive).'),
  skinConcerns: z
    .string()
    .describe(
      'The user\'s specific skin concerns (e.g., acne, aging, dryness, hyperpigmentation). Multiple concerns should be comma separated.'
    ),
});
export type ProductRecommendationsInput = z.infer<
  typeof ProductRecommendationsInputSchema
>;

const ProductRecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe(
      'A list of personalized skincare product recommendations based on the user\'s skin type and concerns.'
    ),
});
export type ProductRecommendationsOutput = z.infer<
  typeof ProductRecommendationsOutputSchema
>;

export async function getProductRecommendations(
  input: ProductRecommendationsInput
): Promise<ProductRecommendationsOutput> {
  return productRecommendationsFlow(input);
}

const productRecommendationsPrompt = ai.definePrompt({
  name: 'productRecommendationsPrompt',
  input: {schema: ProductRecommendationsInputSchema},
  output: {schema: ProductRecommendationsOutputSchema},
  prompt: `You are a skincare expert providing personalized product recommendations.

  Based on the user's skin type and concerns, recommend suitable skincare products.
  Consider the following information:

  Skin Type: {{{skinType}}}
  Skin Concerns: {{{skinConcerns}}}

  Provide a detailed list of product recommendations with brief explanations of why each product is suitable for the user.
`,
});

const productRecommendationsFlow = ai.defineFlow(
  {
    name: 'productRecommendationsFlow',
    inputSchema: ProductRecommendationsInputSchema,
    outputSchema: ProductRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await productRecommendationsPrompt(input);
    return output!;
  }
);
