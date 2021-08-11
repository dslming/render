import constant from './lib/constant/constant.glsl.js'
import blinnPhong from './lib/brdf/blinnPhong.glsl.js'
import poissonDiskSamples from './lib/samples/possionDiskSamples.glsl.js'
import PCF from "./lib/shadow/PCF.glsl.js"
import useShadowMap from './lib/shadow/shadowMap.glsl.js'
import depth from './lib/depth/depth.glsl.js'

const NUM_SAMPLES = 50;

export default `
#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uSampler;
uniform vec3 uKs;
uniform vec3 uLightPos;
uniform vec3 uCameraPos;
uniform vec3 uLightIntensity;
uniform sampler2D uShadowMap;

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

void main(void) {
  vec3 projCoords = vPositionFromLight.xyz / vPositionFromLight.w;
  vec3 shadowCoord = projCoords * 0.5 + 0.5;
  float visibility;
  visibility = useShadowMap(uShadowMap, vec4(shadowCoord,1.0));
  // visibility = PCF(uShadowMap, vec4(shadowCoord,1.0));
  // visibility = PCSS(uShadowMap, vec4(shadowCoord, 1.0));
  vec3 phongColor = blinnPhong();
  gl_FragColor = vec4(phongColor * visibility, 1.0);
}
`