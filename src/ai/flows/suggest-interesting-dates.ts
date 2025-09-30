'use server';

/**
 * @fileOverview This file defines a Genkit flow to suggest interesting dates for NASA's APOD.
 *
 * It exports:
 * - `suggestInterestingDates`: An async function that suggests interesting dates for APOD.
 * - `SuggestInterestingDatesInput`: The input type for the suggestInterestingDates function.
 * - `SuggestInterestingDatesOutput`: The output type for the suggestInterestingDates function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestInterestingDatesInputSchema = z.object({
  currentDate: z
    .string()
    .describe('The current date, used to provide context for suggestions.'),
});
export type SuggestInterestingDatesInput = z.infer<
  typeof SuggestInterestingDatesInputSchema
>;

const SuggestInterestingDatesOutputSchema = z.object({
  dates: z
    .array(z.string())
    .describe(
      'An array of dates that had particularly interesting or visually striking APODs.'
    ),
});
export type SuggestInterestingDatesOutput = z.infer<
  typeof SuggestInterestingDatesOutputSchema
>;

export async function suggestInterestingDates(
  input: SuggestInterestingDatesInput
): Promise<SuggestInterestingDatesOutput> {
  return suggestInterestingDatesFlow(input);
}

const suggestInterestingDatesPrompt = ai.definePrompt({
  name: 'suggestInterestingDatesPrompt',
  input: {schema: SuggestInterestingDatesInputSchema},
  output: {schema: SuggestInterestingDatesOutputSchema},
  prompt: `You are an astronomy expert who suggests interesting dates from NASA's APOD archive.

  Given the current date: {{{currentDate}}}, suggest three past dates that had particularly interesting or visually striking APODs.

  Return the dates in YYYY-MM-DD format.
  Ensure all the dates you return are before the current date.
  Dates:
  `,
});

const suggestInterestingDatesFlow = ai.defineFlow(
  {
    name: 'suggestInterestingDatesFlow',
    inputSchema: SuggestInterestingDatesInputSchema,
    outputSchema: SuggestInterestingDatesOutputSchema,
  },
  async input => {
    const {output} = await suggestInterestingDatesPrompt(input);
    return output!;
  }
);
