import { Promise } from 'bluebird'
import * as THREE from 'three'
import sh from './sh'

const SHOrder = 2
let ctx = null
const posMap = {
  posx: {
    x: 3,
    y: 1
  },
  negx: {
    x: 1,
    y: 1,
  },
  negy: {
    x: 1,
    y: 2,
  },
  posy: {
    x: 1,
    y: 0,
  },
  negz: {
    x: 0,
    y: 1,
  },
  posz: {
    x: 2,
    y:1
  }
}
export default class CubeToSH {
  constructor(cb) {
    const cubemap = document.querySelector("#cubemap")
    cubemap.width = 128*4
    cubemap.height = 128*3
    ctx = cubemap.getContext("2d")
    const path = "CornellBox"
    this.cb = cb
    this.urls = [{
      url: `./${path}/negx.jpg`,
      name: "negx"
      },
      {
        url: `./${path}/posx.jpg`,
      name: "posx"

      },
       {
         url: `./${path}/negy.jpg`,
      name: "negy"

       },
      {
        url: `./${path}/posy.jpg`,
      name: "posy"

      },
      {
        url: `./${path}/negz.jpg`,
      name: "negz"

      },
      {
        url: `./${path}/posz.jpg`,
      name: "posz"

      },
    ]
    this.getAllImage()
  }

  async getAllImage() {
    const w = 128
    const images = []
    for (let i = 0; i < this.urls.length; i++) {
      const { url, name } = this.urls[i]
      images[i] = await this.getImage(url, name)
      const { x, y } = posMap[name]
      const posX = w * x;
      const posY = w * y;
      ctx.putImageData(images[i], posX, posY)
      ctx.font = "18px bold 黑体";
      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(name, posX+w/2, posY+w/2);
    }
    // ctx.putImageData(images[3], w*1, 0)
    // ctx.putImageData(images[4], w*0, w*1)
    // ctx.putImageData(images[0], w*1, w*1)
    // ctx.putImageData(images[5], w*2, w*1)
    // ctx.putImageData(images[1], w*3, w*1)
    // ctx.putImageData(images[2], w*1, w*2)
    this.PrecomputeCubemapSH(images, w, w)
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
          for (let l = 0; l <= SHOrder; l += 1) {
            for (let m = -l; m <= l; m += 1) {
              let k = sh.GetIndex(l, m);
              const basisFunc = sh.EvalSH(l, m, dir);

              // 对于 cubemap 中的每一处光线，
              // 都去累加它们把灯光 Le，
              // 以 wOmege面积投影在 basisFunc 上的系数
              // 得到的结果一系列近似了环境光球面的 SH 系数
              SHCoeffiecents[k][0] += Le[0] * wOmege * basisFunc;
              SHCoeffiecents[k][1] += Le[1] * wOmege * basisFunc;
              SHCoeffiecents[k][2] += Le[2] * wOmege * basisFunc;
            }
          }
        }
      }
    }

    let ret = ""
    SHCoeffiecents.forEach(item => {
      ret += `${item[0].toFixed(6)}, ${item[1].toFixed(6)},${item[2].toFixed(6)},`
      ret += `
      `
    })
    // console.error(ret);
    document.querySelector("#sh").innerText = ret

    let arr = []
    SHCoeffiecents.forEach(item => {
      arr.push(...item)
    })
    // console.error(arr);
    this.cb && this.cb(arr)

  }
}

