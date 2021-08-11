import random from '../random/random.glsl.js';

/**
 * 泊松圆盘采样
 */
export default function getSource(NUM_SAMPLES) {
  return `
    ${random}
    const int NUM_RINGS = 10;
    vec2 poissonDisk[${NUM_SAMPLES}];

    void poissonDiskSamples(const in vec2 randomSeed) {

      float ANGLE_STEP = PI2 * float(NUM_RINGS) / float(${NUM_SAMPLES});
      float INV_NUM_SAMPLES = 1.0 / float(${NUM_SAMPLES});

      float angle = rand_2to1(randomSeed) * PI2;
      float radius = INV_NUM_SAMPLES;
      float radiusStep = radius;

      for (int i = 0; i < ${NUM_SAMPLES}; i++) {
        poissonDisk[i] = vec2(cos(angle), sin(angle)) * pow(radius, 0.75);
        radius += radiusStep;
        angle += ANGLE_STEP;
      }
    }
    `
}
