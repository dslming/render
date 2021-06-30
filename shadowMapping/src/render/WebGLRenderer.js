// 自定义渲染器, 不使用three.js render
import MeshRender from '../render/MeshRender'

export default class WebGLRenderer {
  constructor(gl, camera) {
    this.meshes = [];
    this.shadowMeshes = [];
    this.lights = [];
    this.gl = gl;
    this.camera = camera;
  }

  addLight(light) {
    this.lights.push({
      entity: light,
      meshRender: new MeshRender(this.gl, light.mesh, light.mat)
    });
  }

  addMeshRender(mesh) {
    this.meshes.push(mesh);
  }

  addShadowMeshRender(mesh) {
    this.shadowMeshes.push(mesh);
  }

  render() {
    const gl = this.gl;

    // Clear to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear everything
    gl.clearDepth(1.0);
    // Enable depth testing
    gl.enable(gl.DEPTH_TEST);
    // Near things obscure far things
    gl.depthFunc(gl.LEQUAL);

    console.assert(this.lights.length != 0, "No light");
    console.assert(this.lights.length == 1, "Multiple lights");

    for (let l = 0; l < this.lights.length; l++) {
      // 光源 cube 几何体
      this.lights[l].meshRender.mesh.transform.translate = this.lights[l].entity.lightPos;
      this.lights[l].meshRender.draw(this.camera);

      // Shadow pass
      if (this.lights[l].entity.hasShadowMap == true) {
        for (let i = 0; i < this.shadowMeshes.length; i++) {
          this.shadowMeshes[i].draw(this.camera);
        }
      }

      // Camera pass
      for (let i = 0; i < this.meshes.length; i++) {
        this.gl.useProgram(this.meshes[i].shader.program.glShaderProgram);
        // 设置参数
        this.gl.uniform3fv(this.meshes[i].shader.program.uniforms.uLightPos, this.lights[l].entity.lightPos);
        this.meshes[i].draw(this.camera);
      }
    }
  }
}
