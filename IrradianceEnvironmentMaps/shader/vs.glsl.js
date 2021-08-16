export default `
uniform vec3 sh[25];
uniform float shc[25];
varying vec4 color;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    vec3 p = -position;
    float x2 = p.x*p.x;
    float y2 = p.y*p.y;
    float z2 = p.z*p.z;
    vec3 v =
    sh[0]*shc[0] +

    sh[1]*shc[1]*p.y +
    sh[2]*shc[2]*p.z +
    sh[3]*shc[3]*p.x +

    sh[4]*shc[4]*p.x*p.y +
    sh[5]*shc[5]*p.y*p.z +
    sh[6]*shc[6]*(3.*z2-1.) +
    sh[7]*shc[7]*p.x*p.z +
    sh[8]*shc[8]*(x2-y2) +

    sh[9]*shc[9]*p.y*(3.*x2-y2) +
    sh[10]*shc[10]*p.x*p.y*p.z +
    sh[11]*shc[11]*p.y*(5.*z2-1.) +
    sh[12]*shc[12]*p.z*(5.*z2-3.) +
    sh[13]*shc[13]*p.x*(5.*z2-1.) +
    sh[14]*shc[14]*p.z*(x2-y2) +
    sh[15]*shc[15]*p.x*(x2-3.*y2) +

    sh[16]*shc[16]*p.x*p.y*(x2-y2) +
    sh[17]*shc[17]*p.y*p.z*(3.*x2-y2) +
    sh[18]*shc[18]*p.x*p.y*(7.*z2-1.) +
    sh[19]*shc[19]*p.y*p.z*(7.*z2-3.) +
    sh[20]*shc[20]*(35.*z2*z2 - 30.*z2 + 3.) +
    sh[21]*shc[21]*p.x*p.z*(7.*z2-3.) +
    sh[22]*shc[22]*(x2-y2)*(7.*z2-1.) +
    sh[23]*shc[23]*p.x*p.z*(x2-3.*y2) +
    sh[24]*shc[24]*(x2*x2 - 6.*x2*y2 + y2*y2);
    // color = clamp(vec4(v,1), vec4(0), vec4(1e6));
    color = vec4(v,1.);
}`

