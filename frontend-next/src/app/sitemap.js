export default async function sitemap() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://scholarnest.com";

  // Base static routes
  const routes = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/browse`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  try {
    // Fetch all active listings to generate dynamic listing URLs
    const res = await fetch(`${backendUrl}/api/listings?limit=1000`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const listings = data.listings || [];

      // Add dynamic listing URLs
      listings.forEach((listing) => {
        // Create slug like: casio-fx-991es-abc123
        const titleSlug = listing.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        const slug = `${titleSlug}-${listing._id}`;

        routes.push({
          url: `${siteUrl}/listing/${slug}`,
          lastModified: new Date(listing.updatedAt || listing.createdAt),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      });

      // Extract unique campuses
      const campuses = [...new Set(listings.map((l) => l.campus).filter(Boolean))];
      campuses.forEach((campus) => {
        const slug = campus.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        routes.push({
          url: `${siteUrl}/campus/${slug}`,
          lastModified: new Date(),
          changeFrequency: "daily",
          priority: 0.8,
        });
      });
      
      // Extract unique categories
      const categories = [...new Set(listings.map((l) => l.categoryName || l.category).filter(Boolean))];
      categories.forEach((category) => {
        const slug = category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        routes.push({
          url: `${siteUrl}/browse?category=${encodeURIComponent(category)}`,
          lastModified: new Date(),
          changeFrequency: "daily",
          priority: 0.8,
        });
      });
    }
  } catch (error) {
    console.error("Sitemap generation error:", error);
  }

  return routes;
}
