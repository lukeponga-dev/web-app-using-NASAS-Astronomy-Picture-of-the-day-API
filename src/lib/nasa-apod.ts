import { z } from 'zod';

const ApodSchema = z.object({
  copyright: z.string().optional(),
  date: z.string(),
  explanation: z.string(),
  hdurl: z.string().optional(),
  media_type: z.enum(['image', 'video']),
  service_version: z.string(),
  title: z.string(),
  url: z.string(),
});

export type ApodData = z.infer<typeof ApodSchema>;

export type ApodResponse = ApodData | { code: number; msg: string; };

export async function fetchApod(date: string): Promise<ApodResponse> {
  const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`;

  try {
    const response = await fetch(url, { next: { revalidate: 86400 } }); // Revalidate once a day
    if (!response.ok) {
        const errorData = await response.json();
        console.error('NASA API Error:', errorData);
        return { code: response.status, msg: errorData.msg || `API request failed with status ${response.status}` };
    }
    const data = await response.json();
    const parsedData = ApodSchema.safeParse(data);
    if (!parsedData.success) {
      console.error('Zod parsing error:', parsedData.error);
      return { code: 500, msg: "Failed to parse API response." };
    }
    return parsedData.data;
  } catch (error) {
    console.error('Error fetching APOD:', error);
    if (error instanceof Error) {
        return { code: 500, msg: error.message };
    }
    return { code: 500, msg: 'An unknown error occurred while fetching APOD data.' };
  }
}

export function isApodError(response: ApodResponse): response is { code: number; msg: string } {
    return 'code' in response;
}
