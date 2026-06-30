import { defineArrayMember, defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Nombre del sitio',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'siteTagline',
      title: 'Lema o subtítulo',
      type: 'localeText',
      description: 'Una frase breve que represente la artista.',
    }),
    defineField({
      name: 'introTitle',
      title: 'Título introductorio',
      type: 'localeString',
      description: 'Texto principal para la portada.',
    }),
    defineField({
      name: 'introText',
      title: 'Texto introductorio',
      type: 'localeText',
      description: 'Presentación breve del trabajo artístico.',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Correo de contacto',
      type: 'string',
      initialValue: 'info@marvillarreal.com',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'bookingEmail',
      title: 'Correo para bookings',
      type: 'string',
      initialValue: 'info@marvillarreal.com',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'phone',
      title: 'Teléfono',
      type: 'string',
    }),
    defineField({
      name: 'location',
      title: 'Ubicación',
      type: 'string',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Redes sociales',
      type: 'array',
      initialValue: [
        {
          platform: 'Instagram',
          url: 'https://www.instagram.com/marvillarrealmusic',
        },
        {
          platform: 'Spotify',
          url: 'https://open.spotify.com/artist/5Yq88YEjyRPaYnOumCq34g',
        },
        {
          platform: 'YouTube',
          url: 'https://www.youtube.com/c/MarVillarreal',
        },
        {
          platform: 'SoundCloud',
          url: 'https://soundcloud.com/marvillarrealmusic',
        },
        {
          platform: 'Facebook',
          url: 'https://www.facebook.com/marvillarrealcr/',
        },
        {
          platform: 'Apple Music',
          url: 'https://music.apple.com/es/artist/mar-villarreal/1204725571',
        },
      ],
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Plataforma',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'mainImage',
      title: 'Imagen principal',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
});
