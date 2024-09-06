import { MetadataRoute } from "next";

export default (): MetadataRoute.Sitemap => [
  {
    url: "https://demand24.org",
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 1,
  },
  {
    url: "https://demand24.org/main",
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: "https://demand24.org/blogs",
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.5,
  },
];
