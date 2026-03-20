import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://studysync.website", lastModified: new Date(), priority: 1 },
  ];
}