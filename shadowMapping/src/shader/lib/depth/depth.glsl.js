// Based on https://threejs.org/examples/#webgl_depth_texture by mattdesl

export default /* glsl */`
// float getDepth(float fragCoordZ, float near, float far) {
//     float viewZ = perspectiveDepthToViewZ(fragCoordZ, near, far);
//     return viewZToOrthographicDepth(viewZ, near, far);
// }

// float getDepth(sampler2D tex, vec2 coord, float near, float far) {
//     float fragCoordZ = texture2D(tex, coord).x;
//     return getDepth(fragCoordZ, near, far);
// }

#ifndef __DEPTH__

#define __DEPTH__

float unpack(vec4 rgbaDepth) {
  const vec4 bitShift = vec4(1.0, 1.0 / 256.0, 1.0 / (256.0 * 256.0), 1.0 / (256.0 * 256.0 * 256.0));
  float depth = dot(rgbaDepth, bitShift);
  if (abs(depth) < EPS) {
    depth = 1.0;
  }
  return depth;
}

#endif
`;
