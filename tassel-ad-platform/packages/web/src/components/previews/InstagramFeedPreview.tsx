import type { AdVariation } from '@tassel/types';

interface Props {
  ad: Partial<AdVariation>;
  pageName: string;
  pageProfileUrl?: string;
  imageUrl?: string;
}

export function InstagramFeedPreview({ ad, pageName, pageProfileUrl, imageUrl }: Props) {
  return (
    <div className="w-[375px] bg-white border border-gray-200 rounded-lg font-sans text-sm shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 p-3">
        <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden flex-shrink-0 ring-2 ring-pink-400">
          {pageProfileUrl && <img src={pageProfileUrl} alt="" className="w-full h-full object-cover" />}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900 text-xs">{pageName}</p>
          <p className="text-[10px] text-gray-400">Sponsored</p>
        </div>
        <span className="text-gray-400 text-lg">···</span>
      </div>

      {/* Square Image */}
      <div className="w-full aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt="Ad creative" className="w-full h-full object-cover" />
        ) : (
          <p className="text-gray-400 text-xs text-center px-4">{ad.imageBrief ?? 'Image placeholder'}</p>
        )}
      </div>

      {/* Actions */}
      <div className="px-3 pt-2 pb-1 flex gap-3 text-gray-700">
        <span>♡</span>
        <span>💬</span>
        <span>↗</span>
      </div>

      {/* Caption */}
      <div className="px-3 pb-3">
        <p className="font-semibold text-xs text-gray-900">{pageName}</p>
        {ad.primaryText && (
          <p className="text-xs text-gray-700 mt-0.5 leading-relaxed line-clamp-3">
            {ad.primaryText}
          </p>
        )}
        {ad.hashtags && ad.hashtags.length > 0 && (
          <p className="text-xs text-blue-500 mt-1">{ad.hashtags.join(' ')}</p>
        )}

        {/* CTA */}
        <button className="mt-2 w-full py-1.5 bg-blue-600 text-white text-xs font-semibold rounded">
          {ad.headline ?? 'Learn More'}
        </button>
      </div>
    </div>
  );
}
