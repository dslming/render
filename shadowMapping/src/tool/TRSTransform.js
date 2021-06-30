// Remain rotatation
export class TRSTransform {
  constructor(translate = [0, 0, 0], scale = [1, 1, 1]) {
    this.translate = translate;
    this.scale = scale;
  }
}

export function setTransform(t_x, t_y, t_z, s_x, s_y, s_z) {
  return {
    modelTransX: t_x,
    modelTransY: t_y,
    modelTransZ: t_z,
    modelScaleX: s_x,
    modelScaleY: s_y,
    modelScaleZ: s_z,
  };
}
