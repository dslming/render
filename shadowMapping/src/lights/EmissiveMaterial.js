import Material from '../materials/Material'
const LightCubeVertex = require('../shader/LightCubeVertex.glsl');
const LightCubeFragment = require('../shader/LightCubeFragment.glsl');

// 光照
export default class EmissiveMaterial extends Material {
  constructor(lightIntensity, lightColor) {
    super({
      'uLigIntensity': { type: '1f', value: lightIntensity },
      'uLightColor': { type: '3fv', value: lightColor }
    }, [], LightCubeVertex, LightCubeFragment);

    this.intensity = lightIntensity;
    this.color = lightColor;
  }

  GetIntensity() {
    return [this.intensity * this.color[0], this.intensity * this.color[1], this.intensity * this.color[2]]
  }
}

