import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ShareableView from './ShareableView.jsx'
import './index.css'

const pathname = window.location.pathname
const viewMatch = pathname.match(/^\/view\/([^/]+)$/)
const viewId = viewMatch ? viewMatch[1] : null

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {viewId ? <ShareableView id={viewId} /> : <App />}
  </React.StrictMode>,
)
