import {TRSTransform} from '../tool/TRSTransform'
const defaultTrans = {
	modelTransX: 0,
	modelTransY: 0,
	modelTransZ: 0,
	modelScaleX: 0,
	modelScaleY: 0,
	modelScaleZ: 0,
}
// 抽象的网格
export default class Mesh {
	/**
	 * @param {*} verticesAttrib 顶点属性
	 * @param {*} normalsAttrib 法线属性
	 * @param {*} texcoordsAttrib uv属性
	 * @param {*} indices 顶点属性
	 * @param {*} transform 变换
	 */
	constructor(verticesAttrib, normalsAttrib, texcoordsAttrib, indices, transform) {
		transform = transform || defaultTrans
		this.indices = indices;
		this.vertices = null
		this.normals = null
		this.texcoords = null
		this.count = indices.length;
		this.hasVertices = false;
		this.hasNormals = false;
		this.hasTexcoords = false;

		const modelTranslation = [transform.modelTransX, transform.modelTransY, transform.modelTransZ];
		const modelScale = [transform.modelScaleX, transform.modelScaleY, transform.modelScaleZ];
		this.transform = new TRSTransform(modelTranslation, modelScale);;

		if (verticesAttrib != null) {
			this.hasVertices = true;
			this.vertices = verticesAttrib.array;
			this.verticesName = verticesAttrib.name;
		}
		if (normalsAttrib != null) {
			this.hasNormals = true;
			this.normals = normalsAttrib.array;
			this.normalsName = normalsAttrib.name;
		}
		if (texcoordsAttrib != null) {
			this.hasTexcoords = true;
			this.texcoords = texcoordsAttrib.array;
			this.texcoordsName = texcoordsAttrib.name;
		}
	}

	static cube(transform) {
		const positions = [
			// Front face
			-1.0, -1.0, 1.0,
			1.0, -1.0, 1.0,
			1.0, 1.0, 1.0,
			-1.0, 1.0, 1.0,

			// Back face
			-1.0, -1.0, -1.0,
			-1.0, 1.0, -1.0,
			1.0, 1.0, -1.0,
			1.0, -1.0, -1.0,

			// Top face
			-1.0, 1.0, -1.0,
			-1.0, 1.0, 1.0,
			1.0, 1.0, 1.0,
			1.0, 1.0, -1.0,

			// Bottom face
			-1.0, -1.0, -1.0,
			1.0, -1.0, -1.0,
			1.0, -1.0, 1.0,
			-1.0, -1.0, 1.0,

			// Right face
			1.0, -1.0, -1.0,
			1.0, 1.0, -1.0,
			1.0, 1.0, 1.0,
			1.0, -1.0, 1.0,

			// Left face
			-1.0, -1.0, -1.0,
			-1.0, -1.0, 1.0,
			-1.0, 1.0, 1.0,
			-1.0, 1.0, -1.0,
		];
		const indices = [
			0, 1, 2, 0, 2, 3, // front
			4, 5, 6, 4, 6, 7, // back
			8, 9, 10, 8, 10, 11, // top
			12, 13, 14, 12, 14, 15, // bottom
			16, 17, 18, 16, 18, 19, // right
			20, 21, 22, 20, 22, 23, // left
		];

		return new Mesh({ name: 'aVertexPosition', array: new Float32Array(positions) }, null, null, indices, transform);
		}
}
