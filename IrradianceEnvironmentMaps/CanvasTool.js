export default class CanvasTool {
  static rgbToHex(c) {
    const [r, g, b, a] = c
    return ((r << 16) | (g << 8) | b).toString(16);
  }

  static hexToRgba(hex) {
    let ret = []
    ret[0] = parseInt("0x" + hex.slice(0, 2))
    ret[1] = parseInt("0x" + hex.slice(2, 4))
    ret[2] = parseInt("0x" + hex.slice(4, 6))
    return ret
  }

  static colorEquals(color1, color2, tolerance) {
    let diff = 0;
    diff = Math.abs(parseInt('0x' + color1) - parseInt('0x' + color2))
    return diff > tolerance
  }

  static getPixelColor(x, y, w,d) {
    var color = []
    color[0] = d[(y * w + x) * 4]
    color[1] = d[(y * w + x) * 4 + 1]
    color[2] = d[(y * w + x) * 4 + 2]
    color[3] = d[(y * w + x) * 4 + 3]
    return color
  }

  static setPixel({ x, y, canvas, color,ctx }) {
    const w = canvas.width
    const bitmap = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const d = bitmap.data
    d[(y * w + x) * 4 + 0] = color[0]
    d[(y * w + x) * 4 + 1] = color[1]
    d[(y * w + x) * 4 + 2] = color[2]
    d[(y * w + x) * 4 + 3] = color[3]
  }
}
