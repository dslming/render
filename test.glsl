// -1 -1
float rand_1to1(float x ) {
  return fract(sin(x)*10000.0);
}

#define PI 3.141592653589793
#define PI2 6.283185307179586

// 0 - 1
float rand_2to1(vec2 uv ) {
	const float a = 12.9898, b = 78.233, c = 43758.5453;
	float dt = dot( uv.xy, vec2( a,b ) );
  float sn = mod( dt, PI );
	return fract(sin(sn) * c);
}


#define NUM_SAMPLES 20
#define NUM_RINGS 10
vec2 poissonDisk[NUM_SAMPLES];

void poissonDiskSamples( const in vec2 randomSeed ) {
  float ANGLE_STEP = PI2 * float( NUM_RINGS ) / float( NUM_SAMPLES );
  float INV_NUM_SAMPLES = 1.0 / float( NUM_SAMPLES );

  float angle = rand_2to1( randomSeed ) * PI2;
  float radius = INV_NUM_SAMPLES;
  float radiusStep = radius;

  for( int i = 0; i < NUM_SAMPLES; i ++ ) {
    poissonDisk[i] = vec2( cos( angle ), sin( angle ) ) * pow( radius, 0.75 );
    radius += radiusStep;
    angle += ANGLE_STEP;
  }
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
		vec2 aspect = vec2(iResolution.x/iResolution.y, 1.0);
  	vec2 uv = aspect*(fragCoord.xy / iResolution.xy);
	  // vec3 col = vec3(fract(uv.x),0.,0.);
    poissonDiskSamples(uv);
	  // vec3 col = vec3(rand_1to1(uv.x),0.,0.);
    vec3 col = vec3(poissonDisk[1],.0);
	  // vec3 col = vec3(rand_2to1(uv),0.,0.);

    fragColor = vec4(col,1.0);
}
