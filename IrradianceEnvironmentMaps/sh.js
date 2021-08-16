const kHardCodedOrderLimit = 4

export default class SphericalHarmonics {
  static GetIndex(l, m) {
    return l * (l + 1) + m;
  }

  static HardcodedSH00(d) {
    // 0.5 * sqrt(1/pi)
    return 0.282095;
  }

  static HardcodedSH1n1(d) {
    // -sqrt(3/(4pi)) * y
    return -0.488603 * d.y;
  }

  static HardcodedSH10(d) {
    // sqrt(3/(4pi)) * z
    return 0.488603 * d.z;
  }

  static HardcodedSH1p1(d) {
    // -sqrt(3/(4pi)) * x
    return -0.488603 * d.x;
  }

  static HardcodedSH2n2(d) {
    // 0.5 * sqrt(15/pi) * x * y
    return 1.092548 * d.x * d.y;
  }

  static HardcodedSH2n1(d) {
    // -0.5 * sqrt(15/pi) * y * z
    return -1.092548 * d.y * d.z;
  }

  static HardcodedSH20(d) {
    // 0.25 * sqrt(5/pi) * (-x^2-y^2+2z^2)
    return 0.315392 * (-d.x * d.x - d.y * d.y + 2.0 * d.z * d.z);
  }

  static HardcodedSH2p1(d) {
    // -0.5 * sqrt(15/pi) * x * z
    return -1.092548 * d.x * d.z;
  }

  static HardcodedSH2p2(d) {
    // 0.25 * sqrt(15/pi) * (x^2 - y^2)
    return 0.546274 * (d.x * d.x - d.y * d.y);
  }

  static HardcodedSH3n3(d) {
    // -0.25 * sqrt(35/(2pi)) * y * (3x^2 - y^2)
    return -0.590044 * d.y * (3.0 * d.x * d.x - d.y * d.y);
  }

  static HardcodedSH3n2(d) {
    // 0.5 * sqrt(105/pi) * x * y * z
    return 2.890611 * d.x * d.y * d.z;
  }

  static HardcodedSH3n1(d) {
    // -0.25 * sqrt(21/(2pi)) * y * (4z^2-x^2-y^2)
    return -0.457046 * d.y * (4.0 * d.z * d.z - d.x * d.x -
      d.y * d.y);
  }

  static HardcodedSH30(d) {
    // 0.25 * sqrt(7/pi) * z * (2z^2 - 3x^2 - 3y^2)
    return 0.373176 * d.z * (2.0 * d.z * d.z - 3.0 * d.x * d.x -
      3.0 * d.y * d.y);
  }

  static HardcodedSH3p1(d) {
    // -0.25 * sqrt(21/(2pi)) * x * (4z^2-x^2-y^2)
    return -0.457046 * d.x * (4.0 * d.z * d.z - d.x * d.x -
      d.y * d.y);
  }

  static HardcodedSH3p2(d) {
    // 0.25 * sqrt(105/pi) * z * (x^2 - y^2)
    return 1.445306 * d.z * (d.x * d.x - d.y * d.y);
  }

  static HardcodedSH3p3(d) {
    // -0.25 * sqrt(35/(2pi)) * x * (x^2-3y^2)
    return -0.590044 * d.x * (d.x * d.x - 3.0 * d.y * d.y);
  }

  static HardcodedSH4n4(d) {
    // 0.75 * sqrt(35/pi) * x * y * (x^2-y^2)
    return 2.503343 * d.x * d.y * (d.x * d.x - d.y * d.y);
  }

  static HardcodedSH4n3(d) {
    // -0.75 * sqrt(35/(2pi)) * y * z * (3x^2-y^2)
    return -1.770131 * d.y * d.z * (3.0 * d.x * d.x - d.y * d.y);
  }

  static HardcodedSH4n2(d) {
    // 0.75 * sqrt(5/pi) * x * y * (7z^2-1)
    return 0.946175 * d.x * d.y * (7.0 * d.z * d.z - 1.0);
  }

  static HardcodedSH4n1(d) {
    // -0.75 * sqrt(5/(2pi)) * y * z * (7z^2-3)
    return -0.669047 * d.y * d.z * (7.0 * d.z * d.z - 3.0);
  }

  static HardcodedSH40(d) {
    // 3/16 * sqrt(1/pi) * (35z^4-30z^2+3)
    z2 = d.z * d.z;
    return 0.105786 * (35.0 * z2 * z2 - 30.0 * z2 + 3.0);
  }

  static HardcodedSH4p1(d) {
    // -0.75 * sqrt(5/(2pi)) * x * z * (7z^2-3)
    return -0.669047 * d.x * d.z * (7.0 * d.z * d.z - 3.0);
  }

  static HardcodedSH4p2(d) {
    // 3/8 * sqrt(5/pi) * (x^2 - y^2) * (7z^2 - 1)
    return 0.473087 * (d.x * d.x - d.y * d.y) *
      (7.0 * d.z * d.z - 1.0);
  }

  static HardcodedSH4p3(d) {
    // -0.75 * sqrt(35/(2pi)) * x * z * (x^2 - 3y^2)
    return -1.770131 * d.x * d.z * (d.x * d.x - 3.0 * d.y * d.y);
  }

  static EvalSH(l, m, dir) {
    if (l > kHardCodedOrderLimit) {
      console.error("fail...");
      return
    }

    switch (l) {
      case 0:
        return SphericalHarmonics.HardcodedSH00(dir);
      case 1:
        switch (m) {
          case -1:
            return SphericalHarmonics.HardcodedSH1n1(dir);
          case 0:
            return SphericalHarmonics.HardcodedSH10(dir);
          case 1:
            return SphericalHarmonics.HardcodedSH1p1(dir);
        }
        case 2:
          switch (m) {
            case -2:
              return SphericalHarmonics.HardcodedSH2n2(dir);
            case -1:
              return SphericalHarmonics.HardcodedSH2n1(dir);
            case 0:
              return SphericalHarmonics.HardcodedSH20(dir);
            case 1:
              return SphericalHarmonics.HardcodedSH2p1(dir);
            case 2:
              return SphericalHarmonics.HardcodedSH2p2(dir);
          }
          case 3:
            switch (m) {
              case -3:
                return SphericalHarmonics.HardcodedSH3n3(dir);
              case -2:
                return SphericalHarmonics.HardcodedSH3n2(dir);
              case -1:
                return SphericalHarmonics.HardcodedSH3n1(dir);
              case 0:
                return SphericalHarmonics.HardcodedSH30(dir);
              case 1:
                return SphericalHarmonics.HardcodedSH3p1(dir);
              case 2:
                return SphericalHarmonics.HardcodedSH3p2(dir);
              case 3:
                return SphericalHarmonics.HardcodedSH3p3(dir);
            }
            case 4:
              switch (m) {
                case -4:
                  return SphericalHarmonics.HardcodedSH4n4(dir);
                case -3:
                  return SphericalHarmonics.HardcodedSH4n3(dir);
                case -2:
                  return SphericalHarmonics.HardcodedSH4n2(dir);
                case -1:
                  return SphericalHarmonics.HardcodedSH4n1(dir);
                case 0:
                  return SphericalHarmonics.HardcodedSH40(dir);
                case 1:
                  return SphericalHarmonics.HardcodedSH4p1(dir);
                case 2:
                  return SphericalHarmonics.HardcodedSH4p2(dir);
                case 3:
                  return SphericalHarmonics.HardcodedSH4p3(dir);
                case 4:
                  return SphericalHarmonics.HardcodedSH4p4(dir);
              }
    }
  }
}
