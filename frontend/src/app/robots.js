export default function robots() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://scholarnest.com";
  
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/browse", "/listing/", "/campus/", "/category/", "/about"],
      disallow: [
        "/dashboard/", 
        "/sell", 
        "/orders", 
        "/profile", 
        "/account/",
        "/login",
        "/api/",
        "/*?*q=", // Don't crawl infinite search permutations
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
