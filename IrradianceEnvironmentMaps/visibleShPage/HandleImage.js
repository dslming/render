export default class HandleImage {
  constructor(cb) {
    this.handleImage = this.handleImage.bind(this)
    this.images = []
    this.urls = []
    this.cb = cb

    this.nameMap = {
      posx: 0,
      negx: 1,
      posy: 2,
      negy: 3,
      posz: 4,
      negz: 5,
    }
  }

  handleImage(file) {
    const that = this
    const files = file.files
    if (!files) {
      console.error("fail...");
      return
    }
    const name = files[0].name.split(".")[0]
    const suffix = files[0].name.split(".")[1]
    const sufixes = ["jpg","png"]
    if (!sufixes.includes(suffix)) {
       console.error("format fail...");
       return
    }

    const index = that.nameMap[name]
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext("2d")

    var reader = new FileReader();
    reader.readAsDataURL(files[0]);

    reader.onload = function (e) {
      let img = new Image()
      img.onload = function() {
        ctx.drawImage(img, 0, 0, this.width, this.height)
        const imageData = ctx.getImageData(0, 0, this.width, this.height)
        that.images[index] = imageData.data
        console.error(that.images);
      }
      img.src = this.result
      that.urls.push(this.result)
      if (that.urls.length == 6) {
        that.cb && that.cb({
          images: that.images,
          urls: that.urls
        })
      }
    }


  }
}
