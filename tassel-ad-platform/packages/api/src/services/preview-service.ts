/**
 * Builds a shareable link by pushing ad data to the deployed ad-preview-app
 * (https://ad-preview-app.vercel.app) which renders Facebook/Instagram mockups.
 */

const CTA_LABELS: Record<string, string> = {
  LEARN_MORE: 'Learn More',
  APPLY_NOW: 'Apply Now',
  SIGN_UP: 'Sign Up',
  CONTACT_US: 'Contact Us',
  GET_DIRECTIONS: 'Get Directions',
  BOOK_TRAVEL: 'Book Now',
};

const PREVIEW_APP_URL =
  process.env.PREVIEW_APP_URL ?? 'https://ad-preview-app.vercel.app';

/** Derive an Instagram @username from the client's website URL or name. */
function deriveIgUsername(websiteUrl?: string | null, clientName?: string | null): string {
  if (websiteUrl) {
    const domain = websiteUrl.replace(/https?:\/\/(www\.)?/, '').split(/[./]/)[0];
    return `@${domain}`;
  }
  const slug = (clientName ?? 'school').toLowerCase().replace(/\s+/g, '');
  return `@${slug}`;
}

/** Upload the ad set to the preview app's Blob storage and return the shareable URL. */
export async function buildPreviewLink(
  client: { name?: string | null; websiteUrl?: string | null } | null | undefined,
  ads: { id: string; headline?: string | null; primaryText?: string | null; cta?: string | null }[]
): Promise<string> {
  const payload = {
    facebookPageName: client?.name ?? 'School',
    instagramUsername: deriveIgUsername(client?.websiteUrl, client?.name),
    profileLogoPreview: null,
    variants: ads.map((ad) => ({
      id: ad.id,
      label: ad.headline ?? 'Ad Preview',
      copy: ad.primaryText ?? '',
      headline: ad.headline ?? '',
      cta: CTA_LABELS[ad.cta ?? 'LEARN_MORE'] ?? 'Learn More',
      websiteUrl: client?.websiteUrl ?? '',
      imagePreview: null,
      storyImagePreview: null,
    })),
  };

  const response = await fetch(`${PREVIEW_APP_URL}/api/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? `Preview app returned ${response.status}`);
  }

  const { id } = await response.json();
  // Always use the canonical production domain, regardless of what VERCEL_URL the save API returns
  return `${PREVIEW_APP_URL}/view/${id}`;
}
