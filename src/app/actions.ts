'use server';

import {
  suggestInterestingDates,
  type SuggestInterestingDatesInput,
  type SuggestInterestingDatesOutput
} from '@/ai/flows/suggest-interesting-dates';

import {
  suggestRandomDate,
  type SuggestRandomDateInput,
  type SuggestRandomDateOutput
} from '@/ai/flows/suggest-random-date';

export async function getAiSuggestions(input: SuggestInterestingDatesInput): Promise<SuggestInterestingDatesOutput> {
  try {
    const suggestions = await suggestInterestingDates(input);
    return suggestions;
  } catch (error) {
    console.error('AI suggestion flow failed:', error);
    return { dates: [] };
  }
}

export async function getRandomDateSuggestion(input: SuggestRandomDateInput): Promise<SuggestRandomDateOutput> {
  try {
    const suggestion = await suggestRandomDate(input);
    return suggestion;
  } catch (error) {
    console.error('AI random date suggestion failed:', error);
    // Return a fallback random date
    const start = new Date('1995-06-16').getTime();
    const end = new Date().getTime();
    const randomDate = new Date(start + Math.random() * (end - start));
    const year = randomDate.getFullYear();
    const month = String(randomDate.getMonth() + 1).padStart(2, '0');
    const day = String(randomDate.getDate()).padStart(2, '0');
    return { date: `${year}-${month}-${day}` };
  }
}
