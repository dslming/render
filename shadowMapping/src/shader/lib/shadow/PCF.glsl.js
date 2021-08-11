// possionDiskSamples:: poissonDisk
//
export default function getSource(NUM_SAMPLES) {
  return `
  float PCF(sampler2D shadowMap, vec4 coords) {
    float filterSize = 0.003;
    poissonDiskSamples(coords.xy);
    float res = 0.0;
    for (int i = 0; i < ${NUM_SAMPLES}; i++) {
      vec2 texcoords = poissonDisk[i] * filterSize + coords.xy;
      float z = unpack(texture2D(shadowMap, texcoords));
      res += coords.z > z + 0.012 ? 0.0 : 1.0;
    }
    return res / float(${NUM_SAMPLES});
  }
  `
}
