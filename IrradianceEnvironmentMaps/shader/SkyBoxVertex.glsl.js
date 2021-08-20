export default `
varying highp vec3 vFragPos;

void main() {
  vFragPos = position;
   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`
