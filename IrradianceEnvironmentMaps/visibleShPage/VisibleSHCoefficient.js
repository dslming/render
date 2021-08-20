import vs from '../shader/SHVertex.glsl'
import fs from '../shader/SHFragment.glsl'
import * as THREE from 'three'
import { SHEval3 } from '../sh'


/**
 * 用单位球可视化,sh系数
 */
export default class VisibleSHCoefficient {
  constructor() {
    const radius = 1
    var currsh = Array(9 * 3).fill(0);
    const dshcoef = SHEval3(radius, radius, radius);

    var diffusematerial = new THREE.ShaderMaterial({
      uniforms: {
        sh: { type: "fv", value: currsh },
        shc: { type: "fv1", value: dshcoef },
      },
      vertexShader: vs,
      fragmentShader: fs
    });

    var geometry = new THREE.SphereBufferGeometry(radius, 64, 64);
    this.mesh = new THREE.Mesh(geometry, diffusematerial);
    this.material = diffusematerial
  }

  getMesh() {
    return this.mesh
  }

  setSh(v) {
    let arr = []
    v.forEach(item => {
      arr.push(...item)
    })
    this.material.uniforms.sh.value = arr
  }
}
