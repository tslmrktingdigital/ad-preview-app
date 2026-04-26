import type { SocialPost } from '@wft/shared';

type ParsedPost = Omit<SocialPost, 'id' | 'truckId' | 'scrapedAt'>;

export function parsePostsFromText(
  texts: string[],
  links: string[],
  platform: SocialPost['platform']
): ParsedPost[] {
  return texts
    .slice(0, 10)
    .map((text, i) => ({
      platform,
      postUrl: links[i] ?? `${platform}-unknown-${Date.now()}-${i}`,
      text: text.slice(0, 1000),
      imageUrl: undefined,
      postedAt: undefined,
    }))
    .filter((p) => p.text.length > 10);
}
