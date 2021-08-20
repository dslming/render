import { Promise } from 'bluebird'
import * as THREE from 'three'
import { SHEval3 } from './sh'
import skyFrag from './shader/SkyBoxFragment.glsl'
import skyVert from './shader/SkyBoxVertex.glsl'


const SHOrder = 2

/**
 * 立方体贴图转3阶段球谐函数系数
 */
export default class CubeMapToSHCoefficient {
  constructor() {
    const path = "CornellBox"
    this.urls = [
      {
        url: `./${path}/posx.jpg`,
        name: "posx"

      },
      {
      url: `./${path}/negx.jpg`,
      name: "negx"
      },

       {
         url: `./${path}/posy.jpg`,
         name: "posy"

       },
       {
         url: `./${path}/negy.jpg`,
      name: "negy"

       },
      {
        url: `./${path}/posz.jpg`,
        name: "posz"

      },
      {
        url: `./${path}/negz.jpg`,
      name: "negz"

      },

    ]
  }

  async getSHCoeffiecents() {
    const w = 128
    const images = []
    for (let i = 0; i < this.urls.length; i++) {
      const { url, name } = this.urls[i]
      images[i] = await this.getImage(url, name)
    }
    return this.PrecomputeCubemapSH(images, w, w)
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
        imageData.name = name
        resolve(imageData)
      }, err => {
        rejuct(err)
      })
    })
  }

  CalcPreArea(x, y) {
    return Math.atan2(x * y, Math.sqrt(x * x + y * y + 1.0));
  }

  // 计算立体角
  CalcArea(x, y, width, height) {
    const u = (2.0 * (x + 0.5) / width) - 1.0;
    const v = (2.0 * (y + 0.5) / height) - 1.0;
    const invResolutionW = 1.0 / width;
    const invResolutionH = 1.0 / height;

    const x0 = u - invResolutionW;
    const y0 = v - invResolutionH;
    const x1 = u + invResolutionW;
    const y1 = v + invResolutionH;
    const angle =
      this.CalcPreArea(x0, y0) -
      this.CalcPreArea(x0, y1) -
      this.CalcPreArea(x1, y0) +
      this.CalcPreArea(x1, y1);
    return angle
  }

  PrecomputeCubemapSH(images, width, height) {
    const CUBE_FACE_COUNT = 6
    const SHCoeffiecents = []
    const channel = 4

    const cubemapFaceDirections = [
       [
         [0, 0, -1],
         [0, -1, 0],
         [1, 0, 0]
       ], // posx
       [
         [0, 0, 1],
         [0, -1, 0],
         [-1, 0, 0]
       ], // negx

       [
         [1, 0, 0],
         [0, 0, 1],
         [0, 1, 0]
       ], // posy
       [
         [1, 0, 0],
         [0, 0, -1],
         [0, -1, 0]
       ], // negy

       [
         [1, 0, 0],
         [0, -1, 0],
         [0, 0, 1]
       ], // posz
       [
         [-1, 0, 0],
         [0, -1, 0],
         [0, 0, -1]
      ] // negz
    ]
    const cubemapDirs = []
    for (let i = 0; i < CUBE_FACE_COUNT; i++) {
      const faceDirX = cubemapFaceDirections[i][0];
      const faceDirY = cubemapFaceDirections[i][1];
      const faceDirZ = cubemapFaceDirections[i][2];
      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const u = (2.0 * x / (width - 1.0)) - 1.0
          const v = (2.0 * y / (height - 1.0)) - 1.0
          const vec3X = new THREE.Vector3(faceDirX[0], faceDirX[1], faceDirX[2])
          const vec3Y = new THREE.Vector3(faceDirY[0], faceDirY[1], faceDirY[2])
          const vec3Z = new THREE.Vector3(faceDirZ[0], faceDirZ[1], faceDirZ[2])
          vec3X.multiplyScalar(u)
          vec3Y.multiplyScalar(v)
          const dir = vec3X.add(vec3Y).add(vec3Z).normalize()
          cubemapDirs.push(dir);
        }
      }
    }

    const SHNum = (SHOrder + 1) * (SHOrder + 1);

    for (let i = 0; i < SHNum; i += 1) {
      SHCoeffiecents[i] = [
        0, 0, 0
      ]
    }

    for (let i = 0; i < CUBE_FACE_COUNT; i += 1) {
      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          // 拿到该像素的方向
          const dir = cubemapDirs[i * width * height + y * width + x];
          const index = (y * width + x) * channel;
          const Le = [
            images[i].data[index + 0] / 255,
            images[i].data[index + 1] / 255,
            images[i].data[index + 2] / 255,
          ]

          // 像素所代表的矩形区域投影到单位球面的面积
          const wOmege = this.CalcArea(x, y, width, height);

          // 投影
          const basisFunc = SHEval3(dir.x, dir.y, dir.z)
          for (let k = 0; k < 9; k++) {
              SHCoeffiecents[k][0] += Le[0] * wOmege * basisFunc[k];
              SHCoeffiecents[k][1] += Le[1] * wOmege * basisFunc[k];
              SHCoeffiecents[k][2] += Le[2] * wOmege * basisFunc[k];
          }
        }
      }
    }
    return SHCoeffiecents
  }

  visible(cb) {
    let urls = []
    this.urls.forEach(element => {
      urls.push(element.url)
    });

    let mat = new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      color:0x00ff00
    })

    new THREE.CubeTextureLoader().load(urls, t => {
      const size = 10
       var basicShader = new THREE.ShaderMaterial({
         uniforms: {
           'skybox': { value: t },
         },
         vertexShader: skyVert,
         fragmentShader: skyFrag,
         side: THREE.BackSide
       });
      let geo = new THREE.BoxBufferGeometry(size, size, size)
      const mesh = new THREE.Mesh(geo, basicShader)
      mesh.name = "skybox"
      cb(mesh)
    });
  }
}

