import Stage from 'three_stage'
import CubeMapToSHCoefficient from '../CubeMapToSHCoefficient'
import VisibleSHCoefficient from './VisibleSHCoefficient'
import HandleImage from './HandleImage'

class App {
  constructor() {
    this.stage = new Stage("#app")
    this.stage.camera.position.z = 20
    this.stage.camera.position.near = 1
    this.stage.camera.position.far = 10000
    this.init()
    var image = new HandleImage(this.changeImage)
    window.handleImage = image.handleImage
    this.stage.run()
  }

  changeImage(param) {
    const { images, ursl } = param
    this.shLight.PrecomputeCubemapSH()
  }

  async init() {
    const shLight = new CubeMapToSHCoefficient()
    shLight.visible((skybox) => {
      // this.stage.scene.add(skybox)
    })

    // 生成球谐系数
    const coeffiecents = await shLight.getSHCoeffiecents()
    // 可视化系数
    let sh = new VisibleSHCoefficient()
    sh.setSh(coeffiecents)
    this.stage.scene.add(sh.getMesh())



    this.shLight = shLight
  }

  setDomRet(coeffiecents) {
      let str = ""
      coeffiecents.forEach(item => {
        str += `${item[0].toFixed(3)}, ${item[1].toFixed(3)},${item[2].toFixed(3)},`
        str += `
      `
      })
      document.querySelector("#sh").innerText = str
  }
}

window.onload = () => {
  let app = new App()
}
