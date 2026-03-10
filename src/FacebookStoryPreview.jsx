import './FacebookStoryPreview.css'

function isVideoUrl(url) {
  return url && typeof url === 'string' && url.startsWith('data:video/')
}

export default function FacebookStoryPreview({ pageName, imageUrl, cta = 'Learn more', avatarUrl }) {
  const displayPageName = pageName?.trim() || 'Your Page Name'
  return (
    <div className="fb-story-preview">
      <div className="fb-story-frame">
        {imageUrl ? (
          isVideoUrl(imageUrl) ? (
            <video src={imageUrl} className="fb-story-image" autoPlay loop muted playsInline />
          ) : (
            <img src={imageUrl} alt="Story creative" className="fb-story-image" />
          )
        ) : (
          <div className="fb-story-placeholder">
            <span>9:16 image</span>
            <span className="fb-story-specs">1080×1920</span>
          </div>
        )}
        <div className="fb-story-overlay">
          <div className="fb-story-header">
            <div className="fb-story-avatar">
              {avatarUrl ? <img src={avatarUrl} alt="" className="fb-story-avatar-img" /> : null}
            </div>
            <span className="fb-story-page-name">{displayPageName}</span>
            <span className="fb-story-sponsored">Sponsored</span>
          </div>
        </div>
        <div className="fb-story-cta">
          <span className="fb-story-cta-text">{cta}</span>
        </div>
      </div>
    </div>
  )
}
