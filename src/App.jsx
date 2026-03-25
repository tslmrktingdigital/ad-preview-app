import { useState, useCallback } from 'react'
import FacebookAdPreview from './FacebookAdPreview'
import InstagramAdPreview from './InstagramAdPreview'
import FacebookStoryPreview from './FacebookStoryPreview'
import InstagramStoryPreview from './InstagramStoryPreview'
import { createEmptyVariant, buildSharePayload } from './creativeVariants'
import './App.css'

function App() {
  const [facebookPageName, setFacebookPageName] = useState('')
  const [instagramUsername, setInstagramUsername] = useState('')
  const [profileLogo, setProfileLogo] = useState(null)
  const [profileLogoPreview, setProfileLogoPreview] = useState(null)

  const [variants, setVariants] = useState(() => [createEmptyVariant(0)])
  const [activeVariantIndex, setActiveVariantIndex] = useState(0)

  const activeVariant = variants[activeVariantIndex] ?? variants[0]

  const updateActiveVariant = useCallback((patch) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === activeVariantIndex ? { ...v, ...patch } : v)),
    )
  }, [activeVariantIndex])

  const addVariant = useCallback(() => {
    setVariants((prev) => {
      const newIdx = prev.length
      const next = [...prev, createEmptyVariant(newIdx)]
      queueMicrotask(() => setActiveVariantIndex(newIdx))
      return next
    })
  }, [])

  const removeVariant = useCallback(
    (index) => {
      if (variants.length <= 1) return
      setVariants((prev) => prev.filter((_, i) => i !== index))
      setActiveVariantIndex((i) => {
        if (i === index) return Math.max(0, index - 1)
        if (i > index) return i - 1
        return i
      })
    },
    [variants.length],
  )

  const handleImageChange = useCallback(
    (e) => {
      const file = e.target.files?.[0]
      if (!file) return
      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')
      if (!isImage && !isVideo) return
      const idx = activeVariantIndex
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result
        setVariants((prev) =>
          prev.map((v, i) => (i === idx ? { ...v, imagePreview: result } : v)),
        )
      }
      reader.readAsDataURL(file)
    },
    [activeVariantIndex],
  )

  const clearImage = useCallback(() => {
    updateActiveVariant({ imagePreview: null })
  }, [updateActiveVariant])

  const handleStoryImageChange = useCallback(
    (e) => {
      const file = e.target.files?.[0]
      if (!file) return
      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')
      if (!isImage && !isVideo) return
      const idx = activeVariantIndex
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result
        setVariants((prev) =>
          prev.map((v, i) => (i === idx ? { ...v, storyImagePreview: result } : v)),
        )
      }
      reader.readAsDataURL(file)
    },
    [activeVariantIndex],
  )

  const clearStoryImage = useCallback(() => {
    updateActiveVariant({ storyImagePreview: null })
  }, [updateActiveVariant])

  const handleProfileLogoChange = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setProfileLogo(file)
    const reader = new FileReader()
    reader.onload = () => setProfileLogoPreview(reader.result)
    reader.readAsDataURL(file)
  }, [])

  const clearProfileLogo = useCallback(() => {
    setProfileLogo(null)
    setProfileLogoPreview(null)
  }, [])

  const [shareUrl, setShareUrl] = useState('')
  const [shareLoading, setShareLoading] = useState(false)
  const [shareError, setShareError] = useState('')

  const handleGetShareLink = useCallback(async () => {
    setShareError('')
    setShareUrl('')
    setShareLoading(true)
    try {
      const payload = buildSharePayload(
        facebookPageName,
        instagramUsername,
        profileLogoPreview,
        variants,
      )
      const body = JSON.stringify(payload)
      const maxBytes = 4 * 1024 * 1024 // 4 MB (Vercel limit is 4.5 MB)
      if (new TextEncoder().encode(body).length > maxBytes) {
        throw new Error('Preview too large (images/videos). Use smaller files or shorter clips, then try again.')
      }
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        if (res.status === 413) {
          throw new Error('Preview too large. Use smaller images or shorter videos, then try again.')
        }
        const parts = [data.error || `Request failed (${res.status})`]
        if (data.detail) parts.push(data.detail)
        throw new Error(parts.join('\n\nDetails: '))
      }
      setShareUrl(data.url || `${window.location.origin}/view/${data.id}`)
    } catch (e) {
      setShareError(e.message || 'Something went wrong')
    } finally {
      setShareLoading(false)
    }
  }, [facebookPageName, instagramUsername, profileLogoPreview, variants])

  const handleCopyShareLink = useCallback(() => {
    if (!shareUrl) return
    navigator.clipboard.writeText(shareUrl).then(() => {
      /* copied */
    })
  }, [shareUrl])

  return (
    <div className="app">
      <header className="header">
        <h1>Ad Preview</h1>
        <p>Add one or more creative options — your client can compare copy and media on the shared link.</p>
      </header>

      <section className="column-left form-column">
        <div className="upload-card upload-card-form">
          <h2>Client / branding</h2>
          <p className="card-hint">Set these for the client you’re showing the preview to.</p>

          <label className="field">
            <span>Facebook page name</span>
            <input
              type="text"
              value={facebookPageName}
              onChange={(e) => setFacebookPageName(e.target.value)}
              placeholder="e.g. Acme Coffee Co."
            />
          </label>

          <label className="field">
            <span>Instagram username</span>
            <input
              type="text"
              value={instagramUsername}
              onChange={(e) => setInstagramUsername(e.target.value)}
              placeholder="e.g. acmecoffee"
            />
          </label>

          <label className="field">
            <span>Company logo / profile image</span>
            <p className="field-hint">Shows as the avatar in the top left of each ad preview.</p>
            <div
              className="image-upload image-upload-logo"
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('dragging'); }}
              onDragLeave={(e) => e.currentTarget.classList.remove('dragging')}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('dragging');
                const file = e.dataTransfer.files?.[0];
                if (file?.type.startsWith('image/')) {
                  setProfileLogo(file);
                  const reader = new FileReader();
                  reader.onload = () => setProfileLogoPreview(reader.result);
                  reader.readAsDataURL(file);
                }
              }}
            >
              <input
                id="profile-logo-upload"
                type="file"
                accept="image/*"
                onChange={handleProfileLogoChange}
                className="file-input"
              />
              {profileLogoPreview ? (
                <div className="image-preview-wrap image-preview-wrap-logo">
                  <img src={profileLogoPreview} alt="Profile" className="thumb thumb-logo" />
                  <button type="button" onClick={clearProfileLogo} className="clear-btn">Remove</button>
                </div>
              ) : (
                <label htmlFor="profile-logo-upload" className="drop-zone">
                  <span>Click or drag — square works best</span>
                </label>
              )}
            </div>
          </label>
        </div>
      </section>

      <section className="column-center form-column">
        <div className="upload-card upload-card-form">
          <h2>Creative options</h2>
          <p className="card-hint">Add multiple options so your client can compare copy and creative. Use the tabs to edit each one.</p>

          <div className="variant-tabs" role="tablist" aria-label="Creative options">
            {variants.map((v, i) => (
              <button
                key={v.id}
                type="button"
                role="tab"
                aria-selected={i === activeVariantIndex}
                className={`variant-tab ${i === activeVariantIndex ? 'variant-tab-active' : ''}`}
                onClick={() => setActiveVariantIndex(i)}
              >
                {v.label || `Option ${i + 1}`}
              </button>
            ))}
            <button type="button" className="variant-tab variant-tab-add" onClick={addVariant}>
              + Add option
            </button>
          </div>

          <div className="variant-toolbar">
            <label className="field variant-label-field">
              <span>Label for this option (shown to client)</span>
              <input
                type="text"
                value={activeVariant.label}
                onChange={(e) => updateActiveVariant({ label: e.target.value })}
                placeholder="e.g. Hook A, Summer sale, Video version"
              />
            </label>
            {variants.length > 1 && (
              <button
                type="button"
                className="variant-remove-btn"
                onClick={() => removeVariant(activeVariantIndex)}
              >
                Remove this option
              </button>
            )}
          </div>

          <h3 className="ad-content-subheading">Ad content — {activeVariant.label || `Option ${activeVariantIndex + 1}`}</h3>

          <label className="field">
            <span>Primary text / caption</span>
            <textarea
              value={activeVariant.copy}
              onChange={(e) => updateActiveVariant({ copy: e.target.value })}
              placeholder="Enter the main ad copy that appears above the image..."
              rows={4}
            />
          </label>

          <label className="field">
            <span>Headline (optional)</span>
            <input
              type="text"
              value={activeVariant.headline}
              onChange={(e) => updateActiveVariant({ headline: e.target.value })}
              placeholder="e.g. Summer Sale — 30% Off"
            />
          </label>

          <label className="field">
            <span>Call-to-action button</span>
            <select
              value={activeVariant.cta}
              onChange={(e) => updateActiveVariant({ cta: e.target.value })}
            >
              <option value="Learn More">Learn More</option>
              <option value="Shop Now">Shop Now</option>
              <option value="Sign Up">Sign Up</option>
              <option value="Download">Download</option>
              <option value="Book Now">Book Now</option>
              <option value="Contact Us">Contact Us</option>
              <option value="Subscribe">Subscribe</option>
            </select>
          </label>

          <label className="field">
            <span>Website / destination link</span>
            <input
              type="url"
              value={activeVariant.websiteUrl}
              onChange={(e) => updateActiveVariant({ websiteUrl: e.target.value })}
              placeholder="e.g. https://example.com or example.com"
            />
            <p className="field-hint">Where people go when they click the ad.</p>
          </label>
        </div>
      </section>

      <section className="column-right form-column">
        <div className="upload-card upload-card-form">
          <h2>Feed & story creative</h2>
          <p className="card-hint">
            Uploads apply to <strong>{activeVariant.label || `Option ${activeVariantIndex + 1}`}</strong> — switch tabs in Ad content to edit another option.
          </p>

          <label className="field">
            <span>Feed image (1:1)</span>
            <div
              className="image-upload"
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('dragging'); }}
              onDragLeave={(e) => e.currentTarget.classList.remove('dragging')}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('dragging');
                const file = e.dataTransfer.files?.[0];
                if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
                  const idx = activeVariantIndex;
                  const reader = new FileReader();
                  reader.onload = () => {
                    const result = reader.result;
                    setVariants((prev) =>
                      prev.map((v, i) => (i === idx ? { ...v, imagePreview: result } : v)),
                    );
                  };
                  reader.readAsDataURL(file);
                }
              }}
            >
              <input
                id="ad-image-upload"
                type="file"
                accept="image/*,video/mp4,video/quicktime,video/webm"
                onChange={handleImageChange}
                className="file-input"
              />
              {activeVariant.imagePreview ? (
                <div className="image-preview-wrap">
                  {activeVariant.imagePreview.startsWith('data:video/') ? (
                    <video src={activeVariant.imagePreview} className="thumb thumb-1-1" autoPlay loop muted playsInline />
                  ) : (
                    <img src={activeVariant.imagePreview} alt="Feed preview" className="thumb thumb-1-1" />
                  )}
                  <button type="button" onClick={clearImage} className="clear-btn">Remove</button>
                </div>
              ) : (
                <label htmlFor="ad-image-upload" className="drop-zone">
                  <span>Click or drag — image, video, or GIF (square)</span>
                </label>
              )}
            </div>
          </label>

          <label className="field">
            <span>Story image (9:16) — 1080×1920</span>
            <div
              className="image-upload image-upload-story"
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('dragging'); }}
              onDragLeave={(e) => e.currentTarget.classList.remove('dragging')}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('dragging');
                const file = e.dataTransfer.files?.[0];
                if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
                  const idx = activeVariantIndex;
                  const reader = new FileReader();
                  reader.onload = () => {
                    const result = reader.result;
                    setVariants((prev) =>
                      prev.map((v, i) => (i === idx ? { ...v, storyImagePreview: result } : v)),
                    );
                  };
                  reader.readAsDataURL(file);
                }
              }}
            >
              <input
                id="story-image-upload"
                type="file"
                accept="image/*,video/mp4,video/quicktime,video/webm"
                onChange={handleStoryImageChange}
                className="file-input"
              />
              {activeVariant.storyImagePreview ? (
                <div className="image-preview-wrap">
                  {activeVariant.storyImagePreview.startsWith('data:video/') ? (
                    <video src={activeVariant.storyImagePreview} className="thumb thumb-9-16" autoPlay loop muted playsInline />
                  ) : (
                    <img src={activeVariant.storyImagePreview} alt="Story preview" className="thumb thumb-9-16" />
                  )}
                  <button type="button" onClick={clearStoryImage} className="clear-btn">Remove</button>
                </div>
              ) : (
                <label htmlFor="story-image-upload" className="drop-zone">
                  <span>Click or drag — image, video, or GIF (vertical 9:16)</span>
                </label>
              )}
            </div>
          </label>
        </div>
      </section>

      <section className="previews-column previews-full-width">
        <div className="export-toolbar">
          <button
            type="button"
            className="export-pdf-btn"
            onClick={handleGetShareLink}
            disabled={shareLoading}
          >
            {shareLoading ? 'Creating link…' : 'Get shareable link'}
          </button>
        </div>
        {shareUrl && (
          <div className="share-link-box">
            <label className="share-link-label">Link for your client (videos &amp; GIFs play):</label>
            <div className="share-link-row">
              <input type="text" readOnly value={shareUrl} className="share-link-input" />
              <button type="button" className="copy-link-btn" onClick={handleCopyShareLink}>
                Copy
              </button>
            </div>
          </div>
        )}
        {shareError && (
          <div className="share-error">
            <p>{shareError.split('\n\n')[0]}</p>
            {shareError.includes('\n\nDetails:') && (
              <p className="share-error-detail">{shareError.split('\n\nDetails: ')[1]}</p>
            )}
          </div>
        )}
        <p className="export-hint">
          Send the link above to your client — they open it in a browser and see the previews with playable video.
        </p>
        <div className="previews-section export-area">
          {variants.length > 1 && (
            <p className="preview-variant-note">
              Previews below show <strong>{activeVariant.label || `Option ${activeVariantIndex + 1}`}</strong> — switch tabs above to preview another option.
            </p>
          )}
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
                  copy={activeVariant.copy}
                  headline={activeVariant.headline}
                  websiteUrl={activeVariant.websiteUrl}
                  cta={activeVariant.cta}
                  imageUrl={activeVariant.imagePreview}
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
                  copy={activeVariant.copy}
                  headline={activeVariant.headline}
                  websiteUrl={activeVariant.websiteUrl}
                  imageUrl={activeVariant.imagePreview}
                  cta={activeVariant.cta}
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
                  imageUrl={activeVariant.storyImagePreview}
                  cta={activeVariant.cta}
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
                  imageUrl={activeVariant.storyImagePreview}
                  cta={activeVariant.cta}
                  avatarUrl={profileLogoPreview}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
