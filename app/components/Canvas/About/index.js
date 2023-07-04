import { map } from 'lodash'
import { Transform, Plane } from 'ogl'
import Gallery from './Gallery'

export default class About {
  constructor ({ gl, scene, sizes }) {
    this.gl = gl
    this.group = new Transform()
    this.sizes = sizes

    this.createGeometry()
    this.createGalleries()

    this.group.setParent(scene)

    this.show()
  }

  createGeometry () {
    this.geometry = new Plane(this.gl)
  }

  createGalleries () {
    this.galleriesElements = document.querySelectorAll('.about__gallery')

    this.galleries = map(this.galleriesElements, (element, index) => {
      return new Gallery({
        element,
        geometry: this.geometry,
        index,
        gl: this.gl,
        scene: this.group,
        sizes: this.sizes
      })
    })
  }

  show () {
    map(this.galleries, gallery => gallery.show())
  }

  hide () {
    map(this.galleries, gallery => gallery.hide())
  }

  onResize (event) {
    map(this.galleries, gallery => gallery.onResize(event))
  }

  onTouchDown (event) {
    map(this.galleries, gallery => gallery.onTouchDown(event))

    // this.scrollCurrent.x = this.scroll.x
    // this.scrollCurrent.y = this.scroll.y
  }

  onTouchMove (event) {
    map(this.galleries, gallery => gallery.onTouchMove(event))

    // const xDistance = x.start - x.end
    // const yDistance = y.start - y.end

    // this.x.target = this.scrollCurrent.x - xDistance
    // this.y.target = this.scrollCurrent.y - yDistance
  }

  onTouchUp (event) {
    map(this.galleries, gallery => gallery.onTouchUp(event))
  }

  onWheel ({ pixelX, pixelY }) {
  }

  update (scroll) {
    map(this.galleries, gallery => gallery.update(scroll))
  }

  destroy () {
    map(this.galleries, gallery => {
      gallery.destroy()
    })
  }
}
