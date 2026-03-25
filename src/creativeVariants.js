export function createEmptyVariant(index) {
  return {
    id: `v-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    label: `Option ${index + 1}`,
    copy: '',
    headline: '',
    cta: 'Learn More',
    websiteUrl: '',
    imagePreview: null,
    storyImagePreview: null,
  }
}

/** Normalize saved API state (supports legacy single-variant shape). */
export function normalizeVariantsFromState(state) {
  if (!state) return [createEmptyVariant(0)]
  if (Array.isArray(state.variants) && state.variants.length > 0) {
    return state.variants.map((v, i) => ({
      id: v.id || `legacy-${i}`,
      label: (v.label && String(v.label).trim()) || `Option ${i + 1}`,
      copy: v.copy ?? '',
      headline: v.headline ?? '',
      cta: v.cta || 'Learn More',
      websiteUrl: v.websiteUrl ?? '',
      imagePreview: v.imagePreview ?? null,
      storyImagePreview: v.storyImagePreview ?? null,
    }))
  }
  return [
    {
      ...createEmptyVariant(0),
      copy: state.copy ?? '',
      headline: state.headline ?? '',
      cta: state.cta || 'Learn More',
      websiteUrl: state.websiteUrl ?? '',
      imagePreview: state.imagePreview ?? null,
      storyImagePreview: state.storyImagePreview ?? null,
    },
  ]
}

export function buildSharePayload(facebookPageName, instagramUsername, profileLogoPreview, variants) {
  return {
    facebookPageName,
    instagramUsername,
    profileLogoPreview,
    variants: variants.map(
      ({ id, label, copy, headline, cta, websiteUrl, imagePreview, storyImagePreview }) => ({
        id,
        label,
        copy,
        headline,
        cta,
        websiteUrl,
        imagePreview,
        storyImagePreview,
      }),
    ),
  }
}
