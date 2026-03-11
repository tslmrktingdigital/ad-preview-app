import { useState, useEffect } from 'react'
import FacebookAdPreview from './FacebookAdPreview'
import InstagramAdPreview from './InstagramAdPreview'
import FacebookStoryPreview from './FacebookStoryPreview'
import InstagramStoryPreview from './InstagramStoryPreview'
import './App.css'

export default function ShareableView({ id }) {
  const [state, setState] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) {
      setError('Missing preview ID')
      setLoading(false)
      return
    }
    const base = typeof window !== 'undefined' ? window.location.origin : ''
    fetch(`${base}/api/view/${encodeURIComponent(id)}`)
      .then((r) => {
        if (!r.ok) throw new Error(r.status === 404 ? 'Preview not found' : 'Failed to load')
        return r.json()
      })
      .then(setState)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="shareable-view shareable-loading">
        <p>Loading preview…</p>
      </div>
    )
  }

  if (error || !state) {
    return (
      <div className="shareable-view shareable-error">
        <p>{error || 'Preview not found'}</p>
        <a href="/">Create your own preview</a>
      </div>
    )
  }

  const {
    facebookPageName = '',
    instagramUsername = '',
    copy: copyText = '',
    headline = '',
    cta = 'Learn More',
    websiteUrl = '',
    imagePreview = null,
    storyImagePreview = null,
    profileLogoPreview = null,
  } = state

  return (
    <div className="shareable-view">
      <div className="shareable-header">
        <h1>Ad Preview</h1>
        <p className="shareable-subtitle">Shared preview — videos and GIFs play below.</p>
      </div>
      <div className="previews-section export-area shareable-previews">
        <h2>Feed previews (1:1)</h2>
        <div className="preview-grid preview-grid-feed">
          <div className="preview-card">
            <div className="preview-label">
              <span className="icon facebook" aria-hidden />
              Facebook Feed
            </div>
            <div className="preview-card-inner">
              <FacebookAdPreview
                pageName={facebookPageName}
                copy={copyText}
                headline={headline}
                websiteUrl={websiteUrl}
                cta={cta}
                imageUrl={imagePreview}
                avatarUrl={profileLogoPreview}
              />
            </div>
          </div>
          <div className="preview-card">
            <div className="preview-label">
              <span className="icon instagram" aria-hidden />
              Instagram Feed
            </div>
            <div className="preview-card-inner">
              <InstagramAdPreview
                username={instagramUsername}
                copy={copyText}
                headline={headline}
                websiteUrl={websiteUrl}
                imageUrl={imagePreview}
                cta={cta}
                avatarUrl={profileLogoPreview}
              />
            </div>
          </div>
        </div>
        <h2 className="preview-section-title">Story previews</h2>
        <div className="preview-grid preview-grid-story">
          <div className="preview-card">
            <div className="preview-label">
              <span className="icon facebook" aria-hidden />
              Facebook Story
            </div>
            <div className="preview-card-inner">
              <FacebookStoryPreview
                pageName={facebookPageName}
                imageUrl={storyImagePreview}
                cta={cta}
                avatarUrl={profileLogoPreview}
              />
            </div>
          </div>
          <div className="preview-card">
            <div className="preview-label">
              <span className="icon instagram" aria-hidden />
              Instagram Story
            </div>
            <div className="preview-card-inner">
              <InstagramStoryPreview
                username={instagramUsername}
                imageUrl={storyImagePreview}
                cta={cta}
                avatarUrl={profileLogoPreview}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
