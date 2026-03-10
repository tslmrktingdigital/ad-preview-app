import './InstagramAdPreview.css'

function isVideoUrl(url) {
  return url && typeof url === 'string' && url.startsWith('data:video/')
}

export default function InstagramAdPreview({ username, copy, headline, websiteUrl, imageUrl, cta = 'Learn More', avatarUrl }) {
  const displayUsername = username?.trim() ? (username.startsWith('@') ? username : `@${username}`) : 'your_username'
  const captionUsername = username?.trim() ? (username.startsWith('@') ? username.slice(1) : username) : 'your_username'
  return (
    <div className="instagram-preview">
      <div className="ig-header">
        <div className="ig-avatar">
          {avatarUrl ? <img src={avatarUrl} alt="" className="ig-avatar-img" /> : null}
        </div>
        <div className="ig-meta">
          <span className="ig-username">{displayUsername}</span>
          <span className="ig-sponsored">Sponsored</span>
        </div>
        <button type="button" className="ig-more" aria-label="More options">
          ⋯
        </button>
      </div>

      <div className="ig-image-wrap">
        {imageUrl ? (
          isVideoUrl(imageUrl) ? (
            <video src={imageUrl} className="ig-image" autoPlay loop muted playsInline />
          ) : (
            <img src={imageUrl} alt="Ad creative" className="ig-image" />
          )
        ) : (
          <div className="ig-image-placeholder">
            <span>Image</span>
          </div>
        )}
      </div>

      <div className="ig-cta-below-image">
        <button type="button" className="ig-cta-btn">{cta}</button>
      </div>

      <div className="ig-actions">
        <div className="ig-action-row">
          <span className="ig-icon ig-heart" aria-hidden />
          <span className="ig-icon ig-comment" aria-hidden />
          <span className="ig-icon ig-share" aria-hidden />
          <span className="ig-icon ig-bookmark" aria-hidden />
        </div>
      </div>

      <div className="ig-caption-wrap">
        {copy ? (
          <p className="ig-caption">
            <span className="ig-caption-username">{captionUsername}</span>{' '}
            {copy.length > 125 ? `${copy.slice(0, 125)}...` : copy}
            {copy.length > 125 && <span className="ig-more-text"> more</span>}
          </p>
        ) : (
          <p className="ig-caption placeholder">
            <span className="ig-caption-username">{captionUsername}</span> Your caption will appear here.
          </p>
        )}
      </div>

    </div>
  )
}
