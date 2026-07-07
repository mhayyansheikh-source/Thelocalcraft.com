import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://thelocalcrafts.com'

    // Local SEO Static Pages
    const regions = ["punjab", "sindh", "kpk", "balochistan", "gilgit-baltistan", "ajk"]
    const cities = ["karachi", "lahore", "islamabad", "multan", "peshawar", "quetta", "faisalabad", "sialkot", "hyderabad", "rawalpindi"]

    const regionUrls = regions.map((region) => ({
        url: `${baseUrl}/region/${region}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    const cityUrls = cities.map((city) => ({
        url: `${baseUrl}/delivery/${city}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/explore`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/stories`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        ...regionUrls,
        ...cityUrls,
    ]
}
