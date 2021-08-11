import constant from './lib/constant/constant.glsl.js'
import blinnPhong from './lib/brdf/blinnPhong.glsl.js'
import poissonDiskSamples from './lib/samples/possionDiskSamples.glsl.js'
import PCF from "./lib/shadow/PCF.glsl.js"
import useShadowMap from './lib/shadow/shadowMap.glsl.js'
import PCSS from './lib/shadow/PCSS.glsl'
import depth from './lib/depth/depth.glsl.js'
const NUM_SAMPLES = 100;

export default `
#ifdef GL_ES
precision mediump float;
#endif

// 贴图纹理
uniform sampler2D uSampler;
// 光源处拍摄的深度纹理
uniform sampler2D uShadowMap;
uniform vec3 uKs;
uniform vec3 uLightPos;
uniform vec3 uCameraPos;
uniform vec3 uLightIntensity;

varying highp vec2 vTextureCoord;
varying highp vec3 vFragPos;
varying highp vec3 vNormal;
varying vec4 vPositionFromLight;

${ constant }
${ depth }
${ poissonDiskSamples(NUM_SAMPLES) }
${PCF(NUM_SAMPLES) }
${ blinnPhong }
${ useShadowMap }
${ PCSS(NUM_SAMPLES) }
void main(void) {
  vec3 projCoords = vPositionFromLight.xyz / vPositionFromLight.w;
  vec3 shadowCoord = projCoords * 0.5 + 0.5;

  float visibility;
  // visibility = useShadowMap(uShadowMap, vec4(shadowCoord,1.0));
  // visibility = PCF(uShadowMap, vec4(shadowCoord,1.0));
  visibility = PCSS(uShadowMap, vec4(shadowCoord, 1.0));
  vec3 phongColor = blinnPhong(uKs, uCameraPos, uSampler, uLightPos, vTextureCoord, vNormal, vFragPos);
  gl_FragColor = vec4(phongColor * visibility, 1.0);
}
`
