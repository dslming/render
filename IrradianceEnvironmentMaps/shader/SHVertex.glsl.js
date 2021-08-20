export default `
uniform vec3 sh[9];
uniform float shc[9];
varying vec4 vColor;

void main() {
    vec3 p = position;
    float x2 = p.x*p.x;
    float y2 = p.y*p.y;
    float z2 = p.z*p.z;

    vec3 v =
        sh[0]*shc[0] +
        sh[1]*shc[1] * p.y +
        sh[2]*shc[2] * p.z +
        sh[3]*shc[3] * p.x +
        sh[4]*shc[4] * p.x * p.y +
        sh[5]*shc[5] * p.y * p.z +
        sh[6]*shc[6] * (-x2 - y2 + 2.*z2) +
        sh[7]*shc[7] * (x2-y2) +
        sh[8]*shc[8] * (x2 - y2);

    vColor = vec4(v, 1.);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`

