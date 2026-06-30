import { defineField, defineType } from 'sanity';

export const galleryImage = defineType({
  name: 'galleryImage',
  title: 'Gallery image',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título de la imagen',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Imagen',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Pie de foto',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          { title: 'Foto', value: 'photo' },
          { title: 'Behind the scenes', value: 'behind-the-scenes' },
          { title: 'Evento', value: 'event' },
        ],
      },
    }),
    defineField({
      name: 'isFeatured',
      title: 'Destacada',
      type: 'boolean',
      initialValue: false,
    }),
  ],
});
