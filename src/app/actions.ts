'use server';

import {
  suggestInterestingDates,
  type SuggestInterestingDatesInput,
  type SuggestInterestingDatesOutput
} from '@/ai/flows/suggest-interesting-dates';

export async function getAiSuggestions(input: SuggestInterestingDatesInput): Promise<SuggestInterestingDatesOutput> {
  try {
    const suggestions = await suggestInterestingDates(input);
    return suggestions;
  } catch (error) {
    console.error('AI suggestion flow failed:', error);
    return { dates: [] };
  }
}
