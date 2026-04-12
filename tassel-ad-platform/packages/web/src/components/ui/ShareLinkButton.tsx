'use client';
import { useState } from 'react';
import { Spinner } from './Spinner';

interface Props {
  onGenerate: () => Promise<string>;
  label?: string;
  className?: string;
}

export function ShareLinkButton({ onGenerate, label = 'Share Preview', className = '' }: Props) {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (url) {
      // Already have a link — just copy it
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const link = await onGenerate();
      setUrl(link);
    } catch (err) {
      setError((err as Error).message ?? 'Failed to generate link');
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <button
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg disabled:opacity-60 transition-colors"
      >
        {loading ? (
          <Spinner size="sm" />
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        )}
        {loading ? 'Generating…' : url ? (copied ? 'Copied!' : 'Copy Link') : label}
      </button>

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      {url && (
        <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-lg max-w-sm">
          <svg className="w-3.5 h-3.5 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-indigo-600 hover:text-indigo-800 truncate flex-1"
          >
            {url}
          </a>
          <button
            onClick={handleCopy}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 shrink-0 transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  );
}
