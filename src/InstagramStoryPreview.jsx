import './InstagramStoryPreview.css'

function isVideoUrl(url) {
  return url && typeof url === 'string' && url.startsWith('data:video/')
}

export default function InstagramStoryPreview({ username, imageUrl, cta = 'Learn more', avatarUrl }) {
  const displayUsername = username?.trim() ? (username.startsWith('@') ? username : `@${username}`) : 'your_username'
  return (
    <div className="ig-story-preview">
      <div className="ig-story-frame">
        {imageUrl ? (
          isVideoUrl(imageUrl) ? (
            <video src={imageUrl} className="ig-story-image" autoPlay loop muted playsInline />
          ) : (
            <img src={imageUrl} alt="Story creative" className="ig-story-image" />
          )
        ) : (
          <div className="ig-story-placeholder">
            <span>9:16 image</span>
            <span className="ig-story-specs">1080×1920</span>
          </div>
        )}
        <div className="ig-story-overlay">
          <div className="ig-story-header">
            <div className="ig-story-avatar">
              {avatarUrl ? <img src={avatarUrl} alt="" className="ig-story-avatar-img" /> : null}
            </div>
            <span className="ig-story-username">{displayUsername}</span>
            <span className="ig-story-sponsored">Sponsored</span>
          </div>
        </div>
        <div className="ig-story-cta">
          <span className="ig-story-cta-text">{cta}</span>
        </div>
      </div>
    </div>
  )
}
