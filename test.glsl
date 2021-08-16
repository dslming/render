// Modified from https://www.shadertoy.com/view/lt2GRD

struct SHCoefficients {
    vec3 l00, l1m1, l10, l11, l2m2, l2m1, l20, l21, l22;
};

const SHCoefficients grace = SHCoefficients(
    vec3( 1.91613, 1.71772, 1.07797),
    vec3( -0.0591127, -0.0574315, -0.0346851 ),
    vec3(-3.86716e-05, -2.09946e-05, -1.34999e-05 ),
    vec3(0.439589, -0.431271, -0.0800766 ),
    vec3(-0.0306302, 0.0319349, 0.00328068 ),
    vec3(0.0758103, 0.0710374, 0.0591078 ),
    vec3(0.311676, 0.269456, 0.309399 ),
    vec3( -4.15631e-05, 6.26804e-05, 3.12491e-05 ),
    vec3( -0.541544, -0.468526, -0.536088 )
);

vec3 calcIrradiance(vec3 nor) {
    const SHCoefficients c = grace;
    const float c1 = 0.429043;
    const float c2 = 0.511664;
    const float c3 = 0.743125;
    const float c4 = 1.886227;
    const float c5 = 1.247708;
    return (
        c1 * c.l22 * (nor.x * nor.x - nor.y * nor.y) +
        c3 * c.l20 * nor.z * nor.z +
        c4 * c.l00 -
        c5 * c.l20 +
        2.0 * c1 * c.l2m2 * nor.x * nor.y +
        2.0 * c1 * c.l21  * nor.x * nor.z +
        2.0 * c1 * c.l2m1 * nor.y * nor.z +
        2.0 * c2 * c.l11  * nor.x +
        2.0 * c2 * c.l1m1 * nor.y +
        2.0 * c2 * c.l10  * nor.z
    );
}

vec3 spherePos = vec3(0.0, 1.0, 0.0);
vec3 planePos = vec3(0.0, 0.05, 0.0);
float sphereRadius = 1.0;

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

    vec3 eye = vec3(0.0, 2.0, 2.0);
    vec2 rot = 6.2831 * (vec2(0.6 + iTime * 0.25, 0.0) + vec2(1.0, 0.0) * (iMouse.xy - iResolution.xy * 0.25) / iResolution.x);
    eye.yz = cos(rot.y) * eye.yz + sin(rot.y) * eye.zy * vec2(-1.0, 1.0);
    eye.xz = cos(rot.x) * eye.xz + sin(rot.x) * eye.zx * vec2(1.0, -1.0);

    vec3 ro = eye;
    vec3 ta = vec3(0.0, 1.0, 0.0);

    vec3 cw = normalize(ta - ro);
    vec3 cu = normalize(cross(vec3(0.0, 1.0, 0.0), cw));
    vec3 cv = normalize(cross(cw, cu));
    mat3 cam = mat3(cu, cv, cw);

    vec3 rd = cam * normalize(vec3(p.xy, 1.0));

    vec3 col = vec3(0.0);
    vec3 nor;
    float occ = 1.0;

    float tmin = 0.1;
    float tmax = 50.0;

    // raytrace the plane
    float tpla = 0.0;

    // raytrace the sphere
    float tsph = raytraceSphere(ro, rd, tmin, tmax, sphereRadius);
    if (tsph > tmin) {
        vec3 spos = ro + rd * tsph;
        nor = normalize(spos - spherePos);
        occ = 0.5 + 0.5 * nor.y;
    }

    if (tpla > tmin || tsph > tmin) {
        col = calcIrradiance(nor) * occ;

        // distant fog if we don't hit the sphere
        if (tsph < tmin) {
            col = mix(col, vec3(0.0), 1.0 - exp(-0.001 * tpla * tpla));
        }
    }

	fragColor = vec4(col, 1.0);
}
