import Material from './Material'
import LightCubeVertex from '../shader/LightCubeVertex.glsl'
import LightCubeFragment from '../shader/LightCubeFragment.glsl'
// 光照
export default class EmissiveMaterial extends Material {
  constructor(lightIntensity, lightColor) {
    super({
      uniforms:{
        'uLigIntensity': { type: '1f', value: lightIntensity },
        'uLightColor': { type: '3fv', value: lightColor }
      },
      vsSrc: LightCubeVertex,
      fsSrc: LightCubeFragment,
      frameBuffer: null
    });

    this.intensity = lightIntensity;
    this.color = lightColor;
  }

  GetIntensity() {
    return [this.intensity * this.color[0], this.intensity * this.color[1], this.intensity * this.color[2]]
  }
}

