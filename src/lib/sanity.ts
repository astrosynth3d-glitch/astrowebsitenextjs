import { createClient } from "@sanity/client";

// ✅ Environment variables
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

// ❌ Fail early in development (better debugging)
if (!projectId || !dataset) {
  throw new Error(
    "❌ Missing Sanity environment variables. Check Vercel settings."
  );
}

// ✅ Create Sanity client
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // 🚀 IMPORTANT: enable CDN for production
});

// ✅ Generic fetch helper with revalidation support
export async function fetchSanityData<T>(
  query: string,
  params: Record<string, unknown> = {},
  options: { revalidate?: number } = {}
): Promise<T | null> {
  try {
    const data = await sanityClient.fetch(query, params, {
      next: {
        revalidate: options.revalidate ?? 10, // ⏱ auto refresh every 10s
      },
    });

    if (!data) {
      console.warn("⚠️ Empty Sanity response:", query);
      return null;
    }

    return data;
  } catch (error) {
    console.error("❌ Sanity fetch error:", error);
    return null;
  }
}