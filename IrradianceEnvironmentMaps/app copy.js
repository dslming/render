import { Promise } from 'bluebird'
import * as THREE from 'three'
import CanvasTool from './CanvasTool'
const M_PI = 3.1415926

const FACE_NAME = {
  CUBE_FACE_LEFT: 0, //negx
  CUBE_FACE_BOTTOM: 1,//negy
  CUBE_FACE_BACK: 2, //negz
  CUBE_FACE_RIGHT: 3, //posx
  CUBE_FACE_TOP: 4, //posy
  CUBE_FACE_FRONT: 5, //posz
}

class App {
  constructor() {
    this.urls = [
      {
        url: "./Indoor/negx.jpg",
        name: FACE_NAME.CUBE_FACE_LEFT
      },
      {
        url: "./Indoor/posx.jpg",
        name: FACE_NAME.CUBE_FACE_RIGHT
      },
      {
        url: "./Indoor/negy.jpg",
        name: FACE_NAME.CUBE_FACE_BOTTOM
      },
       {
         url: "./Indoor/posy.jpg",
         name: FACE_NAME.CUBE_FACE_TOP
       },
      {
        url: "./Indoor/negz.jpg",
        name: FACE_NAME.CUBE_FACE_BACK
      },
      {
        url: "./Indoor/posz.jpg",
        name: FACE_NAME.CUBE_FACE_FRONT
      },
    ]
    this.getAllImage()

  }

  async getAllImage() {
    const images = []
    for (let i = 0; i < this.urls.length; i++) {
      const {url,name} = this.urls[i]
      images[i] = await this.getImage(url, name)
    }
    this.PrecomputeCubemapSH(images,512, 512)
  }

  getImage(url,name) {
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
         //  const color = CanvasTool.getPixelColor(0, 0, width, imageData.data)
         resolve(imageData)
       }, err => {
         rejuct(err)
       })
     })
  }

  CalcPreArea( x,y) {
    return Math.atan2(x * y, Math.sqrt(x * x + y * y + 1.0));
  }

  // 计算立体角
  CalcArea(u, v, width, height) {
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
    const components_per_pixel = 3
    const CUBE_FACE_COUNT = 6
    const SH_COUNT = 9
    const out_channels = []
    for (let comp = 0; comp < components_per_pixel; comp+=1) {
      out_channels[comp] = {
        coeffs: new Array(SH_COUNT).fill(0)
      }
    }

    for (let face = 0; face < CUBE_FACE_COUNT; face+=1) {
      for (let y = 0; y < height; ++y) {
        for (let x = 0; x < width; ++x) {
          // center each pixel
          const px = x + 0.5;
          const py = y + 0.5;

          // normalize into [-1, 1] range
          const u = 2.0 * (px / width) - 1.0;
          const v = 2.0 * (py / height) - 1.0;

          const d_a = this.CalcArea(x, y, width, height)
          const faceame = this.urls[face].name
          const dir = this.uv_to_cube(faceame, u, v)

          const pixel_start = (x + y * width) * components_per_pixel

          for (let s = 0; s < SH_COUNT; s += 1) {
            const sh_val = this.sh_eval_9(s, dir[0], dir[1], dir[2]);
            for (let comp = 0; comp < components_per_pixel; comp+= 1) {
              let col = images[face].data[pixel_start + comp] / 255.0;
              // console.error(col);

              out_channels[comp].coeffs[s] += col * sh_val * d_a;
            }
          }
        }
      }
    }
    console.error(out_channels);

  }

  uv_to_cube(face, u, v) {
    const out_dir = []
      // 纹理贴图与法线的关系
    switch (face) {
      case FACE_NAME.CUBE_FACE_RIGHT:
        out_dir[0] = 1.0;
        out_dir[1] = v;
        out_dir[2] = -u;
        break;
      case FACE_NAME.CUBE_FACE_LEFT:
        out_dir[0] = -1.0;
        out_dir[1] = v;
        out_dir[2] = u;
        break;
      case FACE_NAME.CUBE_FACE_TOP:
        out_dir[0] = u;
        out_dir[1] = 1.0;
        out_dir[2] = -v;
        break;
      case FACE_NAME.CUBE_FACE_BOTTOM:
        out_dir[0] = u;
        out_dir[1] = -1.0;
        out_dir[2] = v;
        break;
      case FACE_NAME.CUBE_FACE_BACK:
        out_dir[0] = u;
        out_dir[1] = v;
        out_dir[2] = 1.0;
        break;
      case FACE_NAME.CUBE_FACE_FRONT:
        out_dir[0] = -u;
        out_dir[1] = v;
        out_dir[2] = -1.0;
        break;
    }

    let dir = new THREE.Vector3(out_dir[0], out_dir[1], out_dir[2]).normalize()

    return [dir.x, dir.y, dir.z]
  }

  sh_eval_9(i, x, y, z) {
    switch (i) {
      case 0:
        return 0.5 * Math.sqrt(1.0 / M_PI);
      case 1:
        return -y * 0.5 * Math.sqrt(3.0 / M_PI);
      case 2:
        return z * 0.5 * Math.sqrt(3.0 / M_PI);
      case 3:
        return -x * 0.5 * Math.sqrt(3.0 / M_PI);
      case 4:
        return x * y * 0.5 * Math.sqrt(15.0 / M_PI);
      case 5:
        return -y * z * 0.5 * Math.sqrt(15.0 / M_PI);
      case 6:
        return (3.0 * z * z - 1.0) * 0.25 * Math.sqrt(5.0 / M_PI);
      case 7:
        return -x * z * 0.5 * Math.sqrt(15.0 / M_PI);
      case 8:
        return (x * x - y * y) * 0.25 * Math.sqrt(15.0 / M_PI);
      default:
        assert(0);
        return 0;
    }
  }
}

window.onload = () => {
  let app = new App()
}
