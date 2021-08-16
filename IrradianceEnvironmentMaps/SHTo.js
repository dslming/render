import vs from './shader/vs.glsl'
import fs from './shader/fs.glsl'
import * as THREE from 'three'
import { getDiffuseSHCoefficients } from './shpoly'

import * as dat from "dat.gui";
class Options {
  constructor() {
    this.exposure = 2
  }
};




var a = [
  1.91613, 1.71772, 1.07797,
  -0.0591127, -0.0574315, -0.0346851,
  -3.86716e-05, -2.09946e-05, -1.34999e-05,
  0.439589, -0.431271, -0.0800766,
  -0.0306302, 0.0319349, 0.00328068,
  0.0758103, 0.0710374, 0.0591078,
  0.311676, 0.269456, 0.309399,
  -4.15631e-05, 6.26804e-05, 3.12491e-05,
  -0.541544, -0.468526, -0.536088,
]


export default class TTT {
  constructor() {
    this.settings = this.settings.bind(this)
    this.settings()

    var currsh = Array(25 * 3).fill(0);
    for (var i = 0; i < 3; i++) {
      currsh[i] = 1;
    }
    currsh = a

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
}
