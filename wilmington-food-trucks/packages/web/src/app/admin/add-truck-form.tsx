'use client';

import { useState } from 'react';
import { Plus, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const CUISINE_OPTIONS = [
  { value: 'american', label: '🍔 American' },
  { value: 'bbq', label: '🔥 BBQ' },
  { value: 'mexican', label: '🌮 Mexican' },
  { value: 'seafood', label: '🦞 Seafood' },
  { value: 'asian', label: '🍜 Asian' },
  { value: 'italian', label: '🍝 Italian' },
  { value: 'caribbean', label: '🌴 Caribbean' },
  { value: 'mediterranean', label: '🫒 Mediterranean' },
  { value: 'vegan', label: '🥗 Vegan' },
  { value: 'desserts', label: '🍰 Desserts' },
  { value: 'coffee', label: '☕ Coffee' },
  { value: 'other', label: '🍽️ Other' },
];

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function AddTruckForm() {
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    cuisineTypes: [] as string[],
    phone: '',
    email: '',
    facebookUrl: '',
    instagramUrl: '',
    twitterUrl: '',
    websiteUrl: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4001';

  function handleNameChange(name: string) {
    setForm((f) => ({
      ...f,
      name,
      slug: slugEdited ? f.slug : slugify(name),
    }));
  }

  function toggleCuisine(value: string) {
    setForm((f) => ({
      ...f,
      cuisineTypes: f.cuisineTypes.includes(value)
        ? f.cuisineTypes.filter((c) => c !== value)
        : [...f.cuisineTypes, value],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch(`${API}/api/admin/trucks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          facebookUrl: form.facebookUrl || undefined,
          instagramUrl: form.instagramUrl || undefined,
          twitterUrl: form.twitterUrl || undefined,
          websiteUrl: form.websiteUrl || undefined,
          phone: form.phone || undefined,
          email: form.email || undefined,
          description: form.description || undefined,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error ?? 'Failed to add truck');

      setStatus('success');
      setForm({
        name: '', slug: '', description: '', cuisineTypes: [],
        phone: '', email: '', facebookUrl: '', instagramUrl: '', twitterUrl: '', websiteUrl: '',
      });
      setSlugEdited(false);
    } catch (err) {
      setStatus('error');
      setErrorMsg((err as Error).message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Name + Slug */}
      <div className="card p-5 space-y-4">
        <h2 className="font-bold text-stone-700 text-sm uppercase tracking-widest">Basic Info</h2>

        <div>
          <label className="block text-sm font-semibold text-stone-600 mb-1">Truck Name *</label>
          <input
            required
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Block Taco"
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-400 text-base"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-600 mb-1">URL Slug *</label>
          <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-orange-400">
            <span className="px-3 text-stone-400 text-sm bg-stone-50 border-r border-stone-200 py-3 select-none">/trucks/</span>
            <input
              required
              value={form.slug}
              onChange={(e) => { setSlugEdited(true); setForm((f) => ({ ...f, slug: e.target.value })); }}
              placeholder="block-taco"
              pattern="[a-z0-9-]+"
              className="flex-1 px-3 py-3 text-stone-900 placeholder:text-stone-300 focus:outline-none text-base bg-white"
            />
          </div>
          <p className="text-xs text-stone-400 mt-1">Lowercase letters, numbers, and hyphens only</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-600 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="One sentence about this truck..."
            rows={2}
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-400 text-base resize-none"
          />
        </div>
      </div>

      {/* Cuisine type */}
      <div className="card p-5">
        <h2 className="font-bold text-stone-700 text-sm uppercase tracking-widest mb-3">Cuisine Type</h2>
        <div className="flex flex-wrap gap-2">
          {CUISINE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleCuisine(opt.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                form.cuisineTypes.includes(opt.value)
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-orange-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Social links */}
      <div className="card p-5 space-y-4">
        <h2 className="font-bold text-stone-700 text-sm uppercase tracking-widest">Social Media & Website</h2>
        <p className="text-xs text-stone-400 -mt-2">Add as many as you have — the crawler will pull schedule info from all of them.</p>

        {[
          { key: 'facebookUrl', label: '👍 Facebook URL', placeholder: 'https://facebook.com/truckname' },
          { key: 'instagramUrl', label: '📸 Instagram URL', placeholder: 'https://instagram.com/truckname' },
          { key: 'twitterUrl', label: '🐦 Twitter/X URL', placeholder: 'https://twitter.com/truckname' },
          { key: 'websiteUrl', label: '🌐 Website URL', placeholder: 'https://truckname.com' },
        ].map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="block text-sm font-semibold text-stone-600 mb-1">{label}</label>
            <input
              type="url"
              value={(form as any)[key]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              placeholder={placeholder}
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-400 text-base"
            />
          </div>
        ))}
      </div>

      {/* Status messages */}
      {status === 'success' && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <div>
            <p className="font-semibold text-emerald-700">Truck added!</p>
            <p className="text-xs text-emerald-600">The crawler will pull their schedule within 4 hours.</p>
          </div>
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{errorMsg}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60 text-base"
      >
        {status === 'loading' ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Adding truck...</>
        ) : (
          <><Plus className="w-5 h-5" /> Add Truck</>
        )}
      </button>
    </form>
  );
}
