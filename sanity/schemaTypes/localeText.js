import { defineField, defineType } from 'sanity';

export const localeText = defineType({
  name: 'localeText',
  title: 'Localized text',
  type: 'object',
  fields: [
    defineField({
      name: 'en',
      title: 'English',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'es',
      title: 'Español',
      type: 'text',
      rows: 4,
    }),
  ],
});
