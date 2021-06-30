import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';

export default function loadOBJ(path, fileName) {
	const onProgress = function(xhr) {
		if (xhr.lengthComputable) {
			const percentComplete = xhr.loaded / xhr.total * 100;
			console.log(Math.round(percentComplete, 2) + '% downloaded');
		}
	};
	const onError = function () { };
	const manager = new THREE.LoadingManager();

	return new Promise((resolve, reject) => {
		new MTLLoader(manager)
		  .setPath(path)
		  .load(`${fileName}.mtl`, function(materials) {

		    materials.preload();

		    new OBJLoader(manager)
		      .setMaterials(materials)
		      .setPath(path)
		      .load(`${fileName}.obj`, function(object) {
						resolve(object)
		      }, onProgress, onError);
		  });
	})
}
