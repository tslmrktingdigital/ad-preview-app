import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, Globe, Instagram, Facebook, Twitter } from 'lucide-react';
import { getTruck } from '../../../lib/api';
import { formatDate, formatTime } from '../../../lib/utils';

export const revalidate = 300;

interface Props {
  params: { slug: string };
}

export default async function TruckPage({ params }: Props) {
  const truck = await getTruck(params.slug).catch(() => null);
  if (!truck) notFound();

  const grouped = truck.schedule.reduce<Record<string, typeof truck.schedule>>((acc, entry) => {
    const key = typeof entry.date === 'string' ? entry.date : new Date(entry.date).toISOString().split('T')[0]!;
    (acc[key] ??= []).push(entry);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        {truck.logoUrl ? (
          <Image src={truck.logoUrl} alt={truck.name} width={72} height={72} className="rounded-full object-cover w-18 h-18" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center text-3xl flex-shrink-0">🚚</div>
        )}
        <div>
          <h1 className="text-2xl font-bold">{truck.name}</h1>
          {truck.cuisineTypes.length > 0 && (
            <p className="text-stone-500 text-sm capitalize">{truck.cuisineTypes.join(' · ')}</p>
          )}
        </div>
      </div>

      {truck.description && (
        <p className="text-stone-600">{truck.description}</p>
      )}

      {/* Social links */}
      <div className="flex gap-3 flex-wrap">
        {truck.websiteUrl && (
          <a href={truck.websiteUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-stone-600 bg-white border border-stone-200 rounded-full px-3 py-1.5">
            <Globe className="w-4 h-4" /> Website
          </a>
        )}
        {truck.instagramUrl && (
          <a href={truck.instagramUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-stone-600 bg-white border border-stone-200 rounded-full px-3 py-1.5">
            <Instagram className="w-4 h-4" /> Instagram
          </a>
        )}
        {truck.facebookUrl && (
          <a href={truck.facebookUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-stone-600 bg-white border border-stone-200 rounded-full px-3 py-1.5">
            <Facebook className="w-4 h-4" /> Facebook
          </a>
        )}
        {truck.twitterUrl && (
          <a href={truck.twitterUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-stone-600 bg-white border border-stone-200 rounded-full px-3 py-1.5">
            <Twitter className="w-4 h-4" /> Twitter
          </a>
        )}
      </div>

      {/* Upcoming schedule */}
      {Object.keys(grouped).length > 0 ? (
        <section>
          <h2 className="font-semibold text-stone-700 mb-3">Upcoming Schedule</h2>
          <div className="space-y-4">
            {Object.entries(grouped).map(([date, entries]) => (
              <div key={date} className="bg-white rounded-xl border border-stone-100 overflow-hidden">
                <div className="px-4 py-2 bg-stone-50 border-b border-stone-100">
                  <p className="text-sm font-medium text-stone-600">{formatDate(date)}</p>
                </div>
                {entries.map((entry) => (
                  <div key={entry.id} className="px-4 py-3 flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-stone-800">{entry.locationName}</p>
                      <p className="text-sm text-stone-500">{entry.address}</p>
                      <div className="flex items-center gap-1 text-sm text-stone-500 mt-0.5">
                        <Clock className="w-3.5 h-3.5" />
                        {formatTime(entry.startTime)} – {formatTime(entry.endTime)}
                      </div>
                      {entry.notes && <p className="text-xs text-stone-400 mt-1 italic">{entry.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-sm text-amber-700">
          No upcoming locations found. Check their social media for the latest updates.
        </div>
      )}

      {/* Recent posts */}
      {truck.posts.length > 0 && (
        <section>
          <h2 className="font-semibold text-stone-700 mb-3">Recent Posts</h2>
          <div className="space-y-3">
            {truck.posts.map((post) => (
              <a
                key={post.id}
                href={post.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-xl border border-stone-100 p-4 active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-stone-500 capitalize bg-stone-100 px-2 py-0.5 rounded-full">
                    {post.platform}
                  </span>
                </div>
                <p className="text-sm text-stone-700 line-clamp-4">{post.text}</p>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
