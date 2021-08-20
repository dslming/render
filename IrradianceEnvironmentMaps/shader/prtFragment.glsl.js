
export default `
#ifdef GL_ES
precision mediump float;
#endif

uniform mat3 uPrecomputeLR;
uniform mat3 uPrecomputeLG;
uniform mat3 uPrecomputeLB;


varying vec3 vPrecomputeLT0;
varying vec3 vPrecomputeLT1;
varying vec3 vPrecomputeLT2;

vec3 SHrecon() {
  vec3 result =
    vec3(uPrecomputeLR[0][0], uPrecomputeLG[0][0], uPrecomputeLB[0][0]) * vPrecomputeLT0.x +
    vec3(uPrecomputeLR[0][1], uPrecomputeLG[0][1], uPrecomputeLB[0][1]) * vPrecomputeLT0.y +
    vec3(uPrecomputeLR[0][2], uPrecomputeLG[0][2], uPrecomputeLB[0][2]) * vPrecomputeLT0.z +
    vec3(uPrecomputeLR[1][0], uPrecomputeLG[1][0], uPrecomputeLB[1][0]) * vPrecomputeLT1.x +
    vec3(uPrecomputeLR[1][1], uPrecomputeLG[1][1], uPrecomputeLB[1][1]) * vPrecomputeLT1.y +
    vec3(uPrecomputeLR[1][2], uPrecomputeLG[1][2], uPrecomputeLB[1][2]) * vPrecomputeLT1.z +
    vec3(uPrecomputeLR[2][0], uPrecomputeLG[2][0], uPrecomputeLB[2][0]) * vPrecomputeLT2.x +
    vec3(uPrecomputeLR[2][1], uPrecomputeLG[2][1], uPrecomputeLB[2][1]) * vPrecomputeLT2.y +
    vec3(uPrecomputeLR[2][2], uPrecomputeLG[2][2], uPrecomputeLB[2][2]) * vPrecomputeLT2.z;
  return result;
}

void main(void){
    gl_FragColor = vec4(SHrecon(), 1);
    // gl_FragColor = vec4(vec3(uPrecomputeLR[0][0], uPrecomputeLG[0][0], uPrecomputeLB[0][0]) , 1);
}`


