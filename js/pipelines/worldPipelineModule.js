import { Box } from '../classes/Box'

export const initWorldPipelineModule = () => {
  const init = () => {
    const { camera } = XR8.Threejs.xrScene()

    camera.position.set(0, 2, 3)

    Box.init()

    console.log('✨', 'World ready')
  }

  return {
    name: 'worldscene',

    onStart: () => init(),
  }
}
