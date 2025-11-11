// lib/llm-wrapper.ts
// Small adapter that uses the existing lib/llm.ts functions.
// The repo already has lib/llm.ts that exports generateIngredientSubstitution.
// We wrap it so the API route can call and normalize results.

import { generateIngredientSubstitution } from "@/lib/llm";

export async function suggestSubstitutionsRaw(ingredient: string, restriction = "") {
  // generateIngredientSubstitution returns text (your llm.ts does generateText)
  const raw = await generateIngredientSubstitution(ingredient, restriction);
  // Attempt to parse JSON if the model returned JSON; otherwise return text in 'text' field
  try {
    const parsed = JSON.parse(raw);
    return parsed;
  } catch {
    return { text: raw };
  }
}
