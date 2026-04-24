import type { MetadataRoute } from "next";
import { categories, siteConfig } from "@/lib/constants";
import { getAllTours } from "@/lib/tours";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tours = await getAllTours();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: new Date()
    },
    {
      url: `${siteConfig.url}/tours`,
      lastModified: new Date()
    },
    {
      url: `${siteConfig.url}/admin/login`,
      lastModified: new Date()
    }
  ];

  const categoryPages = categories.map((category) => ({
    url: `${siteConfig.url}/categories/${category.value}`,
    lastModified: new Date()
  }));

  const tourPages = tours.map((tour) => ({
    url: `${siteConfig.url}/tours/${tour.slug}`,
    lastModified: new Date(tour.createdAt)
  }));

  return [...staticPages, ...categoryPages, ...tourPages];
}
