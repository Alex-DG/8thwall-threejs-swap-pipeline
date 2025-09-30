import { RecordVideo } from '../classes/RecordVideo'

export const initFrontCameraPipelineModule = () => {
  const init = () => {
    RecordVideo.showRecordUI()

    console.log('✨', 'World ready - Front')
  }

  const show = (event) => {}

  const hide = (event) => {}

  // Clean up function for pipeline module switching
  const cleanup = () => {}

  return {
    name: 'facescene',

    // Cleanup function for pipeline switching
    cleanup: cleanup,

    onDetach: () => {
      cleanup()
    },

    listeners: [
      { event: 'facecontroller.faceloading', process: init },
      { event: 'facecontroller.facefound', process: show },
      { event: 'facecontroller.faceupdated', process: show },
      { event: 'facecontroller.facelost', process: hide },
    ],
  }
}
