// by tkstar.
// Lighting is done by Spherical Harmonics:
// This one is a cheap variant presented in 2001 by Ravi Ramamoorthi
struct SHCoefficients {
    vec3 l00, l1m1, l10, l11, l2m2, l2m1, l20, l21, l22;
};

const SHCoefficients stpeter = SHCoefficients(
    vec3( 1.649656, 1.818793, 1.422597),
    vec3( -0.010007, -0.210143, -0.360245),
    vec3( 0.003336, 0.226821, -0.443635),
    vec3( 0.006671, -0.346903, 0.196801),
    vec3( 0.000000, -0.000000, 0.000000),
    vec3( -0.000000, -0.000000, -0.000000),
    vec3( -0.901174, 0.635535, -0.212797),
    vec3( 0.000000, -0.000000, -0.000000),
    vec3( 0.719835, 0.279523, -0.764361)
);

vec3 calcSHIrradiance(vec3 norm, float scale){
    const float PI = 3.1415926535897;
    const float l0 = 1.0;
    const float l1 = 2.0 / 3.0;
    const float l2 = 1.0 / 4.0;
    const float c0 = 0.282095;
    const float c1 = 0.488603;
    const float c2 = 1.09255;
    const float c3 = 0.546274;
    const float c4 = 0.315392;

    const SHCoefficients c = stpeter;
    vec3 normSqr = norm * norm;

    vec3 irradiance =
        c.l00 * c0 * l0 +
        c1 * (-norm.y * c.l1m1 + norm.z * c.l10 - norm.x * c.l11) * l1 +
        c2 * (-norm.x * norm.y * c.l2m2 - norm.y * norm.z * c.l2m1 - norm.x * norm.z * c.l21) * l2 +
        c4 * (3.0 * normSqr.z - 1.0) * c.l20 * l2 +
        c3 * (normSqr.x - normSqr.y) * c.l22 * l2;
    return irradiance * scale;
}

vec3 spherePos = vec3(0.0, 1.0, 1.5);
float sphereRadius = 2.5;

float raytraceSphere(in vec3 ro, in vec3 rd, float tmin, float tmax, float r) {
    vec3 ce = ro - spherePos;
    float b = dot(rd, ce);
    float c = dot(ce, ce) - r * r;
    float t = b * b - c;
    if (t > tmin) {
        t = -b - sqrt(t);
        if (t < tmax)
            return t;
        }
    return -1.0;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 p = (2.0 * fragCoord.xy - iResolution.xy) / iResolution.y;

    float time = iTime;
    vec3 eye = vec3(0.0, 3.0, 5.0);
    vec2 rot = 6.2831 * (vec2(0.6 + time * 0.05, sin(time * 0.1) * 0.06) + vec2(1.0, 0.25) * (iMouse.xy - iResolution.xy * 0.25) / iResolution.x);
    eye.yz = cos(rot.y) * eye.yz + sin(rot.y) * eye.zy * vec2(-1.0, 1.0);
    eye.xz = cos(rot.x) * eye.xz + sin(rot.x) * eye.zx * vec2(1.0, -1.0);

    vec3 ro = eye;
    vec3 ta = vec3(0.0, 1.0, 0.0);

    vec3 cw = normalize(ta - eye);
    vec3 cu = normalize(cross(vec3(0.0, 1.0, 0.0), cw));
    vec3 cv = normalize(cross(cw, cu));
    mat3 cam = mat3(cu, cv, cw);

    vec3 rd = cam * normalize(vec3(p.xy, 1.0));

    vec3 col = vec3(0, 0, 0);
    float tmin = 0.1;
    float tmax = 50.0;

    // raytrace the sphere
    float tsph = raytraceSphere(ro, rd, tmin, tmax, sphereRadius);
    if (tsph > tmin) {
        vec3 spos = ro + rd * tsph;
        vec3 nor = normalize(spos - spherePos);
        col = calcSHIrradiance(nor, 2.0);
    }

    fragColor = vec4(col, 1.0);
}
