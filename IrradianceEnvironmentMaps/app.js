import Stage from 'three_stage'
import * as THREE from 'three'
import CubeToSH from './CubeToSH'
// import sh from 'cubemap-sh'
import TTT from './SHTo'

class App {
  constructor() {
    this.stage = new Stage("#app")
    this.stage.run()
    this.stage.camera.position.z = 10
    // this.addSphere(10)
    let sh = new TTT();

    var cb = ret => {
      sh.setSh(ret)
    }
    let s = new CubeToSH(cb)
    // this.sh()
    this.stage.scene.add(sh.mesh)
  }

  getImage(url, name) {
    return new Promise((resolve, rejuct) => {
      let loader = new THREE.TextureLoader()
      var canvas = document.createElement('canvas');
      //  var canvas = document.querySelector("#debug")
      const ctx = canvas.getContext("2d")
      loader.load(url, res => {
        const img = res.image
        const { width, height } = img
        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)
        const imageData = ctx.getImageData(0, 0, width, height)
        resolve(imageData.data)
      }, err => {
        rejuct(err)
      })
    })
  }

  async sh() {
    const path = "CornellBox"
    this.urls = [
       {
         url: `./${path}/posx.jpg`,
      },
      {
         url: `./${path}/negx.jpg`,
      },
        {
          url: `./${path}/posy.jpg`,
        },
       {
         url: `./${path}/negy.jpg`,
      },
         {
           url: `./${path}/posz.jpg`,
         },
       {
         url: `./${path}/negz.jpg`,
       },

    ]
    const images = []
    for (let i = 0; i < this.urls.length; i++) {
      const { url, name } = this.urls[i]
      images[i] = await this.getImage(url, name)
    }

     const CUBE_MAP_SIZE = 128
     const NUM_CHANNELS = 4
    const coefficients = sh(images, CUBE_MAP_SIZE, NUM_CHANNELS)

    let ret = ""
      coefficients.forEach(item => {
        ret += `${item[0].toFixed(6)}, ${item[1].toFixed(6)},${item[2].toFixed(6)},`
        ret += `
      `
      })
      console.error(ret);
  }
  // addBox(size) {
  //   var geometry = new THREE.SphereBufferGeometry(size, size, size);
  //   var material = new THREE.MeshPhongMaterial({
  //     color: 0x63e42a,
  //     emissive: 0x072534,
  //     side: THREE.DoubleSide,
  //     shading: THREE.FlatShading
  //   })
  //   var cube = new THREE.Mesh(geometry, material);
  //   cube.name = "test_cube"
  //   this.stage.scene.add(cube)
  //     this.stage.onUpdate(() => {
  //   })
  // }

  addSphere(size) {
    var geometry = new THREE.SphereBufferGeometry(size, 64, 64); //立方体

    var loader = new THREE.CubeTextureLoader();
    // 所有贴图在同一目录下，可以使用该方法设置共用路径
    loader.setPath('Indoor/');
    // 立方体纹理加载器返回立方体纹理对象CubeTexture
    var CubeTexture = loader.load(['posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg']);
    //材质对象Material
    var material = new THREE.MeshPhongMaterial({
      //网格模型设置颜色，网格模型颜色和环境贴图会进行融合计算
      // color:0xff0000,
      envMap: CubeTexture, //设置环境贴图
      // 环境贴图反射率   控制环境贴图对被渲染三维模型影响程度
      // reflectivity: 0.1,
    });
    console.log(CubeTexture.image);
    var mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
    this.stage.scene.add(mesh); //网格模型添加到场景中
  }
}

window.onload = () => {
  let app = new App()
}
