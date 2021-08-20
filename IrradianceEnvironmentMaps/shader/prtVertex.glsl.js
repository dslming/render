export default `
# ifdef GL_ES
precision mediump float;
#endif

attribute vec3 aPrecomputeLT0;
attribute vec3 aPrecomputeLT1;
attribute vec3 aPrecomputeLT2;

varying vec3 vPrecomputeLT0;
varying vec3 vPrecomputeLT1;
varying vec3 vPrecomputeLT2;

void main(void) {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vPrecomputeLT0 = aPrecomputeLT0;
  vPrecomputeLT1 = aPrecomputeLT1;
  vPrecomputeLT2 = aPrecomputeLT2;
}
`
