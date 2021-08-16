export default `
varying vec4 color;
uniform float exposure;
uniform float gamma;
void main() {
    gl_FragColor = pow(color / exposure, vec4(gamma, gamma, gamma, 1));
}`
