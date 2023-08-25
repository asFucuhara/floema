import { Mesh, Program, Plane } from 'ogl'

import fragment from '../../shaders/plain-fragment.glsl'
import vertex from '../../shaders/plain-vertex.glsl'

import { gsap } from 'gsap'

export default class Transition {
  constructor ({ collections, details, url, gl, scene, sizes }) {
    this.collections = collections
    this.details = details
    this.gl = gl
    this.scene = scene
    this.sizes = sizes
    this.url = url

    this.geometry = new Plane(this.gl)

    this.createTexture()

    this.extra = {
      x: 0, y: 0
    }
  }

  createTexture () {

  }

  createProgram (texture) {
    this.program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        tMap: { value: texture },
        uAlpha: {
          value: 1
        }
      }
    })
  }

  createMesh (mediaMesh) {
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    })

    this.mesh.position.x = mediaMesh.position.x
    this.mesh.position.y = mediaMesh.position.y
    this.mesh.position.z = mediaMesh.position.z

    this.mesh.scale.x = mediaMesh.scale.x
    this.mesh.scale.y = mediaMesh.scale.y
    this.mesh.scale.z = mediaMesh.scale.z

    this.mesh.position.z = mediaMesh.position.z + 0.01

    this.mesh.setParent(this.scene)

    // this.mesh.rotation.z = gsap.utils.random(-Math.PI * 0.03, Math.PI * 0.03)
  }

  setElement (element) {
    this.transitionFrom = element.id
    const media = element.id === 'collections' ? element.medias[element.index] : element

    this.createProgram(media.texture)
    this.createMesh(media.mesh)
  }

  animate (mesh, onComplete) {
    window.requestAnimationFrame(() => {
      const scale = {
        x: mesh.scale.x,
        y: mesh.scale.y,
        z: mesh.scale.z
      }
      const position = {
        x: mesh.position.x,
        y: mesh.position.y,
        z: mesh.position.z
      }

      gsap.to(this.mesh.position, {
        duration: 1.5,
        ease: 'expo.inOut',
        ...position
      })

      gsap.to(this.mesh.scale, {
        duration: 1.5,
        ease: 'expo.inOut',
        ...scale,
        onComplete: () => {
          this.mesh.setParent(null)
          onComplete()
        }
      })
    })
  }
}
