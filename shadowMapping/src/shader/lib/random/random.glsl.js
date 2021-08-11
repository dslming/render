// From https://github.com/mattdesl/glsl-random

export default /* glsl */`
float random(vec2 co) {
    float a = 12.9898;
    float b = 78.233;
    float c = 43758.5453;
    float dt = dot(co.xy, vec2(a, b));
    float sn = mod(dt, 3.14);
    return fract(sin(sn) * c);
}

// -1 -1
highp float rand_1to1(highp float x) {
  return fract(sin(x) * 10000.0);
}

// 0 - 1
highp float rand_2to1(vec2 uv) {
  const highp float a = 12.9898,
    b = 78.233,
    c = 43758.5453;
  highp float dt = dot(uv.xy, vec2(a, b)), sn = mod(dt, PI);
  return fract(sin(sn) * c);
}
`;
