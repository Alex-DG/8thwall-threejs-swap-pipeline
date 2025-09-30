class _Box {
  setInstance() {
    const { scene } = XR8.Threejs.xrScene()

    this.instance = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshNormalMaterial()
    )
    this.instance.rotateY(Math.PI / 6)

    scene.add(this.instance)

    this.isInitialized = true
  }

  init() {
    if (this.isInitialized) {
      console.warn('RecordVideo already initialized')
      return
    }

    this.setInstance()
  }
}

const Box = new _Box()
export { Box }
