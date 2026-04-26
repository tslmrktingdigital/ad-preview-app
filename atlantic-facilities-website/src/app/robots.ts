import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://atlanticfacilitiesllc.com/sitemap.xml",
    host: "https://atlanticfacilitiesllc.com",
  };
}
