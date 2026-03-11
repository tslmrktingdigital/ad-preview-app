import { useState, useCallback, useRef } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import FacebookAdPreview from './FacebookAdPreview'
import InstagramAdPreview from './InstagramAdPreview'
import FacebookStoryPreview from './FacebookStoryPreview'
import InstagramStoryPreview from './InstagramStoryPreview'
import './App.css'

function App() {
  const [facebookPageName, setFacebookPageName] = useState('')
  const [instagramUsername, setInstagramUsername] = useState('')
  const [copy, setCopy] = useState('')
  const [headline, setHeadline] = useState('')
  const [cta, setCta] = useState('Learn More')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [storyImage, setStoryImage] = useState(null)
  const [storyImagePreview, setStoryImagePreview] = useState(null)
  const [profileLogo, setProfileLogo] = useState(null)
  const [profileLogoPreview, setProfileLogoPreview] = useState(null)

  const handleImageChange = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')
    if (!isImage && !isVideo) return
    setImage(file)
    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)
  }, [])

  const clearImage = useCallback(() => {
    setImage(null)
    setImagePreview(null)
  }, [])

  const handleStoryImageChange = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')
    if (!isImage && !isVideo) return
    setStoryImage(file)
    const reader = new FileReader()
    reader.onload = () => setStoryImagePreview(reader.result)
    reader.readAsDataURL(file)
  }, [])

  const clearStoryImage = useCallback(() => {
    setStoryImage(null)
    setStoryImagePreview(null)
  }, [])

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

  const exportRef = useRef(null)
  const [isExporting, setIsExporting] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [shareLoading, setShareLoading] = useState(false)
  const [shareError, setShareError] = useState('')

  const handleExportPdf = useCallback(async () => {
    const el = exportRef.current
    if (!el || isExporting) return
    setIsExporting(true)
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4', true)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const margin = 10
      const contentWidth = pdfWidth - margin * 2
      const contentHeight = pdfHeight - margin * 2
      const ratio = Math.min(contentWidth / canvas.width, contentHeight / canvas.height)
      const imgWidth = canvas.width * ratio
      const imgHeight = canvas.height * ratio
      const x = (pdfWidth - imgWidth) / 2
      const y = margin
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight)
      pdf.save('ad-preview.pdf')
    } finally {
      setIsExporting(false)
    }
  }, [isExporting])

  const handleGetShareLink = useCallback(async () => {
    setShareError('')
    setShareUrl('')
    setShareLoading(true)
    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          facebookPageName,
          instagramUsername,
          copy,
          headline,
          cta,
          websiteUrl,
          imagePreview,
          storyImagePreview,
          profileLogoPreview,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Failed to create link')
      setShareUrl(data.url || `${window.location.origin}/view/${data.id}`)
    } catch (e) {
      setShareError(e.message || 'Something went wrong')
    } finally {
      setShareLoading(false)
    }
  }, [facebookPageName, instagramUsername, copy, headline, cta, websiteUrl, imagePreview, storyImagePreview, profileLogoPreview])

  const handleCopyShareLink = useCallback(() => {
    if (!shareUrl) return
    navigator.clipboard.writeText(shareUrl).then(() => {
      /* copied */
    })
  }, [shareUrl])

  const handleExportHtml = useCallback(() => {
    const esc = (s) => {
      if (s == null || s === '') return ''
      const str = String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
      return str
    }
    const getDomain = (url) => {
      if (!url?.trim()) return 'example.com'
      const s = url.trim()
      try {
        const withProtocol = s.startsWith('http') ? s : `https://${s}`
        return new URL(withProtocol).hostname.replace(/^www\./, '')
      } catch {
        return s.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0] || 'example.com'
      }
    }
    const isVideo = (url) => url && typeof url === 'string' && url.startsWith('data:video/')
    const pageName = esc(facebookPageName?.trim() || 'Your Page Name')
    const userName = esc(instagramUsername?.trim() ? (instagramUsername.startsWith('@') ? instagramUsername : `@${instagramUsername}`) : 'your_username')
    const captionUser = esc(instagramUsername?.trim() ? (instagramUsername.startsWith('@') ? instagramUsername.slice(1) : instagramUsername) : 'your_username')
    const copyText = copy ? esc(copy.length > 125 ? copy.slice(0, 125) + '...' : copy) : ''
    const headlineText = esc(headline)
    const ctaText = esc(cta)
    const domain = esc(getDomain(websiteUrl))
    const avatar = profileLogoPreview || ''
    const feedMedia = imagePreview || ''
    const storyMedia = storyImagePreview || ''

    const mediaTag = (url, className, alt) => {
      if (!url) return ''
      if (isVideo(url)) return `<video src="${url}" class="${className}" autoplay loop muted playsinline></video>`
      return `<img src="${url}" class="${className}" alt="${esc(alt)}">`
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Ad Preview — Facebook &amp; Instagram</title>
<style>
*{box-sizing:border-box}
body{margin:0;padding:2rem;background:#f8f9fa;font-family:system-ui,sans-serif;color:#111}
.export-page{max-width:1200px;margin:0 auto}
h1{font-size:1.5rem;margin:0 0 0.5rem}
.subtitle{color:#6b7280;margin:0 0 2rem;font-size:0.95rem}
.previews-section h2{font-size:1rem;font-weight:600;color:#6b7280;margin:0 0 1rem}
.preview-section-title{margin-top:1.5rem;margin-bottom:1rem}
.preview-grid{display:grid;gap:2rem}
.preview-grid-feed{grid-template-columns:1fr 1fr}
.preview-grid-story{grid-template-columns:1fr 1fr}
@media(max-width:900px){.preview-grid-feed,.preview-grid-story{grid-template-columns:1fr}}
.preview-card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden}
.preview-label{display:flex;align-items:center;gap:0.5rem;padding:0.75rem 1rem;font-size:0.85rem;font-weight:500;color:#6b7280;border-bottom:1px solid #e5e7eb}
.preview-card-inner{padding:2rem;display:flex;justify-content:center;align-items:flex-start}
.facebook-preview,.instagram-preview{max-width:640px;width:100%;margin:0 auto;border-radius:8px;overflow:hidden}
.facebook-preview{background:#fff;color:#050505;font-family:Helvetica,Arial,sans-serif;box-shadow:0 1px 2px rgba(0,0,0,0.1)}
.instagram-preview{background:#000;color:#f5f5f5;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,0.4)}
.fb-header,.ig-header{display:flex;align-items:center;gap:10px;padding:12px 16px}
.fb-avatar,.ig-avatar{width:40px;height:40px;border-radius:50%;flex-shrink:0;overflow:hidden;background:linear-gradient(135deg,#e4e6eb,#bcc0c4)}
.ig-avatar{width:32px;height:32px;background:linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)}
.fb-avatar-img,.ig-avatar-img,.fb-story-avatar-img,.ig-story-avatar-img{width:100%;height:100%;object-fit:cover;display:block}
.fb-meta,.ig-meta{flex:1;min-width:0}
.fb-page-name,.ig-username{font-size:15px;font-weight:600}
.fb-page-name{color:#050505}.ig-username{color:#f5f5f5}
.fb-sponsored,.ig-sponsored{font-size:12px;color:#65676b}.ig-sponsored{color:#a8a8a8}
.fb-body-text{padding:0 16px 12px;font-size:15px;line-height:1.33;color:#050505;white-space:pre-wrap;word-break:break-word}
.fb-image-wrap,.ig-image-wrap{width:100%;aspect-ratio:1;background:#f0f2f5;overflow:hidden}.ig-image-wrap{background:#1a1a1a}
.fb-image,.ig-image{display:block;width:100%;height:100%;object-fit:cover;object-position:center}
.fb-image-placeholder,.ig-image-placeholder{display:flex;align-items:center;justify-content:center;width:100%;height:100%;min-height:180px;color:#65676b;font-size:15px}
.fb-cta-bar{display:flex;align-items:center;justify-content:space-between;padding:10px 16px 12px;border-top:1px solid #e4e6eb;gap:12px}
.fb-cta-content{flex:1;min-width:0}
.fb-headline{font-size:15px;font-weight:600;color:#050505;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.fb-cta-domain{font-size:12px;color:#65676b;text-transform:uppercase;letter-spacing:0.02em}
.fb-cta-btn{padding:8px 20px;font-size:15px;font-weight:600;color:#fff;background:#1877f2;border:none;border-radius:6px}
.ig-cta-below-image{padding:12px 16px;border-bottom:1px solid #262626}
.ig-cta-btn{display:block;width:100%;padding:10px 16px;font-size:14px;font-weight:600;color:#fff;background:#1877f2;border:none;border-radius:8px;text-align:center}
.ig-actions{padding:6px 16px 8px}
.ig-action-row{display:flex;align-items:center;gap:16px}
.ig-caption-wrap{padding:0 16px 12px}
.ig-caption{font-size:14px;line-height:1.4;margin:0;color:#f5f5f5}
.ig-caption-username{font-weight:600;margin-right:4px}
.fb-story-preview,.ig-story-preview{display:flex;justify-content:center;padding:1rem}
.fb-story-preview{background:#f0f2f5;border-radius:0 0 8px 8px}
.ig-story-preview{background:#000;border-radius:0 0 12px 12px}
.fb-story-frame,.ig-story-frame{position:relative;width:100%;max-width:280px;aspect-ratio:9/16;border-radius:12px;overflow:hidden}
.fb-story-frame{background:#000;box-shadow:0 2px 12px rgba(0,0,0,0.2)}
.ig-story-frame{background:#1a1a1a;box-shadow:0 2px 16px rgba(0,0,0,0.5)}
.fb-story-image,.ig-story-image{display:block;width:100%;height:100%;object-fit:cover;object-position:center}
.fb-story-overlay,.ig-story-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.5) 0%,transparent 25%);pointer-events:none}
.fb-story-header,.ig-story-header{display:flex;align-items:center;gap:8px;padding:12px 12px 0}
.fb-story-avatar,.ig-story-avatar{width:32px;height:32px;border-radius:50%;flex-shrink:0;border:2px solid rgba(255,255,255,0.9);overflow:hidden}
.fb-story-avatar{background:linear-gradient(135deg,#e4e6eb,#bcc0c4)}
.ig-story-avatar{background:linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)}
.fb-story-page-name,.ig-story-username,.fb-story-sponsored,.ig-story-sponsored{font-size:14px;font-weight:600;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,0.5)}
.fb-story-sponsored,.ig-story-sponsored{margin-left:auto;font-weight:400}
.fb-story-cta,.ig-story-cta{position:absolute;bottom:24px;left:0;right:0;display:flex;justify-content:center;pointer-events:none}
.fb-story-cta-text,.ig-story-cta-text{font-size:14px;font-weight:600;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,0.6);background:rgba(0,0,0,0.35);padding:8px 20px;border-radius:20px}
</style>
</head>
<body>
<div class="export-page">
<h1>Ad Preview</h1>
<p class="subtitle">Facebook &amp; Instagram — videos and GIFs play in this file. Share by uploading to Google Drive, Dropbox, or Netlify Drop and sending the link.</p>
<div class="previews-section">
<h2>Feed previews (1:1)</h2>
<div class="preview-grid preview-grid-feed">
<div class="preview-card">
<div class="preview-label">Facebook Feed</div>
<div class="preview-card-inner">
<div class="facebook-preview">
<div class="fb-header"><div class="fb-avatar">${avatar ? `<img src="${avatar}" class="fb-avatar-img" alt="">` : ''}</div><div class="fb-meta"><span class="fb-page-name">${pageName}</span><span class="fb-sponsored">Sponsored</span></div></div>
${copyText ? `<div class="fb-body-text">${copyText}</div>` : '<div class="fb-body-text placeholder">Primary text</div>'}
<div class="fb-image-wrap">${feedMedia ? mediaTag(feedMedia, 'fb-image', 'Ad creative') : '<div class="fb-image-placeholder"><span>Image</span></div>'}</div>
<div class="fb-cta-bar"><div class="fb-cta-content">${headlineText ? `<span class="fb-headline">${headlineText}</span>` : ''}<span class="fb-cta-domain">${domain}</span></div><button type="button" class="fb-cta-btn">${ctaText}</button></div>
</div></div></div>
<div class="preview-card">
<div class="preview-label">Instagram Feed</div>
<div class="preview-card-inner">
<div class="instagram-preview">
<div class="ig-header"><div class="ig-avatar">${avatar ? `<img src="${avatar}" class="ig-avatar-img" alt="">` : ''}</div><div class="ig-meta"><span class="ig-username">${userName}</span><span class="ig-sponsored">Sponsored</span></div></div>
<div class="ig-image-wrap">${feedMedia ? mediaTag(feedMedia, 'ig-image', 'Ad creative') : '<div class="ig-image-placeholder"><span>Image</span></div>'}</div>
<div class="ig-cta-below-image"><button type="button" class="ig-cta-btn">${ctaText}</button></div>
<div class="ig-actions"><div class="ig-action-row"></div></div>
<div class="ig-caption-wrap"><p class="ig-caption"><span class="ig-caption-username">${captionUser}</span> ${copyText || 'Caption'}</p></div>
</div></div></div>
</div>
<h2 class="preview-section-title">Story previews</h2>
<div class="preview-grid preview-grid-story">
<div class="preview-card">
<div class="preview-label">Facebook Story</div>
<div class="preview-card-inner">
<div class="fb-story-preview"><div class="fb-story-frame">${storyMedia ? mediaTag(storyMedia, 'fb-story-image', 'Story') : '<div class="fb-story-placeholder"><span>9:16</span></div>'}<div class="fb-story-overlay"><div class="fb-story-header"><div class="fb-story-avatar">${avatar ? `<img src="${avatar}" class="fb-story-avatar-img" alt="">` : ''}</div><span class="fb-story-page-name">${pageName}</span><span class="fb-story-sponsored">Sponsored</span></div></div><div class="fb-story-cta"><span class="fb-story-cta-text">${ctaText}</span></div></div></div>
</div></div>
<div class="preview-card">
<div class="preview-label">Instagram Story</div>
<div class="preview-card-inner">
<div class="ig-story-preview"><div class="ig-story-frame">${storyMedia ? mediaTag(storyMedia, 'ig-story-image', 'Story') : '<div class="ig-story-placeholder"><span>9:16</span></div>'}<div class="ig-story-overlay"><div class="ig-story-header"><div class="ig-story-avatar">${avatar ? `<img src="${avatar}" class="ig-story-avatar-img" alt="">` : ''}</div><span class="ig-story-username">${userName}</span><span class="ig-story-sponsored">Sponsored</span></div></div><div class="ig-story-cta"><span class="ig-story-cta-text">${ctaText}</span></div></div></div>
</div></div>
</div>
</div>
</div>
</body>
</html>`
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'ad-preview.html'
    a.click()
    URL.revokeObjectURL(a.href)
  }, [facebookPageName, instagramUsername, copy, headline, cta, websiteUrl, imagePreview, storyImagePreview, profileLogoPreview])

  return (
    <div className="app">
      <header className="header">
        <h1>Ad Preview</h1>
        <p>Upload your copy and image to see how it looks on Facebook and Instagram.</p>
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
          <h2>Ad content</h2>

          <label className="field">
            <span>Primary text / caption</span>
            <textarea
              value={copy}
              onChange={(e) => setCopy(e.target.value)}
              placeholder="Enter the main ad copy that appears above the image..."
              rows={4}
            />
          </label>

          <label className="field">
            <span>Headline (optional)</span>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Summer Sale — 30% Off"
            />
          </label>

          <label className="field">
            <span>Call-to-action button</span>
            <select value={cta} onChange={(e) => setCta(e.target.value)}>
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
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="e.g. https://example.com or example.com"
            />
            <p className="field-hint">Where people go when they click the ad.</p>
          </label>
        </div>
      </section>

      <section className="column-right form-column">
        <div className="upload-card upload-card-form">
          <h2>Feed & story creative</h2>
          <p className="card-hint">Upload images or video for feed (1:1) and stories (9:16).</p>

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
                  setImage(file);
                  const reader = new FileReader();
                  reader.onload = () => setImagePreview(reader.result);
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
              {imagePreview ? (
                <div className="image-preview-wrap">
                  {imagePreview.startsWith('data:video/') ? (
                    <video src={imagePreview} className="thumb thumb-1-1" autoPlay loop muted playsInline />
                  ) : (
                    <img src={imagePreview} alt="Feed preview" className="thumb thumb-1-1" />
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
                  setStoryImage(file);
                  const reader = new FileReader();
                  reader.onload = () => setStoryImagePreview(reader.result);
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
              {storyImagePreview ? (
                <div className="image-preview-wrap">
                  {storyImagePreview.startsWith('data:video/') ? (
                    <video src={storyImagePreview} className="thumb thumb-9-16" autoPlay loop muted playsInline />
                  ) : (
                    <img src={storyImagePreview} alt="Story preview" className="thumb thumb-9-16" />
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
            onClick={handleExportPdf}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting…' : 'Export to PDF'}
          </button>
          <button
            type="button"
            className="export-html-btn"
            onClick={handleExportHtml}
          >
            Export as HTML
          </button>
          <button
            type="button"
            className="export-share-btn"
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
        {shareError && <p className="share-error">{shareError}</p>}
        <p className="export-hint">
          <strong>Shareable link</strong> (above): send the link to your client — they open it in a browser and see the previews with playable video. Or <strong>export as HTML</strong> and upload to Google Drive, Dropbox, or Netlify Drop.
        </p>
        <div className="previews-section export-area" ref={exportRef}>
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
                  copy={copy}
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
                  copy={copy}
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
      </section>
    </div>
  )
}

export default App
