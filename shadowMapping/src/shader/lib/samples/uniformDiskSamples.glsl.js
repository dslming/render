export default `
void uniformDiskSamples(const in vec2 randomSeed) {

  float randNum = rand_2to1(randomSeed);
  float sampleX = rand_1to1(randNum);
  float sampleY = rand_1to1(sampleX);

  float angle = sampleX * PI2;
  float radius = sqrt(sampleY);

  for (int i = 0; i < NUM_SAMPLES; i++) {
    poissonDisk[i] = vec2(radius * cos(angle), radius * sin(angle));

    sampleX = rand_1to1(sampleY);
    sampleY = rand_1to1(sampleX);

    angle = sampleX * PI2;
    radius = sqrt(sampleY);
  }
}`
