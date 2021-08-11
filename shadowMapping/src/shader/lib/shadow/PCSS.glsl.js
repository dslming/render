export default function getSource(NUM_SAMPLES) {
  return `
float findBlocker(sampler2D shadowMap, vec2 uv, float zReceiver) {
  float depth_avg = 0.0;
  int k = 0;
  float depth;
  poissonDiskSamples(uv);
  for (int i = 0; i < ${NUM_SAMPLES}; i++) {
    depth = unpack(vec4(texture2D(shadowMap, uv + poissonDisk[i] / float(2048) * 50.0).rgb, 1.0));
    depth_avg += (depth <= zReceiver + 0.003) ? depth : 0.0;
    k += (depth <= zReceiver + 0.003) ? 1 : 0;
  }
  //没有遮挡
  if (k == 0) {
    return -1.0;
  }

  //完全遮挡
  if (k == ${NUM_SAMPLES}) {
    return 2.0;
  }

  return depth / float(k);
}

float PCSS(sampler2D shadowMap, vec4 coords) {
  float dist = coords.z;
  // STEP 1: avgblocker depth 平均拦截器深度
  float depth_avg = findBlocker(shadowMap, coords.xy, dist);

  // STEP 2: penumbra size 半影大小
  float pen_radius = (dist - depth_avg) / depth_avg;
  // STEP 3: filtering 过滤
  poissonDiskSamples(coords.xy);
  for (int i = 0; i < ${NUM_SAMPLES}; i++) {
    poissonDisk[i] = poissonDisk[i] * pen_radius / 2.0;
  }
  return = PCF(shadowMap, coords);
}
`
}
