import { notFound } from 'next/navigation';
import { MapPin, Clock, Globe, Instagram, Facebook, Twitter, ArrowLeft, UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';
import { getTruck } from '../../../lib/api';
import { formatDate, formatTime } from '../../../lib/utils';

const CUISINE_EMOJI: Record<string, string> = {
  bbq: '🔥', mexican: '🌮', seafood: '🦞', asian: '🍜', american: '🍔',
  caribbean: '🌴', mediterranean: '🫒', vegan: '🥗', desserts: '🍰',
  coffee: '☕', italian: '🍝', other: '🍽️',
};

const CUISINE_LABELS: Record<string, string> = {
  bbq: 'BBQ', mexican: 'Mexican', seafood: 'Seafood', asian: 'Asian',
  american: 'American', caribbean: 'Caribbean', mediterranean: 'Mediterranean',
  vegan: 'Vegan', desserts: 'Desserts', coffee: 'Coffee', italian: 'Italian', other: 'Other',
};

interface Props { params: { slug: string } }

export const revalidate = 300;

export default async function TruckPage({ params }: Props) {
  const truck = await getTruck(params.slug).catch(() => null);
  if (!truck) notFound();

  const emoji = truck.cuisineTypes[0] ? (CUISINE_EMOJI[truck.cuisineTypes[0]] ?? '🍽️') : '🚚';

  const grouped = truck.schedule.reduce<Record<string, typeof truck.schedule>>((acc, entry) => {
    const key = typeof entry.date === 'string' ? entry.date : new Date(entry.date).toISOString().split('T')[0]!;
    (acc[key] ??= []).push(entry);
    return acc;
  }, {});

  const socialLinks = [
    { url: truck.websiteUrl, icon: Globe, label: 'Website' },
    { url: truck.instagramUrl, icon: Instagram, label: 'Instagram' },
    { url: truck.facebookUrl, icon: Facebook, label: 'Facebook' },
    { url: truck.twitterUrl, icon: Twitter, label: 'Twitter' },
  ].filter((l) => l.url);

  return (
    <div className="space-y-5">
      {/* Back */}
      <Link href="/trucks" className="inline-flex items-center gap-1 text-sm text-orange-600 font-medium">
        <ArrowLeft className="w-4 h-4" /> All Trucks
      </Link>

      {/* Hero card */}
      <div className="card overflow-hidden">
        <div className="bg-orange-500 px-5 pt-6 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-3xl shadow-md">
            {emoji}
          </div>
          <h1 className="text-white text-2xl font-extrabold mt-3 leading-tight">{truck.name}</h1>
        </div>
      </div>

      {/* Menu section */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <UtensilsCrossed className="w-3.5 h-3.5 text-stone-400" />
          <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest">Menu</h2>
        </div>
        <div className="card px-5 py-4 space-y-3">
          {truck.cuisineTypes.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {truck.cuisineTypes.map((c) => (
                <span key={c} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-sm font-semibold border border-orange-200">
                  {CUISINE_EMOJI[c] ?? '🍽️'} {CUISINE_LABELS[c] ?? c}
                </span>
              ))}
            </div>
          )}
          {truck.description && (
            <p className="text-stone-600 text-sm leading-relaxed">{truck.description}</p>
          )}
          {socialLinks.length > 0 && (
            <div>
              <p className="text-xs text-stone-400 mb-2">Full menu on their socials:</p>
              <div className="flex gap-2 flex-wrap">
                {socialLinks.map(({ url, icon: Icon, label }) => (
                  <a key={label} href={url!} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-700 hover:border-orange-300 transition-colors active:scale-95">
                    <Icon className="w-3.5 h-3.5 text-orange-500" />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming schedule */}
      <section>
        <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Upcoming Schedule</h2>
        {Object.keys(grouped).length > 0 ? (
          <div className="space-y-3">
            {Object.entries(grouped).map(([date, entries]) => (
              <div key={date} className="card overflow-hidden">
                <div className="bg-stone-50 border-b border-stone-100 px-4 py-2">
                  <p className="text-sm font-bold text-stone-600">{formatDate(date)}</p>
                </div>
                {entries.map((entry, i) => (
                  <div key={entry.id} className={`px-4 py-3 flex items-start gap-3 ${i > 0 ? 'border-t border-stone-100' : ''}`}>
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-stone-900">{entry.locationName}</p>
                      <p className="text-xs text-stone-400 mt-0.5">{entry.address}</p>
                      <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(entry.startTime)} – {formatTime(entry.endTime)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="card px-4 py-5 flex items-center gap-3">
            <span className="text-2xl">📅</span>
            <div>
              <p className="font-semibold text-stone-700">No upcoming schedule found</p>
              <p className="text-xs text-stone-400 mt-0.5">Check their social media for the latest updates.</p>
            </div>
          </div>
        )}
      </section>

      {/* Recent posts */}
      {truck.posts.length > 0 && (
        <section>
          <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Recent Posts</h2>
          <div className="space-y-3">
            {truck.posts.map((post) => (
              <a key={post.id} href={post.postUrl} target="_blank" rel="noopener noreferrer"
                className="card block p-4 active:scale-[0.98] transition-transform">
                <span className={`badge mb-2 ${post.platform === 'instagram' ? 'bg-pink-100 text-pink-600' : post.platform === 'facebook' ? 'bg-blue-100 text-blue-600' : 'bg-sky-100 text-sky-600'}`}>
                  {post.platform === 'instagram' ? '📸' : post.platform === 'facebook' ? '👍' : '🐦'} {post.platform}
                </span>
                <p className="text-sm text-stone-700 leading-relaxed line-clamp-4">{post.text}</p>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
