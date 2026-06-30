import { readFileSync } from 'node:fs';
import { basename } from 'node:path';
import { createClient } from '@sanity/client';

const envFilePath = new URL('./.env', import.meta.url);

function loadEnvFile(filePath) {
  const env = {};

  try {
    const content = readFileSync(filePath, 'utf8');
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const separatorIndex = trimmed.indexOf('=');
      if (separatorIndex === -1) continue;

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim();
      env[key] = value.replace(/^['"]|['"]$/g, '');
    }
  } catch {
    // Ignore missing env file and fall back to process.env values.
  }

  return env;
}

const env = loadEnvFile(envFilePath);
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || env.SANITY_STUDIO_DATASET;
const token = process.env.SANITY_API_TOKEN || process.env.SANITY_AUTH_TOKEN || process.env.SANITY_TOKEN || env.SANITY_API_TOKEN || env.SANITY_AUTH_TOKEN || env.SANITY_TOKEN;

if (!projectId || !dataset || !token) {
  console.error('Missing Sanity credentials. Set SANITY_STUDIO_PROJECT_ID, SANITY_STUDIO_DATASET and a writable token (SANITY_API_TOKEN or SANITY_AUTH_TOKEN).');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

const imageCache = new Map();

async function getImageReference(relativePath, altText = '') {
  const cacheKey = `${relativePath}:${altText}`;
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey);
  }

  const imagePath = new URL(relativePath, import.meta.url);
  const fileBuffer = readFileSync(imagePath);
  const asset = await client.assets.upload('image', fileBuffer, {
    filename: basename(imagePath.pathname),
    title: altText || basename(imagePath.pathname),
  });

  const imageReference = {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: asset._id,
    },
    alt: altText,
  };

  imageCache.set(cacheKey, imageReference);
  return imageReference;
}

