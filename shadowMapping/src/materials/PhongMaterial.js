import Material from './Material'
import PhongFragment from '../shader/PhongFragment.glsl.js'
import PhongVertex from '../shader/PhongVertex.glsl'
export default class PhongMaterial extends Material {
    constructor(color, specular, light, translate, scale) {
        let lightMVP = light.CalcLightMVP(translate, scale);
        let lightIntensity = light.mat.GetIntensity();

        super({
            uniforms : {
              // Phong
              'uSampler': { type: 'texture', value: color },
              'uKs': { type: '3fv', value: specular },
              'uLightIntensity': { type: '3fv', value: lightIntensity },
              // Shadow
              'uShadowMap': { type: 'texture', value: light.fbo },
              'uLightMVP': { type: 'matrix4fv', value: lightMVP },
            },
            vsSrc: PhongVertex,
            fsSrc: PhongFragment,
            frameBuffer: null
        });
    }
}
