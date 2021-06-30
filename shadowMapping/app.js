import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module.js';

import WebGLRenderer from './src/render/WebGLRenderer'
import MeshRender from './src/render/MeshRender'

import DirectionalLight from './src/lights/DirectionalLight'
import { setTransform } from './src/tool/TRSTransform'
import loadOBJ from './src/loader/loadOBJ'
import Mesh from './src/object/Mesh'
import Texture from './src/webgl/Texture'
import PhongMaterial from './src/materials/PhongMaterial'
import ShadowMaterial from './src/materials/ShadowMaterial'

class App {
  constructor() {
    this.mainLoop = this.mainLoop.bind(this)
  }

  GAMES202Main() {
    // Init canvas and gl
    const canvas = document.querySelector('#glcanvas');
    canvas.width = window.screen.width;
    canvas.height = window.screen.height;
    const stats = new Stats();
    document.body.appendChild(stats.dom);
    this.stats = stats
    this.canvas = canvas

    const gl = canvas.getContext('webgl');
    if (!gl) { alert('error...'); return;}
    this.gl = gl

    let {camera, cameraControls} = this.initCamera()
    this.camera = camera
    this.cameraControls = cameraControls
    const renderer = new WebGLRenderer(gl, camera);
    this.renderer = renderer
    renderer.addLight(this.initLight());

    // Add shapes
    // let obj2Transform = setTransform(40, 0, -40, 10, 10, 10);

    loadOBJ('./assets/mary/', 'Marry').then(obj => {
     let obj1Transform = setTransform(0, 0, 0, 20, 20, 20);
      this.handleObj(obj, obj1Transform, renderer)
    })

    loadOBJ('./assets/floor/', 'floor').then(obj => {
      let floorTransform = setTransform(0, 0, 0, 4, 4, 4);
      this.handleObj(obj, floorTransform, renderer)
    })
  }

  mainLoop() {
    this.cameraControls.update();
    this.renderer.render();
    this.stats.update()
    requestAnimationFrame(this.mainLoop);
  }

  initLight() {
    // 光源位置
    let lightPos = [0, 80, 80];
    // 光源的目标位置
    let focalPoint = [0, 0, 0];
    let lightUp = [0, 1, 0]
    const directionLight = new DirectionalLight(5000, [1, 1, 1], lightPos, focalPoint, lightUp, true, this.renderer.gl);
    return directionLight
  }

  initCamera() {
    // Add camera
    const camera = new THREE.PerspectiveCamera(75, 1, 1e-2, 500);
    var cameraPosition = [70, 70, 100]
    // var cameraPosition = [30, 30, 30]
    camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]);

    // Add resize listener
    function setSize(width, height) {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
    setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    window.addEventListener('resize', () => setSize(this.canvas.clientWidth, this.canvas.clientHeight));

    // Add camera control
    const cameraControls = new OrbitControls(camera, this.canvas);
    cameraControls.enableZoom = true;
    cameraControls.enableRotate = true;
    cameraControls.enablePan = true;
    cameraControls.rotateSpeed = 0.3;
    cameraControls.zoomSpeed = 1.0;
    cameraControls.panSpeed = 0.8;
    cameraControls.target.set(0, 0, 0);

    return { camera, cameraControls }
  }

  handleObj(object, transform, renderer) {
    object.traverse(function(child) {
      if (!child.isMesh) { return }

      let geo = child.geometry;
      let mat;
      if (Array.isArray(child.material)) mat = child.material[0];
      else mat = child.material;

      const indices = Array.from({ length: geo.attributes.position.count }, (v, k) => k);

      let mesh = new Mesh(
        {
          name: 'aVertexPosition',
          array: geo.attributes.position.array
        },
        {
          name: 'aNormalPosition',
          array: geo.attributes.normal.array
        },
        {
          name: 'aTextureCoord',
          array: geo.attributes.uv.array
        },
        indices, transform);

        let colorMap = new Texture();
        if (mat.map != null) {
          colorMap.CreateImageTexture(renderer.gl, mat.map.image);
        } else {
          colorMap.CreateConstantTexture(renderer.gl, mat.color.toArray());
        }

      let Translation = [transform.modelTransX, transform.modelTransY, transform.modelTransZ];
      let Scale = [transform.modelScaleX, transform.modelScaleY, transform.modelScaleZ];

      let light = renderer.lights[0].entity;

      const material = new PhongMaterial(colorMap, mat.specular.toArray(), light, Translation, Scale);
      let meshRender = new MeshRender(renderer.gl, mesh, material);
      renderer.addMeshRender(meshRender);
      const shadowMaterial = new ShadowMaterial(light, Translation, Scale);
      let shadowMeshRender = new MeshRender(renderer.gl, mesh, shadowMaterial);
      renderer.addShadowMeshRender(shadowMeshRender);
    });
  }
}

window.onload = () => {
  let app = new App()
  window.lm = app
  app.GAMES202Main()
  app.mainLoop()
}
