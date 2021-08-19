export default `
attribute mat3 aPrecomputeLT;

varying highp mat3 vPrecomputeLT;

void main(void) {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vPrecomputeLT = aPrecomputeLT;
}
`
