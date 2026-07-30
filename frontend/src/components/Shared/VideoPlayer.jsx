import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Maximize, Minimize, Volume2, VolumeX, ExternalLink, AlertCircle } from 'lucide-react'

/**
 * VideoPlayer Component
 * Supports: YouTube, Google Drive, direct MP4/WebM URLs
 * 
 * YouTube: Converts to embed player
 * Google Drive: Converts to direct embed
 * Direct video: Uses HTML5 video element
 */
const VideoPlayer = ({ videoUrl, videoTitle, onEnded }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [error, setError] = useState(null)
  const [playerType, setPlayerType] = useState('unknown')
  const [embedUrl, setEmbedUrl] = useState('')
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const playerRef = useRef(null)

  useEffect(() => {
    if (!videoUrl) {
      setError('No video URL provided')
      return
    }

    setError(null)
    setIsPlaying(false)
    setProgress(0)
    setCurrentTime(0)

    // Detect video type and generate embed URL
    const type = detectVideoType(videoUrl)
    setPlayerType(type)

    switch (type) {
      case 'youtube':
        setEmbedUrl(getYouTubeEmbedUrl(videoUrl))
        break
      case 'googledrive':
        setEmbedUrl(getGoogleDriveEmbedUrl(videoUrl))
        break
      case 'direct':
        setEmbedUrl(videoUrl)
        break
      default:
        setError('Unsupported video URL format')
    }
  }, [videoUrl])

  const detectVideoType = (url) => {
    if (!url) return 'unknown'
    
    // YouTube patterns
    if (
      url.includes('youtube.com/watch') ||
      url.includes('youtu.be/') ||
      url.includes('youtube.com/embed') ||
      url.includes('youtube.com/v/')
    ) {
      return 'youtube'
    }
    
    // Google Drive patterns
    if (
      url.includes('drive.google.com') ||
      url.includes('docs.google.com')
    ) {
      return 'googledrive'
    }
    
    // Direct video file patterns
    if (
      url.match(/\.(mp4|webm|ogg|mov|avi|mkv)(\?.*)?$/i) ||
      url.includes('video') ||
      url.includes('stream') ||
      url.includes('media')
    ) {
      return 'direct'
    }
    
    // Default: try as direct video
    return 'direct'
  }

  const getYouTubeEmbedUrl = (url) => {
    let videoId = ''
    
    // youtube.com/watch?v=VIDEO_ID
    const match = url.match(/[?&]v=([^&]+)/)
    if (match) videoId = match[1]
    
    // youtu.be/VIDEO_ID
    if (!videoId) {
      const shortMatch = url.match(/youtu\.be\/([^?&]+)/)
      if (shortMatch) videoId = shortMatch[1]
    }
    
    // youtube.com/embed/VIDEO_ID
    if (!videoId) {
      const embedMatch = url.match(/youtube\.com\/embed\/([^?&]+)/)
      if (embedMatch) videoId = embedMatch[1]
    }
    
    if (!videoId) return url
    
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
  }

  const getGoogleDriveEmbedUrl = (url) => {
    // Extract file ID from Google Drive URL
    // Format: https://drive.google.com/file/d/FILE_ID/view
    const match = url.match(/\/file\/d\/([^/]+)/)
    if (match) {
      const fileId = match[1]
      return `https://drive.google.com/file/d/${fileId}/preview`
    }
    
    // Already an embed URL
    if (url.includes('/preview')) return url
    
    return url
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime
      const dur = videoRef.current.duration || 0
      setCurrentTime(current)
      setDuration(dur)
      if (dur > 0) {
        setProgress((current / dur) * 100)
      }
    }
  }

  const handleVideoEnded = () => {
    setIsPlaying(false)
    setProgress(100)
    if (onEnded) onEnded()
  }

  const togglePlay = () => {
    if (playerType === 'youtube' || playerType === 'googledrive') {
      // For embedded players, we can't control play/pause directly
      return
    }
    
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play().catch(err => {
          setError('Failed to play video: ' + err.message)
        })
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error('Fullscreen error:', err)
      })
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleProgressClick = (e) => {
    if (playerType !== 'direct' || !videoRef.current) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percent = x / rect.width
    const newTime = percent * duration
    
    videoRef.current.currentTime = newTime
    setProgress(percent * 100)
  }

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Render embedded player (YouTube / Google Drive)
  const renderEmbeddedPlayer = () => (
    <div className="relative w-full h-full">
      <iframe
        src={embedUrl}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={videoTitle || 'Video'}
      />
    </div>
  )

  // Render direct video player
  const renderDirectPlayer = () => (
    <>
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        src={embedUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnded}
        onError={() => setError('Failed to load video')}
        onClick={togglePlay}
        preload="metadata"
        playsInline
      />
      
      {/* Custom Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
        {/* Progress Bar */}
        <div 
          className="w-full h-1.5 bg-white/30 rounded-full mb-3 cursor-pointer group"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-blue-500 rounded-full relative group-hover:h-2 transition-all"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        
        {/* Controls Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={togglePlay} className="text-white hover:text-blue-400 transition">
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <button onClick={toggleMute} className="text-white hover:text-blue-400 transition">
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <span className="text-white/80 text-xs">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          <button onClick={toggleFullscreen} className="text-white hover:text-blue-400 transition">
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </>
  )

  // Error state
  if (error) {
    return (
      <div className="bg-gray-900 rounded-xl overflow-hidden">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mb-3" />
          <p className="text-white font-medium mb-2">Video unavailable</p>
          <p className="text-gray-400 text-sm mb-4">{error}</p>
          <a 
            href={videoUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            Open in new tab
          </a>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className="relative bg-black rounded-xl overflow-hidden group"
      style={{ aspectRatio: '16/9' }}
    >
      {/* Video Title Overlay */}
      {videoTitle && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-white font-medium text-sm truncate">{videoTitle}</p>
        </div>
      )}

      {/* Player */}
      {playerType === 'youtube' || playerType === 'googledrive' 
        ? renderEmbeddedPlayer() 
        : renderDirectPlayer()
      }

      {/* External link button (always visible for embedded players) */}
      {(playerType === 'youtube' || playerType === 'googledrive') && (
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition opacity-0 group-hover:opacity-100"
          title="Open in new tab"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      )}
    </div>
  )
}

export default VideoPlayer