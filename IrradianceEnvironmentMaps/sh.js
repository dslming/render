/**
 * 3阶球谐函数系数
 * @param {*} x
 * @param {*} y
 * @param {*} z
 * @returns
 */

// sh(l,m)
export function SHEval3(x, y, z) {
  var psh = new Array(9).fill(0);

  /*------------------Band l=0-------------*/
  // sh(0,0), 0.5 * sqrt(1/pi)
  psh[0] = 0.282095

  /*------------------Band l=1-------------*/
  // sh(1,-1), -sqrt(3/(4pi)) * y
  psh[1] = -0.488603 * y
  // sh(1,0), sqrt(3/(4pi)) * z
  psh[2] = -0.488603 * z
  // sh(1,1), -sqrt(3/(4pi)) * x
  psh[3] = -0.488603 * x

  /*------------------Band l=2-------------*/
  // sh(2,-2), 0.5 * sqrt(15/pi) * x * y
   psh[4] = 1.092548 * x * y;
  // sh(2,-1), -0.5 * sqrt(15/pi) * y * z
   psh[5] = -1.092548 * y * z;
  // sh(2, 0), 0.25 * sqrt(5/pi) * (-x^2-y^2+2z^2)
   psh[6] = 0.315392 * (-x * x - y * y + 2.0 * z * z);
  // sh(2, 1), -0.5 * sqrt(15/pi) * x * z
   psh[7] = -1.092548 * x * z;
  // sh(2, 2), 0.25 * sqrt(15/pi) * (x^2 - y^2)
   psh[8] = 0.546274 * (x * x - y * y);
  return psh;
}
