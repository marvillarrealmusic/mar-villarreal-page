import { defineField, defineType } from 'sanity';

export const musicRelease = defineType({
  name: 'musicRelease',
  title: 'Music release',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título del lanzamiento',
      type: 'localeString',
      validation: (Rule) => Rule.required().min(2),
    }),
    defineField({
      name: 'releaseDate',
      title: 'Fecha de lanzamiento',
      type: 'date',
      initialValue: '2024-01-01',
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'localeText',
      rows: 4,
    }),
    defineField({
      name: 'coverImage',
      title: 'Portada',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'spotifyUrl',
      title: 'Spotify',
      type: 'url',
      initialValue: 'https://open.spotify.com/artist/5Yq88YEjyRPaYnOumCq34g',
    }),
    defineField({
      name: 'appleMusicUrl',
      title: 'Apple Music',
      type: 'url',
      initialValue: 'https://music.apple.com/es/artist/mar-villarreal/1204725571',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube',
      type: 'url',
      initialValue: 'https://www.youtube.com/c/MarVillarreal',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Destacado',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
});
