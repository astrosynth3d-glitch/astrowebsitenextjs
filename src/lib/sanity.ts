import { createClient } from '@sanity/client';

// Environment variables
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';

// ⚠️ Safer check (don’t crash build in production)
if (!projectId || !dataset) {
  console.warn(
    "⚠️ Missing Sanity environment variables. Check Netlify environment settings."
  );
}

// Create Sanity client
export const sanityClient = createClient({
  projectId: projectId || '',
  dataset: dataset || '',
  apiVersion,
  useCdn: false, // ✅ IMPORTANT: disable CDN to fix missing data
});

// Helper function for fetching data
export async function fetchSanityData<T>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<T | null> {
  try {
    const data = await sanityClient.fetch(query, params);

    // ✅ Prevent UI from breaking if data is empty
    if (!data) {
      console.warn("⚠️ Sanity returned empty data for query:", query);
      return null;
    }

    return data;
  } catch (error) {
    console.error("❌ Sanity fetch error:", error);
    return null; // ✅ don’t crash UI
  }
}