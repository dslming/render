import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import * as THREE from 'three'
import vShaderStr from './shader/prtVertex.glsl'
import fShaderStr from './shader/prtFragment.glsl'


function getRotationPrecomputeL(precompute_L, rotationMatrix) {
  let rotMatBand1 = computeSquareMatrix_3by3(rotationMatrix);
  let rotMatBand2 = computeSquareMatrix_5by5(rotationMatrix);

  let result = [];

  for (let i = 0; i < 3; i++) {
    let rotSHBand1 = math.multiply(rotMatBand1, [precompute_L[i][1], precompute_L[i][2], precompute_L[i][3]]);
    let rotSHBand2 = math.multiply(rotMatBand2, [precompute_L[i][4], precompute_L[i][5], precompute_L[i][6],
      precompute_L[i][7], precompute_L[i][8]
    ]);

    result[i] = mat3.fromValues(precompute_L[i][0], rotSHBand1._data[0], rotSHBand1._data[1],
      rotSHBand1._data[2], rotSHBand2._data[0], rotSHBand2._data[1],
      rotSHBand2._data[2], rotSHBand2._data[3], rotSHBand2._data[4]);
  }
  return result;
}

function getMat3ValueFromRGB(precomputeL) {
  let colorMat3 = [];
  for (var i = 0; i < 3; i++) {
    colorMat3[i] = mat3.fromValues(precomputeL[0][i], precomputeL[1][i], precomputeL[2][i],
      precomputeL[3][i], precomputeL[4][i], precomputeL[5][i],
      precomputeL[6][i], precomputeL[7][i], precomputeL[8][i]);
  }
  return colorMat3;
}


var ALBEDO = new Array(2);
ALBEDO[0] = new THREE.Vector3(1, 1, 1);
// ALBEDO[1] = new THREE.Vector3(1, 1, 1);
const N_COEFFS = 9

export default class Run {
  constructor() {
  }

  getMesh() {
    let cameraModelMatrix = mat4.clone();
    // cameraModelMatrix.fromRotation(cameraModelMatrix, 0, [0, 1, 0]);
    const RGBMat3 = getMat3ValueFromRGB(this.L)
    let precomputeL_RGBMat3 = getRotationPrecomputeL(RGBMat3, cameraModelMatrix);

    var basicShader = new THREE.ShaderMaterial({
      uniforms: {
        'uPrecomputeLR': { type: 'f', value: precomputeL_RGBMat3[0] },
        'uPrecomputeLG': { type: 'f', value: precomputeL_RGBMat3[1] },
        'uPrecomputeLB': { type: 'f', value: precomputeL_RGBMat3[2] },
      },
      vertexShader: vShaderStr,
      fragmentShader: fShaderStr
    });

     return new Promise((resolve, reject) => {
       let loader = new OBJLoader()
       loader.load("./assets/teapot.obj", obj => {
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
    this.G = v[0]
  }

  render(objects) {
    for (var j = 0; j < objects.length; j++) {
      var obj = objects[j];
      obj.geometry.addAttribute("aPrecomputeLT", new THREE.BufferAttribute(this.G[0], 3));
      verts.needsUpdate = true;
    }
  }
}
