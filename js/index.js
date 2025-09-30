import '../styles/index.css'

import { RecordVideo } from './classes/RecordVideo'
import { SwapController } from './classes/SwapController'
import { initFrontCameraPipelineModule } from './pipelines/frontCameraPipelineModule'

import * as THREE from 'three'

const onxrloaded = () => {
  window.THREE = THREE

  SwapController.init()
  RecordVideo.init()

  XR8.FaceController.configure({
    meshGeometry: [XR8.FaceController.MeshGeometry.MOUTH],
    coordinates: {
      mirroredDisplay: true,
      axes: 'RIGHT_HANDED',
      maxDetections: 1,
    },
  })

  XR8.addCameraPipelineModules([
    // Pipeline modules.
    XR8.GlTextureRenderer.pipelineModule(), // Draws the camera feed.
    XR8.Threejs.pipelineModule(), // Creates a ThreeJS AR Scene.

    XR8.FaceController.pipelineModule(),

    XR8.CanvasScreenshot.pipelineModule(),
    XR8.MediaRecorder.pipelineModule(),

    XRExtras.FullWindowCanvas.pipelineModule(), // Modifies the canvas to fill the window.
    XRExtras.Loading.pipelineModule(), // Manages the loading screen on startup.
    XRExtras.RuntimeError.pipelineModule(), // Shows an error image on runtime error.

    // Custom pipeline modules.
    initFrontCameraPipelineModule(),
  ])

  XR8.run({
    canvas: document.getElementById('experience'),
    cameraConfig: { direction: XR8.XrConfig.camera().FRONT },
  })

  console.log('✅', 'XR8 running')
}

window.onload = () => {
  window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
}
