import { initFrontCameraPipelineModule } from '../pipelines/frontCameraPipelineModule'
import { initWorldPipelineModule } from '../pipelines/worldPipelineModule'

class _SwapController {
  init() {
    // Prevent double initialization
    if (this.isInitialized) {
      console.warn('SwapController already initialized')
      return
    }

    this.isFront = true
    this.isInitialized = true

    this.handleSwap = this.handleSwap.bind(this)

    window.addEventListener('swap:scene', this.handleSwap)
  }

  handleSwap() {
    XR8.stop()

    if (this.isFront) {
      this.swapToBack()
    } else {
      this.swapToFront()
    }

    this.isFront = !this.isFront
  }

  getUrlParam() {
    const urlParams = new URLSearchParams(window.location.search)
    const param = urlParams.get('param')
    return param
  }

  swapToFront() {
    XR8.removeCameraPipelineModules(['reality', 'worldscene'])
    XR8.addCameraPipelineModule(XR8.FaceController.pipelineModule())
    XR8.addCameraPipelineModule(initFrontCameraPipelineModule())

    XR8.run({
      canvas: document.getElementById('experience'),
      cameraConfig: { direction: XR8.XrConfig.camera().FRONT },
    })
  }

  swapToBack() {
    XR8.removeCameraPipelineModules(['facecontroller', 'facescene'])

    XRExtras.MediaRecorder.initRecordButton() // Adds record button
    XRExtras.MediaRecorder.initMediaPreview() // Adds media preview and share

    XR8.addCameraPipelineModule(XR8.XrController.pipelineModule())
    XR8.addCameraPipelineModule(initWorldPipelineModule())

    XR8.run({
      canvas: document.getElementById('experience'),
      cameraConfig: { direction: XR8.XrConfig.camera().BACK },
    })
  }
}
const SwapController = new _SwapController()
export { SwapController }
