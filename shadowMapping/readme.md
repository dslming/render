### 阴影
npm run dev

#### Direct light
- cube mesh
- cube mat
- fbo: fbo

#### PhongMaterial
- uShadowMap: light.fbo

#### ShadowMaterial
- uShadowMap: light.fbo

#### 阴影产生的过程:
渲染对象: mary 和 floor。

每个渲染对象有两个材质, `ShadowMaterial`, `PhongMaterial`。

首先渲染`ShadowMaterial`材质。
- 计算光源的MVP矩阵, lightMVP
- 渲染光源处相机得到的深度图片,存储到纹理中
  ![alt](./doc/001.png)

最后渲染`PhongMaterial`材质.
