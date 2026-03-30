import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://innovatech.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = ['en', 'ru', 'kk'];

  // Main pages with alternates
  const mainPages = languages.map((lang) => ({
    url: `${baseUrl}/${lang}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1.0,
  }));

  // Solution pages (anchor links on main page, but good for SEO)
  const solutionAnchors = languages.flatMap((lang) => [
    {
      url: `${baseUrl}/${lang}#solutions`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/${lang}#innovation`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/${lang}#contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]);

  return [
    // Root redirect
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    ...mainPages,
    ...solutionAnchors,
  ];
}
