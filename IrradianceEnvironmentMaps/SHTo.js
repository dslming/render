import vs from './shader/vs.glsl'
import fs from './shader/fs.glsl'
import * as THREE from 'three'
import { getDiffuseSHCoefficients } from './shpoly'

import * as dat from "dat.gui";
class Options {
  constructor() {
    this.exposure = 2.6
  }
};


export default class TTT {
  constructor() {
    this.settings = this.settings.bind(this)
    this.settings()

    var currsh = Array(27 * 3).fill(0);

    const dshcoef = getDiffuseSHCoefficients();
    const gammastruct = 1

    var diffusematerial = new THREE.ShaderMaterial({
      uniforms: {
        sh: { type: "fv", value: currsh },
        shc: { type: "fv1", value: dshcoef },
        exposure: { type: "f", value: this.options.exposure },
        gamma: { type: "f", value: gammastruct },
      },
      vertexShader: vs,
      fragmentShader: fs
    });

    var geometry = new THREE.SphereBufferGeometry(1, 64, 64);
    this.mesh = new THREE.Mesh(geometry, diffusematerial);
    this.material = diffusematerial
  }

  settings() {
    var options = new Options();
    this.options = options

    var gui = new dat.GUI();
    const controller = gui.add(options, 'exposure', 1, 7,0.1);

    controller.onChange(value => {
      this.material && (this.material.uniforms.exposure.value = +value)
    })
  }

  setSh(v) {
    this.material.uniforms.sh.value = v
  }
}
