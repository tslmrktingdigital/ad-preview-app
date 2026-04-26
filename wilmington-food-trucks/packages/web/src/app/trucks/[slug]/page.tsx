import { notFound } from 'next/navigation';
import { MapPin, Clock, Globe, Instagram, Facebook, Twitter, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getTruck } from '../../../lib/api';
import { formatDate, formatTime } from '../../../lib/utils';

export const revalidate = 300;

const CUISINE_EMOJI: Record<string, string> = {
  bbq: '🔥', mexican: '🌮', seafood: '🦞', asian: '🍜', american: '🍔',
  caribbean: '🌴', mediterranean: '🫒', vegan: '🥗', desserts: '🍰',
  coffee: '☕', italian: '🍝', other: '🍽️',
};

interface Props { params: { slug: string } }

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
        <div className="bg-orange-500 px-5 pt-6 pb-8">
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-3xl shadow-md">
            {emoji}
          </div>
          <h1 className="text-white text-2xl font-extrabold mt-3 leading-tight">{truck.name}</h1>
          {truck.cuisineTypes.length > 0 && (
            <p className="text-orange-200 text-sm capitalize mt-0.5">{truck.cuisineTypes.join(' · ')}</p>
          )}
        </div>
        {truck.description && (
          <div className="px-5 py-4 text-stone-600 text-sm leading-relaxed">
            {truck.description}
          </div>
        )}
      </div>

      {/* Social links */}
      {socialLinks.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {socialLinks.map(({ url, icon: Icon, label }) => (
            <a key={label} href={url!} target="_blank" rel="noopener noreferrer"
              className="card flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:border-orange-300 transition-colors active:scale-95">
              <Icon className="w-4 h-4 text-orange-500" />
              {label}
            </a>
          ))}
        </div>
      )}

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
