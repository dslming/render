import Material from './Material'
const ShadowVertex = require('../shader/ShadowVertex.glsl');
const ShadowFragment = require('../shader/ShadowFragment.glsl');

export default class ShadowMaterial extends Material {
    constructor(light, translate, scale) {
        let lightMVP = light.CalcLightMVP(translate, scale);

        super({
            uniforms:{
              'uLightMVP': { type: 'matrix4fv', value: lightMVP }
            },
            vsSrc: ShadowVertex,
            fsSrc: ShadowFragment,
            frameBuffer: light.fbo
        });

        // debug 直接输出光源处看到的深度信息
        // super({
        //           'uLightMVP': { type: 'matrix4fv', value: lightMVP }
        //       }, [], vertexShader, fragmentShader);
    }
}
