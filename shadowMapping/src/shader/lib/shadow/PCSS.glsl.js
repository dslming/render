export default `
float PCSS(sampler2D shadowMap, vec4 coords) {
  float dist = coords.z;
  // STEP 1: avgblocker depth
  float depth_avg = findBlocker(shadowMap, coords.xy, dist);

  // STEP 2: penumbra size
  float pen_radius = (dist - depth_avg) / depth_avg;
  // STEP 3: filtering
  poissonDiskSamples(coords.xy);
  for (int i = 0; i < NUM_SAMPLES; i++) {
    poissonDisk[i] = poissonDisk[i] * pen_radius / 2.0;
  }
  float visibility = PCF(shadowMap, coords);
  return visibility;
}
`
