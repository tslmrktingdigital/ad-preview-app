import type { AdVariation } from '@tassel/types';

interface Props {
  ad: Partial<AdVariation>;
  pageName: string;
  imageUrl?: string;
}

export function InstagramStoriesPreview({ ad, pageName, imageUrl }: Props) {
  return (
    <div className="w-[300px] h-[533px] bg-black rounded-2xl overflow-hidden relative font-sans text-white shadow-lg">
      {/* Background image */}
      {imageUrl ? (
        <img src={imageUrl} alt="Ad creative" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <p className="text-gray-400 text-xs text-center px-4">{ad.imageBrief ?? 'Image placeholder'}</p>
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

      {/* Top bar */}
      <div className="relative z-10 flex items-center gap-2 p-4">
        <div className="w-8 h-8 rounded-full bg-white/20 border border-white/40" />
        <div>
          <p className="text-xs font-semibold">{pageName}</p>
          <p className="text-[10px] opacity-70">Sponsored</p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 text-center">
        {ad.headline && <p className="text-sm font-bold mb-2 drop-shadow">{ad.headline}</p>}
        <button className="w-full py-2 bg-white text-black text-xs font-bold rounded-full">
          {ad.cta?.replace('_', ' ') ?? 'Learn More'}
        </button>
      </div>
    </div>
  );
}
