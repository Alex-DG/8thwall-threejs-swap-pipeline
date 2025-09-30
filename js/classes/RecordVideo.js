// Doc: https://www.8thwall.com/docs/legacy/api/mediarecorder/recordvideo/

const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
}

class _RecordVideo {
  init() {
    if (this.isInitialized) {
      console.warn('RecordVideo already initialized')
      return
    }

    this.recordBtn = null
    this.isInitialized = false

    this.startRecording = this.startRecording.bind(this)
    this.retryRecording = this.retryRecording.bind(this)
    this.goNext = this.goNext.bind(this)

    this.isRecording = false
    this.result = null

    // Prevent double initialization

    this.videoTaken = document.getElementById('video-taken')

    this.previewContainer = document.querySelector('.video-preview-container')
    this.recordContainer = document.querySelector('.video-record-container')

    this.recordBtn = document.getElementById('record-video-btn')
    this.retryBtn = document.getElementById('retry-btn')
    this.nextBtn = document.getElementById('next-btn')

    if (!this.recordBtn) {
      console.error('Record button not found')
      return
    }

    this.recordBtn.addEventListener('click', this.startRecording)
    this.nextBtn.addEventListener('click', this.goNext)
    this.retryBtn.addEventListener('click', this.retryRecording)

    this.isInitialized = true
  }

  // UI ----

  showRecordUI() {
    if (!this.recordContainer) return
    this.recordContainer.style.display = 'flex'
    setTimeout(() => {
      this.recordContainer.style.opacity = 1
    })
  }
  hideRecordUI() {
    if (!this.recordContainer) return

    this.recordContainer.style.opacity = 0
    setTimeout(() => {
      this.recordContainer.style.display = 'none'
    }, 250)
  }

  showPreviewUI() {
    if (!this.previewContainer) return
    this.previewContainer.style.display = 'flex'
    setTimeout(() => {
      this.previewContainer.style.opacity = 1
    }, 500) // Hide record ui + show preview ui
  }
  hidePreviewUI() {
    if (!this.previewContainer) return

    this.previewContainer.style.opacity = 0
    setTimeout(() => {
      this.previewContainer.style.display = 'none'
    }, 250)
  }

  // Recording Video ----

  startRecording() {
    if (this.isRecording) {
      this.isRecording = false

      XR8.MediaRecorder.stopRecording()
      return
    }

    const handleVideoReady = (result) => {
      this.result = result

      // Populate the video element with the recorded video blob
      if (result.videoBlob && this.videoTaken) {
        const videoURL = URL.createObjectURL(result.videoBlob)
        this.videoTaken.src = videoURL
        this.videoTaken.load()

        this.hideRecordUI()
        this.showPreviewUI()
      }
    }

    XR8.MediaRecorder.recordVideo({
      // Android - Callback when a previewable, but not sharing-optimized, video is ready (Android/Desktop only).
      onPreviewReady: (result) => {
        console.log('Android - Recording complete', { result })

        handleVideoReady(result)
      },

      // iOS - Callback when recording has completed and video is ready.
      onVideoReady: (result) => {
        console.log('iOS - Recording complete', { result })

        if (isIOS) handleVideoReady(result)
      },

      // Callback when recording has started.
      onStart: () => {
        this.isRecording = true
        this.recordBtn.classList.add('recording')
        console.log('Recording has started')
      },

      // Callback when recording has stopped.
      onStop: () => {
        this.recordBtn.classList.remove('recording')
        console.log('Recording has stopped')
      },

      // Callback when there is an error
      onError: (data) => {
        console.log('Recording error', { data })
      },
    })
  }

  getVideoObjUrl() {
    if (!this.result?.videoBlob) {
      console.error('Error: no video blob')
      return
    }

    const videoURL = URL.createObjectURL(this.result.videoBlob)
    return videoURL
  }

  retryRecording() {
    this.hidePreviewUI()
    setTimeout(() => {
      this.result = null
      this.showRecordUI()
    }, 250) // Hide preview UI
  }

  goNext() {
    this.hidePreviewUI()
    window.dispatchEvent(new CustomEvent('swap:scene'))
  }
}

const RecordVideo = new _RecordVideo()
export { RecordVideo }
