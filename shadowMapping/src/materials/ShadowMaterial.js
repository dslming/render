import Material from './Material'
import fragmentShader from '../shader/shadowFragment.glsl'
import vertexShader from '../shader/shadowVertex.glsl'
export default class ShadowMaterial extends Material {
    constructor(light, translate, scale) {
        let lightMVP = light.CalcLightMVP(translate, scale);

        super({
            'uLightMVP': { type: 'matrix4fv', value: lightMVP }
        }, [], vertexShader, fragmentShader, light.fbo);

        // debug 直接输出光源处看到的深度信息
        // super({
        //           'uLightMVP': { type: 'matrix4fv', value: lightMVP }
        //       }, [], vertexShader, fragmentShader);
    }
}
