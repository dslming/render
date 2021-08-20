import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'
import * as THREE from 'three'
import { SHEval } from './sh'
import global from './global'

var N_MONTE_CARLO = 100;
var RAY_OFFSET = 1e-18;
var bvh = null
var objects = []
const N_ORDER = 3;
const N_COEFFS = N_ORDER * N_ORDER

function buildBVH(objects) {
  console.log("build bvh...");

  var triangles = [];

  for (var i = 0; i < objects.length; i++) {
    var verts = objects[i].geometry.getAttribute("position");
    var N_VERTS = verts.count;
    var verts = verts.array;
    for (var k = 0; k < N_VERTS * 3; k += 3 * 3) {
      var v0 = new THREE.Vector3(verts[k + 0], verts[k + 1], verts[k + 2]);
      var v1 = new THREE.Vector3(verts[k + 3], verts[k + 4], verts[k + 5]);
      var v2 = new THREE.Vector3(verts[k + 6], verts[k + 7], verts[k + 8]);
      var triangle = [
        { x: v0.x, y: v0.y, z: v0.z },
        { x: v1.x, y: v1.y, z: v1.z },
        { x: v2.x, y: v2.y, z: v2.z },
      ];
      triangles.push(triangle);
    }
  }

  // the maximum number of triangles that can fit in a node before splitting it.
  var maxTrianglesPerNode = 7;
  bvh = new bvhtree.BVH(triangles, maxTrianglesPerNode);

  console.log("[build bvh done]");
}

function squareToUniformSphere(sample) {
  var z = 1.0 - 2.0 * sample.x;
  var r = Math.sqrt(Math.max(0.0, 1.0 - z * z));
  var phi = 2.0 * Math.PI * sample.y;
  return new THREE.Vector3(r * Math.cos(phi), r * Math.sin(phi), z);
}

function createSamples(N) {
  var samples = new Array(N);
  for (var i = 0; i < N; i++) {
    var sample = new THREE.Vector2(Math.random(), Math.random());
    samples[i] = squareToUniformSphere(sample);
  }
  return samples
}

function computeG(G, v, verts, normals, samples) {
  var p = new THREE.Vector3(verts[v * 3 + 0], verts[v * 3 + 1], verts[v * 3 + 2]);
  var n = new THREE.Vector3(normals[v * 3 + 0], normals[v * 3 + 1], normals[v * 3 + 2]);

  // offset ray
  var n_ = n.clone();
  n_.multiplyScalar(RAY_OFFSET);
  p.add(n_);

  for (var i = 0; i < N_MONTE_CARLO; i++) {
    var w = samples[i].clone();
    w.normalize();
    var cosTheta = Math.max(0.0, w.dot(n));
    if (cosTheta == 0.0) continue;
    var pWi = 1.0 / (4.0 * Math.PI);
    var V = bvh.intersectRay(p, w, true).length == 0;
    if (V) {
      var yi = SHEval(w.x, w.y, w.z, N_ORDER);
      for (var k = 0; k < N_COEFFS; k++) {
        G[v][k] += cosTheta * yi[k];
      }
    }
  }

  for (var k = 0; k < N_COEFFS; k++) {
    G[v][k] *= 1.0 / (Math.PI * N_MONTE_CARLO * pWi);
  }
}

/**
 * 计算传输函数
 */
export default class Transprt {
  constructor() {

  }

  getTrans() {
    return new Promise((resolve, reject) => {
       let loader = new OBJLoader()
       loader.load(global.objName, obj => {
         const model = obj.children[0]
         // cb(model)
         objects = [model]
         this.calc(model)
         buildBVH(objects)
         const PRTCache = this.precomputeG()
         resolve(PRTCache)
       })
    })
  }

  precomputeG() {
    // do precomputations
    console.log("compute G...");
    const samples = createSamples(N_MONTE_CARLO);
    var PRTCache = [];

    for (var j = 0; j < objects.length; j++) {
      var obj = objects[j];
      var verts = obj.geometry.getAttribute("position");
      var normals = obj.geometry.getAttribute("normal");
      var N_VERTS = verts.count;
      var G = new Array(N_VERTS);
      for (var i = 0; i < G.length; i++) {
        G[i] = new Array(N_COEFFS);
        for (var k = 0; k < N_COEFFS; k++) {
          G[i][k] = 0.0;
        }
      }

      for (var v = 0; v < N_VERTS; v++) {
        computeG(G, v, verts.array, normals.array, samples);
      }

      PRTCache.push(G);
    }

    console.log("[compute G done]");
    // console.error(PRTCache);
    PRTCache = PRTCache[0]
      let arr = []
      PRTCache.forEach(item => {
        arr.push(...item)
      })
    return arr
  }

  calc(model) {
    	var verts = model.geometry.getAttribute("position");
    	var N_VERTS = verts.count;
    	verts = verts.array;
    	for (var v = 0; v < N_VERTS; v++) {
    	  var vert = new THREE.Vector3(verts[v * 3 + 0], verts[v * 3 + 1], verts[v * 3 + 2]);
    	  verts[v * 3 + 0] = vert.x;
    	  verts[v * 3 + 1] = vert.y;
    	  verts[v * 3 + 2] = vert.z + 1.5;
      }
    // console.error(verts);

  }
}
