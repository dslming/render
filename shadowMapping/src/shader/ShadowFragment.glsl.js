

import depth from './lib/depth/depth.glsl'
import constant from './lib/constant/constant.glsl.js'

export default `#ifdef GL_ES
precision mediump float;
#endif

uniform vec3 uLightPos;
uniform vec3 uCameraPos;

varying highp vec3 vNormal;
// varying highp vec2 vTextureCoord;
${ constant }
${ depth }

void main(){
  gl_FragColor = pack(gl_FragCoord.z);
  //  gl_FragColor = vec4(vec3(gl_FragCoord.z), 1.);
}`
