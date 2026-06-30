import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes/index.js';

const projectId =
  (typeof import.meta !== 'undefined' && import.meta.env?.SANITY_STUDIO_PROJECT_ID) ||
  process.env.SANITY_STUDIO_PROJECT_ID ||
  'your-project-id';

const dataset =
  (typeof import.meta !== 'undefined' && import.meta.env?.SANITY_STUDIO_DATASET) ||
  process.env.SANITY_STUDIO_DATASET ||
  'production';

export default defineConfig({
  name: 'mar-villarreal-studio',
  title: 'Mar Villarreal Studio',
  projectId,
  dataset,
  plugins: [deskTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
