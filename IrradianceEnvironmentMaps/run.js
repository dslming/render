import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import * as THREE from 'three'
import vShaderStr from './shader/prtVertex.glsl'
import fShaderStr from './shader/prtFragment.glsl'
import a from './data'
import global from './global'
// console.error(a);


function getMat3ValueFromRGB(precomputeL) {
  let colorMat3 = [];
  for (var i = 0; i < 3; i++) {
    colorMat3[i] = mat3.fromValues(precomputeL[0][i], precomputeL[1][i], precomputeL[2][i],
      precomputeL[3][i], precomputeL[4][i], precomputeL[5][i],
      precomputeL[6][i], precomputeL[7][i], precomputeL[8][i]);
  }
  return colorMat3;
}

// ALBEDO[1] = new THREE.Vector3(1, 1, 1);
const N_COEFFS = 9

export default class Run {
  constructor() {
    // this.L = [
    //   [1.91613, 1.71772, 1.07797],
    //   [-0.0591127, -0.0574315, -0.0346851],
    //   [-3.86716e-05, -2.09946e-05, -1.34999e-05],
    //   [0.439589, -0.431271, -0.0800766],
    //   [-0.0306302, 0.0319349, 0.00328068],
    //   [0.0758103, 0.0710374, 0.0591078],
    //   [0.311676, 0.269456, 0.309399],
    //   [-4.15631e-05, 6.26804e-05, 3.12491e-05],
    //   [-0.541544, -0.468526, -0.536088],
    // ]
    const arr = JSON.parse(a)[0]
    let g0 = []
    let g1 = []
    let g2 = []
    for (let i = 0; i < arr.length; i += 9) {
      g0.push(arr[i+0], arr[i+1], arr[i+2])
      g1.push(arr[i+3], arr[i+4], arr[i+5])
      g2.push(arr[i+6], arr[i+7], arr[i+8])
     }
    this.G0 = new Float32Array(g0)
    this.G1 = new Float32Array(g1)
    this.G2 = new Float32Array(g2)

  }

  getMesh() {

    const precomputeL_RGBMat3 = getMat3ValueFromRGB(this.L)

    var basicShader = new THREE.ShaderMaterial({
      uniforms: {
        'uPrecomputeLR': {  value: precomputeL_RGBMat3[0] },
        'uPrecomputeLG': {  value: precomputeL_RGBMat3[1] },
        'uPrecomputeLB': { value: precomputeL_RGBMat3[2] },
      },
      vertexShader: vShaderStr,
      fragmentShader: fShaderStr
    });

     return new Promise((resolve, reject) => {
       let loader = new OBJLoader()
       loader.load(global.objName, obj => {
        const model = obj.children[0]
        model.material = basicShader;
        this.render([model])
         resolve(model)
       })
     })
  }

  setLight(v) {
    this.L =v
  }

  setTrans(v) {
    const arr = v
  let g0 = []
  let g1 = []
  let g2 = []
  for (let i = 0; i < arr.length; i += 9) {
    g0.push(arr[i + 0], arr[i + 1], arr[i + 2])
    g1.push(arr[i + 3], arr[i + 4], arr[i + 5])
    g2.push(arr[i + 6], arr[i + 7], arr[i + 8])
  }
  this.G0 = new Float32Array(g0)
  this.G1 = new Float32Array(g1)
  this.G2 = new Float32Array(g2)
  }

  render(objects) {
    // console.error(this.G);
    for (var j = 0; j < objects.length; j++) {
      var obj = objects[j];

      obj.geometry.setAttribute("aPrecomputeLT0", new THREE.BufferAttribute(this.G0, 3));
      obj.geometry.setAttribute("aPrecomputeLT1", new THREE.BufferAttribute(this.G1, 3));
      obj.geometry.setAttribute("aPrecomputeLT2", new THREE.BufferAttribute(this.G2, 3));
      console.error(obj.geometry);
      // verts.needsUpdate = true;
    }
  }
}
