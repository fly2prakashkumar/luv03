"use server";

import { getProductRecommendations, type ProductRecommendationsInput } from "@/ai/flows/personalized-product-recommendations";

export async function generateRecommendations(input: ProductRecommendationsInput) {
    try {
        const result = await getProductRecommendations(input);
        return { success: true, recommendations: result.recommendations };
    } catch (error) {
        console.error("Error generating recommendations:", error);
        return { success: false, error: "Failed to generate recommendations. Please try again." };
    }
}
