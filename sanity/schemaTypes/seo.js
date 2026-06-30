import { defineField, defineType } from 'sanity';

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta title',
      type: 'string',
      description: 'Título que aparece en resultados de búsqueda.',
      validation: (Rule) => Rule.max(60).warning('Se recomienda mantenerlo por debajo de 60 caracteres.'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      description: 'Resumen breve para buscadores y redes.',
      validation: (Rule) => Rule.max(160).warning('Se recomienda mantenerlo por debajo de 160 caracteres.'),
    }),
    defineField({
      name: 'ogTitle',
      title: 'Título de Open Graph',
      type: 'string',
    }),
    defineField({
      name: 'ogDescription',
      title: 'Descripción de Open Graph',
      type: 'text',
    }),
    defineField({
      name: 'ogImage',
      title: 'Imagen de Open Graph',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'URL canónica',
      type: 'url',
      description: 'URL principal de esta página.',
    }),
  ],
});
