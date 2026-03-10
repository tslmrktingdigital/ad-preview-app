import './FacebookAdPreview.css'

function getDisplayDomain(url) {
  if (!url?.trim()) return null
  const s = url.trim()
  try {
    const withProtocol = s.startsWith('http') ? s : `https://${s}`
    const host = new URL(withProtocol).hostname
    return host.replace(/^www\./, '')
  } catch {
    return s.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0] || null
  }
}

function isVideoUrl(url) {
  return url && typeof url === 'string' && url.startsWith('data:video/')
}

export default function FacebookAdPreview({ pageName, copy, headline, websiteUrl, cta, imageUrl, avatarUrl }) {
  const displayPageName = pageName?.trim() || 'Your Page Name'
  const displayDomain = getDisplayDomain(websiteUrl) || 'example.com'
  return (
    <div className="facebook-preview">
      <div className="fb-header">
        <div className="fb-avatar">
          {avatarUrl ? <img src={avatarUrl} alt="" className="fb-avatar-img" /> : null}
        </div>
        <div className="fb-meta">
          <span className="fb-page-name">{displayPageName}</span>
          <span className="fb-sponsored">
            <span className="fb-sponsored-dot" aria-hidden />
            Sponsored
          </span>
        </div>
        <div className="fb-header-actions">
          <button type="button" className="fb-more" aria-label="More options">
            ⋮
          </button>
        </div>
      </div>

      {copy ? (
        <div className="fb-body-text">
          {copy.length > 125 ? `${copy.slice(0, 125)}...` : copy}
          {copy.length > 125 && (
            <span className="fb-see-more"> See more</span>
          )}
        </div>
      ) : (
        <div className="fb-body-text placeholder">Your primary text will appear here.</div>
      )}

      <div className="fb-image-wrap">
        {imageUrl ? (
          isVideoUrl(imageUrl) ? (
            <video src={imageUrl} className="fb-image" autoPlay loop muted playsInline />
          ) : (
            <img src={imageUrl} alt="Ad creative" className="fb-image" />
          )
        ) : (
          <div className="fb-image-placeholder">
            <span>Image</span>
          </div>
        )}
      </div>

      {/* CTA bar: headline + domain + filled CTA button */}
      <div className="fb-cta-bar">
        <div className="fb-cta-content">
          {headline && <span className="fb-headline">{headline}</span>}
          <span className="fb-cta-domain">{displayDomain}</span>
        </div>
        <button type="button" className="fb-cta-btn">
          {cta}
        </button>
      </div>
    </div>
  )
}
