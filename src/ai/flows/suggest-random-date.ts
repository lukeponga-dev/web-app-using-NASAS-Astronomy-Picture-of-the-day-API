'use server';

/**
 * @fileOverview This file defines a Genkit flow to suggest a random date for NASA's APOD.
 *
 * It exports:
 * - `suggestRandomDate`: An async function that suggests a random date for APOD.
 * - `SuggestRandomDateInput`: The input type for the suggestRandomDate function.
 * - `SuggestRandomDateOutput`: The output type for the suggestRandomDate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRandomDateInputSchema = z.object({
  // No input needed for a random suggestion, but we can keep a consistent structure.
  // We could add constraints here in the future, like a year range.
});
export type SuggestRandomDateInput = z.infer<
  typeof SuggestRandomDateInputSchema
>;

const SuggestRandomDateOutputSchema = z.object({
  date: z
    .string()
    .describe(
      'A random date between 1995-06-16 (start of APOD) and today in YYYY-MM-DD format.'
    ),
});
export type SuggestRandomDateOutput = z.infer<
  typeof SuggestRandomDateOutputSchema
>;

export async function suggestRandomDate(
  input: SuggestRandomDateInput
): Promise<SuggestRandomDateOutput> {
  return suggestRandomDateFlow(input);
}

const suggestRandomDatePrompt = ai.definePrompt({
  name: 'suggestRandomDatePrompt',
  input: {schema: SuggestRandomDateInputSchema},
  output: {schema: SuggestRandomDateOutputSchema},
  prompt: `You are an assistant that provides a random date for NASA's Astronomy Picture of the Day (APOD).
  The first APOD was on 1995-06-16.
  The current date is ${new Date().toISOString().split('T')[0]}.
  
  Generate a single random date between 1995-06-16 and today.
  
  Return the date in YYYY-MM-DD format.
  `,
});

const suggestRandomDateFlow = ai.defineFlow(
  {
    name: 'suggestRandomDateFlow',
    inputSchema: SuggestRandomDateInputSchema,
    outputSchema: SuggestRandomDateOutputSchema,
  },
  async input => {
    const {output} = await suggestRandomDatePrompt(input);
    return output!;
  }
);
