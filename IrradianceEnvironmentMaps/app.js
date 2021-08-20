import Stage from 'three_stage'
import * as THREE from 'three'
import CubeToSH from './CubeToSH'
// import sh from 'cubemap-sh'
import SHTo from './SHTo'
import Transport from './Transprt'
import Run from './run'

class App {
  constructor() {
    this.stage = new Stage("#app")
    this.stage.run()
    this.stage.camera.position.z = 20
    this.stage.camera.position.near = 1
    this.stage.camera.position.far = 10000
    this.init()
  }

  async init() {
    const shLight = new CubeToSH()
    shLight.visible((skybox) => {
      this.stage.scene.add(skybox)
    })
    const light = await shLight.getSHCoeffiecents()


    // console.error(light);

    const shTrans = new Transport()
    const trans = await shTrans.getTrans()

    const run = new Run()
    run.setLight(light)
    run.setTrans(trans)
    const mesh = await run.getMesh()
    mesh.name = "123"
    console.error(mesh);

    this.stage.scene.add(mesh)
  }
}

window.onload = () => {
  let app = new App()

}