async function getDocuments() {
  const [mainImage, heroImage, signatureImage, profileImage, releaseCover, socialImage] = await Promise.all([
    getImageReference('../public/img/photo.jpg', 'Mar Villarreal portrait'),
    getImageReference('../public/img/photo.jpg', 'Mar Villarreal hero image'),
    getImageReference('../public/img/signature.png', 'Mar Villarreal signature'),
    getImageReference('../public/img/photo.jpg', 'Mar Villarreal profile'),
    getImageReference('../public/img/right.jpg', 'Mar Villarreal release cover'),
    getImageReference('../public/img/photo.jpg', 'Mar Villarreal social preview'),
  ]);

  return [
    {
      _id: 'siteSettings',
      _type: 'siteSettings',
      siteTitle: {
        en: 'Mar Villarreal',
        es: 'Mar Villarreal',
      },
      siteTagline: {
        en: 'Singer, songwriter, producer and creative consultant',
        es: 'Cantante, compositora, productora y consultora creativa',
      },
      introTitle: {
        en: 'Creative',
        es: 'Creativa',
      },
      introText: {
        en: 'My name is Mar Villarreal. I sing, produce and write songs. The influence of Soul, Jazz, Reggae and R&B leaded me to create my own musical style. I am also involved as a consultant in different projects providing services like Brand Design, Social Media Management and Digital Marketing.',
        es: 'Soy Mar Villarreal. Canto, produzco y escribo canciones. La influencia del soul, jazz, reggae y R&B me llevó a crear mi propio estilo musical. También participo como consultora en distintos proyectos ofreciendo servicios de diseño de marca, gestión de redes sociales y marketing digital.',
      },
      contactEmail: 'info@marvillarreal.com',
      bookingEmail: 'info@marvillarreal.com',
      phone: '',
      location: 'Costa Rica',
      socialLinks: [
        { platform: 'Instagram', url: 'https://www.instagram.com/marvillarrealmusic' },
        { platform: 'Spotify', url: 'https://open.spotify.com/artist/5Yq88YEjyRPaYnOumCq34g' },
        { platform: 'YouTube', url: 'https://www.youtube.com/c/MarVillarreal' },
        { platform: 'SoundCloud', url: 'https://soundcloud.com/marvillarrealmusic' },
        { platform: 'Facebook', url: 'https://www.facebook.com/marvillarrealcr/' },
        { platform: 'Apple Music', url: 'https://music.apple.com/es/artist/mar-villarreal/1204725571' },
      ],
      mainImage,
      seo: {
        metaTitle: 'Mar Villarreal | Singer, Songwriter & Creative Consultant',
        metaDescription:
          'Mar Villarreal is a singer, songwriter, producer and creative consultant creating soulful, modern music and brand-led creative experiences.',
        ogTitle: 'Mar Villarreal | Music & Creative Consulting',
        ogDescription:
          'Discover Mar Villarreal’s music, creative work, and consulting services in one place.',
        ogImage: socialImage,
        canonicalUrl: 'https://marvillarreal.com',
      },
    },
    {
      _id: 'homePage',
      _type: 'homePage',
      title: {
        en: 'Creative',
        es: 'Creativa',
      },
      subtitle: {
        en: 'Introduction',
        es: 'Introducción',
      },
      description: {
        en: 'My name is Mar Villarreal. I sing, produce and write songs. The influence of Soul, Jazz, Reggae and R&B leaded me to create my own musical style.',
        es: 'Soy Mar Villarreal. Canto, produzco y escribo canciones. La influencia del soul, jazz, reggae y R&B me llevó a crear mi propio estilo musical.',
      },
      heroImage,
      signatureImage,
      seo: {
        metaTitle: 'Mar Villarreal | Creative Home',
        metaDescription:
          'Explore Mar Villarreal’s creative world through music, storytelling, and artistic collaborations.',
        ogTitle: 'Mar Villarreal | Creative Home',
        ogDescription:
          'A glimpse into Mar Villarreal’s music and creative practice.',
        ogImage: socialImage,
        canonicalUrl: 'https://marvillarreal.com',
      },
    },
    {
      _id: 'artistProfile',
      _type: 'artistProfile',
      fullName: {
        en: 'Mar Villarreal',
        es: 'Mar Villarreal',
      },
      shortBio: {
        en: 'Mar Villarreal is a singer, songwriter, producer and creative consultant with a sound shaped by Soul, Jazz, Reggae and R&B.',
        es: 'Mar Villarreal es cantante, compositora, productora y consultora creativa, con un sonido influenciado por soul, jazz, reggae y R&B.',
      },
      longBio: {
        en: 'My name is Mar Villarreal. I sing, produce and write songs. The influence of Soul, Jazz, Reggae and R&B leaded me to create my own musical style. I am also involved as a consultant in different projects providing services like Brand Design, Social Media Management and Digital Marketing.',
        es: 'Soy Mar Villarreal. Canto, produzco y escribo canciones. La influencia del soul, jazz, reggae y R&B me llevó a crear mi propio estilo musical. También participo como consultora en distintos proyectos ofreciendo servicios de diseño de marca, gestión de redes sociales y marketing digital.',
      },
      roles: ['Singer', 'Songwriter', 'Producer', 'Creative Consultant'],
      profileImage,
      seo: {
        metaTitle: 'About Mar Villarreal',
        metaDescription:
          'Learn more about Mar Villarreal, her artistic background, and the creative disciplines she works in.',
        ogTitle: 'About Mar Villarreal',
        ogDescription:
          'Biography, artistic vision, and creative services from Mar Villarreal.',
        ogImage: socialImage,
        canonicalUrl: 'https://marvillarreal.com/about',
      },
    },
    {
      _id: 'musicRelease',
      _type: 'musicRelease',
      title: {
        en: 'Latest release',
        es: 'Último lanzamiento',
      },
      releaseDate: '2024-01-01',
      description: {
        en: 'New music from Mar Villarreal, blending soulful melodies with modern production.',
        es: 'Nueva música de Mar Villarreal, mezclando melodías soul con una producción moderna.',
      },
      coverImage: releaseCover,
      spotifyUrl: 'https://open.spotify.com/artist/5Yq88YEjyRPaYnOumCq34g',
      appleMusicUrl: 'https://music.apple.com/es/artist/mar-villarreal/1204725571',
      youtubeUrl: 'https://www.youtube.com/c/MarVillarreal',
      isFeatured: false,
      seo: {
        metaTitle: 'Latest Music by Mar Villarreal',
        metaDescription:
          'Stream the latest music releases from Mar Villarreal across Spotify, Apple Music and YouTube.',
        ogTitle: 'Latest Music by Mar Villarreal',
        ogDescription:
          'Discover Mar Villarreal’s newest release and listen on your preferred platform.',
        ogImage: socialImage,
        canonicalUrl: 'https://marvillarreal.com/releases',
      },
    },
    {
      _id: 'service-brand-consultant',
      _type: 'service',
      title: {
        en: 'Brand Consultant',
        es: 'Consultora de marca',
      },
      summary: {
        en: 'I build brands through cultural insights and strategic vision. Custom crafted business solutions.',
        es: 'Construyo marcas con una visión estratégica y cultural. Soluciones creativas y personalizadas para cada negocio.',
      },
      description: {
        en: 'I help ambitious businesses generate more profits by building awareness, driving web traffic, connecting with customers and growing overall sales.',
        es: 'Ayudo a negocios ambiciosos a crecer aumentando su visibilidad, atrayendo tráfico web, conectando con clientes y elevando sus ventas.',
      },
      iconName: 'sparkles',
      isFeatured: false,
      seo: {
        metaTitle: 'Brand Consulting by Mar Villarreal',
        metaDescription:
          'Explore brand consulting services from Mar Villarreal for creative strategy and audience growth.',
        ogTitle: 'Brand Consulting by Mar Villarreal',
        ogDescription:
          'Creative consulting services designed to grow brands with cultural insight and strategy.',
        ogImage: socialImage,
        canonicalUrl: 'https://marvillarreal.com/services',
      },
    },
  ];
}

async function seed() {
  const documents = await getDocuments();
  for (const document of documents) {
    const result = await client.createOrReplace({
      _id: document._id,
      ...document,
    });
    console.log(`Seeded ${document._type}: ${result._id}`);
  }
}

seed().catch((error) => {
  const message = error?.message || String(error);
  console.error('Seed failed.');
  console.error(message);
  if (message.includes('project user not found') || message.includes('not authorized') || message.includes('invalid token')) {
    console.error('This usually means the token is invalid for this project or was generated from a different Sanity account.');
    console.error('Create a new API token from the Sanity project dashboard with write permissions and retry.');
  }
  process.exit(1);
});
