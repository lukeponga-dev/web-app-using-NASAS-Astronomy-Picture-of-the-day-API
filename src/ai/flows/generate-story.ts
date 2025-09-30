'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate a story based on APOD data.
 *
 * It exports:
 * - `generateStory`: An async function that generates a story.
 * - `GenerateStoryInput`: The input type for the generateStory function.
 * - `GenerateStoryOutput`: The output type for the generateStory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStoryInputSchema = z.object({
  title: z.string().describe('The title of the astronomy picture.'),
  explanation: z.string().describe('The explanation of the astronomy picture.'),
});
export type GenerateStoryInput = z.infer<typeof GenerateStoryInputSchema>;

const GenerateStoryOutputSchema = z.object({
  story: z.string().describe('An imaginative story based on the picture.'),
});
export type GenerateStoryOutput = z.infer<typeof GenerateStoryOutputSchema>;

export async function generateStory(
  input: GenerateStoryInput
): Promise<GenerateStoryOutput> {
  return generateStoryFlow(input);
}

const generateStoryPrompt = ai.definePrompt({
  name: 'generateStoryPrompt',
  input: {schema: GenerateStoryInputSchema},
  output: {schema: GenerateStoryOutputSchema},
  prompt: `You are a master science-fiction storyteller. 
  
  Given the following title and explanation from NASA's Astronomy Picture of the Day, write a short, imaginative, and family-friendly story. 
  
  The story should be inspired by the astronomical object or event, but feel free to be creative and adventurous.

  Title: {{{title}}}
  
  Explanation: {{{explanation}}}
  
  Your story:
  `,
});

const generateStoryFlow = ai.defineFlow(
  {
    name: 'generateStoryFlow',
    inputSchema: GenerateStoryInputSchema,
    outputSchema: GenerateStoryOutputSchema,
  },
  async input => {
    const {output} = await generateStoryPrompt(input);
    return output!;
  }
);
