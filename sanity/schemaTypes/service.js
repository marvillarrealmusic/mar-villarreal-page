import { defineField, defineType } from 'sanity';

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nombre del servicio',
      type: 'localeString',
      validation: (Rule) => Rule.required().min(2),
    }),
    defineField({
      name: 'summary',
      title: 'Resumen breve',
      type: 'localeText',
      rows: 3,
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'localeText',
      rows: 6,
    }),
    defineField({
      name: 'iconName',
      title: 'Nombre del icono',
      type: 'string',
      description: 'Para usar en la UI si se desea.',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Destacado',
      type: 'boolean',
      initialValue: false,
    }),
  ],
});
