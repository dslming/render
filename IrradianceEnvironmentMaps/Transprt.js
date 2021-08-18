import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'
import * as THREE from 'three'

var bvh = null
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

  console.log("[done]");
}

/**
 * 计算传输函数
 */
export default class Transprt {
  constructor(cb) {
    let loader = new OBJLoader()
    loader.load("./assets/teapot.obj", obj => {
      cb(obj)
      this.calc(obj.children[0])
      buildBVH([obj.children[0]])
    })
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
