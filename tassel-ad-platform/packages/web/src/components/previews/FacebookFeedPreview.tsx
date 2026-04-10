import type { AdVariation } from '@tassel/types';

interface Props {
  ad: Partial<AdVariation>;
  pageName: string;
  pageProfileUrl?: string;
  imageUrl?: string;
}

export function FacebookFeedPreview({ ad, pageName, pageProfileUrl, imageUrl }: Props) {
  return (
    <div className="w-[500px] bg-white border border-gray-200 rounded-lg font-sans text-sm shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 p-3">
        <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
          {pageProfileUrl && <img src={pageProfileUrl} alt="" className="w-full h-full object-cover" />}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{pageName}</p>
          <p className="text-xs text-gray-400">Sponsored</p>
        </div>
      </div>

      {/* Primary Text */}
      {ad.primaryText && (
        <p className="px-3 pb-3 text-gray-800 leading-relaxed whitespace-pre-wrap">
          {ad.primaryText}
        </p>
      )}

      {/* Image */}
      <div className="w-full aspect-[1.91/1] bg-gray-100 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt="Ad creative" className="w-full h-full object-cover" />
        ) : (
          <p className="text-gray-400 text-xs text-center px-4">{ad.imageBrief ?? 'Image placeholder'}</p>
        )}
      </div>

      {/* Headline + CTA */}
      <div className="flex items-center justify-between px-3 py-3 bg-gray-50 border-t border-gray-100">
        <div>
          <p className="font-semibold text-gray-900">{ad.headline ?? 'Headline'}</p>
          {ad.description && <p className="text-xs text-gray-500">{ad.description}</p>}
        </div>
        <button className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-xs font-medium whitespace-nowrap">
          {formatCta(ad.cta)}
        </button>
      </div>
    </div>
  );
}

function formatCta(cta?: string): string {
  const map: Record<string, string> = {
    LEARN_MORE: 'Learn More',
    APPLY_NOW: 'Apply Now',
    SIGN_UP: 'Sign Up',
    CONTACT_US: 'Contact Us',
    GET_DIRECTIONS: 'Get Directions',
    BOOK_TRAVEL: 'Book Now',
  };
  return cta ? (map[cta] ?? cta) : 'Learn More';
}
