import Shader from '../webgl/Shader'
// 抽象的着色器
export default class Material {
    // Uniforms is a map, attribs is a Array
    constructor({uniforms, vsSrc, fsSrc, frameBuffer}) {
        this.uniforms = uniforms;
        this.vsSrc = vsSrc;
        this.fsSrc = fsSrc;

        this.flatten_uniforms = ['uViewMatrix','uModelMatrix', 'uProjectionMatrix', 'uCameraPos', 'uLightPos'];
        for (let k in uniforms) {
            this.flatten_uniforms.push(k);
        }
        this.flatten_attribs = [];

        this.frameBuffer = frameBuffer;
    }

    setMeshAttribs(extraAttribs) {
        for (let i = 0; i < extraAttribs.length; i++) {
            this.flatten_attribs.push(extraAttribs[i]);
        }
    }

    compile(gl) {
        return new Shader(gl, this.vsSrc, this.fsSrc,
            {
                uniforms: this.flatten_uniforms,
                attribs: this.flatten_attribs
            });
    }
}
