export default `
#ifdef GL_ES
precision mediump float;
#endif

uniform samplerCube skybox;
varying highp vec3 vFragPos;

void main() {
     gl_FragColor = textureCube(skybox, vFragPos);
}`
