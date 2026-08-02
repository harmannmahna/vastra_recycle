import { Item } from '../types';

export interface AiPriceEstimate {
  recommendedPrice: number;
  minFairPrice: number;
  maxFairPrice: number;
  reasoning: string;
}

export function calculateAiRecommendedPrice(item: Item): AiPriceEstimate {
  const expectedSellingPrice = item.price;

  // 1. Age adjustment factor (< 3 yrs rule)
  const age = item.ageYears || 1;
  let ageMultiplier = 1.0;
  if (age <= 0.5) ageMultiplier = 1.05;
  else if (age <= 1) ageMultiplier = 0.98;
  else if (age <= 2) ageMultiplier = 0.90;
  else if (age <= 3) ageMultiplier = 0.82;

  // 2. Condition multiplier
  let conditionMultiplier = item.condition === 'wearable_like_new' ? 1.04 : 0.92;

  // 3. Hygiene score multiplier (1 to 5)
  const hygiene = item.hygieneRating || 5;
  const hygieneMultiplier = 0.85 + (hygiene / 5) * 0.15;

  // 4. Color & defect adjustments
  let defectMultiplier = 1.0;
  if (item.isColorFaded) defectMultiplier -= 0.06;
  if (item.hasStainsOrDefects) defectMultiplier -= 0.10;

  // Calculate raw AI fair estimate centered around Expected Selling Price
  let rawPrice = expectedSellingPrice * ageMultiplier * conditionMultiplier * hygieneMultiplier * defectMultiplier;

  // Round to nearest 50
  let recommendedPrice = Math.round(rawPrice / 50) * 50;
  if (recommendedPrice <= 0) recommendedPrice = Math.round((expectedSellingPrice * 0.90) / 50) * 50;

  // Fair negotiation range bounds (approx 80% to 110% of expected selling price)
  const minFairPrice = Math.max(100, Math.round((expectedSellingPrice * 0.80) / 50) * 50);
  const maxFairPrice = Math.round((expectedSellingPrice * 1.10) / 50) * 50;

  // Keep recommended price bounded within fair range
  recommendedPrice = Math.max(minFairPrice, Math.min(maxFairPrice, recommendedPrice));

  const reasoning = `AI Estimate calculated from Expected Price (₹${expectedSellingPrice.toLocaleString()}), ${age} yr age, ${item.condition.replace('_', ' ')} condition, and ${hygiene}/5 hygiene rating.`;

  return {
    recommendedPrice,
    minFairPrice,
    maxFairPrice,
    reasoning
  };
}
