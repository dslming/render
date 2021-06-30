import EmissiveMaterial from './EmissiveMaterial'
import Mesh from '../object/Mesh'
import { setTransform } from '../tool/TRSTransform'
import FBO from '../webgl/FBO'

export default class DirectionalLight {
    constructor(lightIntensity, lightColor, lightPos, focalPoint, lightUp, hasShadowMap, gl) {
        // 光源用一个立方体可视化
        this.mesh = Mesh.cube(setTransform(0, 0, 0, 0.2, 0.2, 0.2));
        this.mat = new EmissiveMaterial(lightIntensity, lightColor);

        this.lightPos = lightPos;
        this.focalPoint = focalPoint;
        this.lightUp = lightUp

        this.hasShadowMap = hasShadowMap;

        // texture
        this.fbo = new FBO(gl);
        if (!this.fbo) {
            console.log("无法设置帧缓冲区对象");
            return;
        }
    }

    // 模型(mary floow)的平移和缩放信息
    CalcLightMVP(translate, scale) {
         let lightMVP = mat4.create();
         let modelMatrix = mat4.create();
         let viewMatrix = mat4.create();
         let projectionMatrix = mat4.create();

         // Model transform
         mat4.translate(modelMatrix, modelMatrix, translate);
         mat4.scale(modelMatrix, modelMatrix, scale);

         // View transform
         mat4.lookAt(viewMatrix, this.lightPos, this.focalPoint, this.lightUp)

         // Projection transform
        // 光源处的正交相机
        let right = 80;
        let left = -right;
        let top = 80;
        let bottom = -top;
        mat4.ortho(projectionMatrix, left, right, bottom, top, 0, 500);

        mat4.multiply(lightMVP, projectionMatrix, viewMatrix);
        mat4.multiply(lightMVP, lightMVP, modelMatrix);
        return lightMVP
    }
}
