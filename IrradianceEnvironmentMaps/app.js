import Stage from 'three_stage'
import * as THREE from 'three'
import CubeToSH from './CubeToSH'
// import sh from 'cubemap-sh'
import SHTo from './SHTo'
import Transport from './Transprt'
class App {
  constructor() {
    this.stage = new Stage("#app")
    this.stage.run()
    this.stage.camera.position.z = 10
    // let sh = new SHTo();
    // var cb = ret => {
    //   sh.setSh(ret)
    // }
    // let s = new CubeToSH(cb)
    // this.stage.scene.add(sh.mesh)
    new Transport(obj => {
      this.stage.scene.add(obj)
    })
  }
}

window.onload = () => {
  let app = new App()
}
