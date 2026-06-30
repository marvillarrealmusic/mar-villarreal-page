import { defineField, defineType } from 'sanity';

export const artistProfile = defineType({
  name: 'artistProfile',
  title: 'Artist profile',
  type: 'document',
  fields: [
    defineField({
      name: 'fullName',
      title: 'Nombre artístico',
      type: 'localeString',
      validation: (Rule) => Rule.required().min(2),
    }),
    defineField({
      name: 'shortBio',
      title: 'Biografía breve',
      type: 'localeText',
      rows: 4,
    }),
    defineField({
      name: 'longBio',
      title: 'Biografía completa',
      type: 'localeText',
      rows: 8,
    }),
    defineField({
      name: 'profileImage',
      title: 'Foto de perfil',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'roles',
      title: 'Roles o etiquetas',
      type: 'array',
      initialValue: ['Singer', 'Songwriter', 'Producer', 'Creative Consultant'],
      of: [{ type: 'string' }],
      description: 'Ejemplo: cantante, productora, compositora.',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
});
