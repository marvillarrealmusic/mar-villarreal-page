const { z } = require("zod");

const localized = z.object({ es: z.string().trim().min(1), en: z.string().trim().min(1) }).strict();
const image = z.object({
  src: z.string().min(1),
  alt: localized,
  position: z.enum(["center", "top", "bottom", "left", "right"]).default("center"),
}).strict();
const social = z.object({ name: z.string().trim().min(1), url: z.string().url() }).strict();
const release = z.object({
  title: z.string().trim().min(1),
  releaseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  cover: image,
  spotifyUrl: z.string().url(),
}).strict();

const schema = z.object({
  site: z.object({ name: z.string().min(1), logo: image.optional(), url: z.string().url(), contactEmail: z.string().email(), spotifyArtistUrl: z.string().url() }).strict(),
  seo: z.object({ title: localized, description: localized, image: z.string().min(1) }).strict(),
  navigation: z.object({ home: localized, releases: localized, videos: localized, biography: localized, services: localized, social: localized, contact: localized }).strict(),
  ui: z.object({ skipToContent: localized, openMenu: localized, closeMenu: localized, languageSelector: localized, navigationLabel: localized, spanish: localized, english: localized, backToTop: localized }).strict(),
  hero: z.object({ eyebrow: localized, title: localized, description: localized, primaryCta: localized, secondaryCta: localized, image }).strict(),
  releases: z.object({ eyebrow: localized, title: localized, description: localized, listenLabel: localized, allMusicLabel: localized, playerTitle: localized, latestPlayerHeading: localized, popularPlayerHeading: localized, popularPlayerTitle: localized, emptyMessage: localized, sources: z.array(z.string().url()), items: z.array(release) }).strict(),
  videos: z.object({ eyebrow: localized, title: localized, description: localized, playLabel: localized, watchLabel: localized, emptyMessage: localized, sources: z.array(z.string().url()), items: z.array(z.object({ title: z.string().trim().min(1), youtubeUrl: z.string().url(), thumbnail: image }).strict()) }).strict(),
  biography: z.object({ eyebrow: localized, title: localized, body: localized, image }).strict(),
  services: z.object({
    eyebrow: localized, title: localized, description: localized, contactLabel: localized,
    items: z.array(z.object({ title: localized, description: localized }).strict()).min(1),
    portfolio: z.object({ url: z.string().url(), label: localized, title: localized, items: z.array(z.object({ name: z.string().trim().min(1), description: localized, image }).strict()) }).strict(),
    instagram: z.object({ url: z.string().url(), label: localized }).strict(),
  }).strict(),
  social: z.object({ eyebrow: localized, title: localized, description: localized, items: z.array(social).min(1) }).strict(),
  contact: z.object({ eyebrow: localized, title: localized, description: localized, emailLabel: localized }).strict(),
  footer: z.object({ rights: localized }).strict(),
}).strict();

module.exports = { schema };
