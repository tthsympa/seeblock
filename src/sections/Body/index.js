// @flow

import React from 'react'
import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'
import { connect } from 'react-redux'
import Lottie from 'react-lottie'
import type { InputState } from 'reduxTypes/input'
import TrackballControls from 'helpers/TrackballControls'
import GPUParticleSystem from 'helpers/GPUParticleSystem'
import AddressModel from 'helpers/AddressModel'
import * as animationData from 'assets/eyeball.json'
import Infos from './Infos'
import styles from './Body.css'

type Props = {
  input: InputState,
}

type State = {
  selectedAddress: string,
}

const TRESHOLDOFFSET = 6
const RANGEOFFSET = 2
const SCALEMAX = 6
const SCALEMIN = 0.5
const SCALEZERO = 0.2
const FOCUSEDSCALE = 1.2
const CAMERAPOS = { x: 0, y: 180, z: 50 }
let INTERSECTED
let FOCUSED
let CURRENTTIMESTAMP

let t = 0
let dt = 0.01
let tt = 0
const dtt = 0.01

const lerp = (a, b, c) => a + (b - a) * c
const ease = (c) => (c < 0.5 ? 2 * c * c : -1 + (4 - 2 * c) * c)
const isBetween = (x, min, max) => x > min && x <= max
const diff = (c, b) => c - b

const posBasedOnTimestamp = (bTimestamp: number, base: number) => {
  const newVectorInRange = (min: number, max: number, res: number) => {
    const randX = (Math.random() * (res - 0) + 0) / 100
    const randY = (Math.random() * (res - 0) + 0) / 100
    const randZ = (Math.random() * (max + 8 - (min - 8)) + (min - 8)) / 100
    return { vByTime: new THREE.Vector3(randX, randY, randZ), max }
  }
  const max = base + RANGEOFFSET
  const res = diff(CURRENTTIMESTAMP, bTimestamp)
  return isBetween(res, base, max)
    ? newVectorInRange(base, max, res)
    : max >= 100
    ? newVectorInRange(base, max, max)
    : posBasedOnTimestamp(bTimestamp, max)
}

const createAddressModel = (
  id: string | Number = 'None',
  txInfos,
  from: boolean
) => {
  const { value, status, bTimestamp } = txInfos
  let treshold = 3
  let step = 1
  let scale = 0
  while (value > treshold) {
    step += 1
    treshold += TRESHOLDOFFSET
  }
  if (value === 0) {
    scale = SCALEZERO
  } else {
    scale = value - SCALEMAX * step
    if (scale < 1) {
      scale = SCALEMIN
    }
  }
  const address = new AddressModel(
    status,
    step > 8 ? '8' : step.toString(),
    from ? 'from' : 'to'
  )
  address.name = id
  address.scale.multiplyScalar(scale)

  const obj = posBasedOnTimestamp(bTimestamp, 0)
  const { vByTime, max } = obj
  address.position.x = vByTime.x * (100 + max) - max
  address.position.z = from ? -(vByTime.z * 100) : vByTime.z * 100
  address.position.y = vByTime.y * (100 + max) - max

  return address
}

// eslint-disable-next-line react/prefer-stateless-function
class Body extends React.Component<Props, State> {
  state: State = {
    selectedAddress: '',
  }

  constructor(props: Props) {
    super(props)

    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.animate = this.animate.bind(this)
  }

  componentDidMount() {
    // Classic
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight
    const clock = new THREE.Clock()
    const scene = new THREE.Scene()
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    const tick = 0
    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000)
    camera.position.set(CAMERAPOS.x, CAMERAPOS.y, CAMERAPOS.z)
    //  Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setClearColor('#FFFFFF')
    renderer.setSize(width, height)

    //    Controls
    const controls = new TrackballControls(camera, this.mount)
    controls.maxDistance = 800
    controls.minDistance = 10

    //  Lights
    const light = new THREE.PointLight('#FFFFFF', 1, 0, 2)
    light.position.set(0, 250, 0)
    const light2 = new THREE.PointLight('#FFFFFF', 1, 0, 2)
    light2.position.set(0, -250, 0)
    scene.add(light)
    scene.add(light2)

    //  Custom
    const addressParticleSystem = new GPUParticleSystem({
      maxParticles: 2000,
    })

    // options passed during each particle spawn
    const addressParticleOptions = {
      position: new THREE.Vector3(),
      positionRandomness: 0.1,
      velocity: new THREE.Vector3(),
      velocityRandomness: 0.2,
      color: 0x000000,
      colorRandomness: 0.2,
      turbulence: 0.01,
      lifetime: 100,
      size: 1,
      sizeRandomness: 0.5,
    }
    const addressSpawnerParticleOptions = {
      spawnRate: 2000,
      horizontalSpeed: 1.5,
      verticalSpeed: 1.33,
      timeScale: 1,
    }

    //    Central sphere & pivot
    const parent = new THREE.Object3D()
    scene.add(parent)
    const pivotFrom = new THREE.Object3D()
    pivotFrom.name = 'from'
    parent.add(pivotFrom)
    const pivotTo = new THREE.Object3D()
    pivotTo.name = 'to'
    parent.add(pivotTo)

    //    Central sphere
    const originGeometry = new THREE.SphereGeometry(2, 16, 8)
    const originMaterial = new THREE.MeshBasicMaterial({
      color: '#29434e',
      wireframe: true,
    })
    const originMesh = new THREE.Mesh(originGeometry, originMaterial)
    originMesh.name = 'origin'
    parent.add(originMesh)

    //    Assign to this
    this.scene = scene
    this.raycaster = raycaster
    this.mouse = mouse
    this.clock = clock
    this.camera = camera
    this.renderer = renderer
    this.controls = controls
    this.parent = parent
    this.pivotFrom = pivotFrom
    this.pivotTo = pivotTo
    this.tick = tick
    this.addressParticleSystem = addressParticleSystem
    this.addressParticleOptions = addressParticleOptions
    this.addressSpawnerParticleOptions = addressSpawnerParticleOptions

    //    Starting
    this.mount.appendChild(this.renderer.domElement)
    this.mount.addEventListener('mousedown', this.onDocumentMouseDown, false)
    this.mount.addEventListener('mousemove', this.onDocumentMouseMove, false)
    this.start()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.input.isLoading !== this.props.input.isLoading) {
      INTERSECTED = null
      CURRENTTIMESTAMP = Math.floor(Date.now() / 1000)
      while (this.pivotFrom.children.length) {
        this.pivotFrom.remove(this.pivotFrom.children[0])
      }
      while (this.pivotTo.children.length) {
        this.pivotTo.remove(this.pivotTo.children[0])
      }
      if (!this.pivotFrom.children.length && !this.pivotTo.children.length) {
        const { data } = this.props.input
        if (Object.keys(data).length !== 0 && data.constructor === Object) {
          const { from, to } = data
          to.forEach((txInfos) => {
            this.pivotTo.add(createAddressModel(txInfos.address, txInfos, false))
          })

          from.forEach((txInfos) => {
            this.pivotFrom.add(createAddressModel(txInfos.address, txInfos, true))
          })
        }
      }
    }
  }

  componentWillUnmount() {
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
  }

  onDocumentMouseMove: Function = (event) => {
    if (INTERSECTED) {
      this.mouse.x = (event.offsetX - this.mount.clientWidth / 2) / 3
      this.mouse.y = (event.offsetY - this.mount.clientHeight / 2) / 3
    } else {
      this.mouse.x = (event.offsetX / this.mount.clientWidth) * 2 - 1
      this.mouse.y = -(event.offsetY / this.mount.clientHeight) * 2 + 1
      this.raycaster.setFromCamera(this.mouse, this.camera)
      const intersects = this.raycaster.intersectObjects(
        this.scene.children,
        true
      )
      if (intersects.length > 0) {
        if (FOCUSED !== intersects[0].object) {
          if (FOCUSED !== null) {
            FOCUSED.parent.scale.divideScalar(FOCUSEDSCALE)
          }
          FOCUSED = intersects[0].object
          FOCUSED.parent.scale.multiplyScalar(FOCUSEDSCALE)
        }
      } else {
        FOCUSED
          ? FOCUSED.parent.scale.divideScalar(FOCUSEDSCALE)
          : (FOCUSED = null)
        FOCUSED = null
      }
    }
  }

  onDocumentMouseDown: Function = (event) => {
    event.preventDefault()

    this.mouse.x = (event.offsetX / this.mount.clientWidth) * 2 - 1
    this.mouse.y = -(event.offsetY / this.mount.clientHeight) * 2 + 1
    this.raycaster.setFromCamera(this.mouse, this.camera)

    const intersects = this.raycaster.intersectObjects(
      this.scene.children,
      true
    )
    if (intersects.length > 0) {
      if (INTERSECTED !== intersects[0].object) {
        INTERSECTED = intersects[0].object
        const actualPos = INTERSECTED.parent.getWorldPosition()
        this.controls.target = new THREE.Vector3(
          actualPos.x,
          actualPos.y,
          actualPos.z
        )
        this.controls.enabled = false
        this.scene.add(this.addressParticleSystem)
        console.log(INTERSECTED)
        console.log(this.pivotFrom)
        console.log(this.pivotTo)
        if (INTERSECTED) {
          const { uuid, name } = INTERSECTED || {}
          if (name !== 'origin') {
            const selectedAddress = (
              this.pivotFrom.children.find(
                ({ children }) => children[0].uuid === uuid
              ) ||
              this.pivotTo.children.find(
                ({ children }) => children[0].uuid === uuid
              )
            ).name
            this.setState({
              selectedAddress,
            })
          }
        }
      }
    } else {
      if (FOCUSED) {
        FOCUSED.parent.scale.divideScalar(FOCUSEDSCALE)
      }
      if (INTERSECTED) {
        this.unfocus()
      }
      FOCUSED = null
      INTERSECTED = null
    }
  }

  unfocus = () => {
    const target = {
      x: CAMERAPOS.x,
      y: CAMERAPOS.y,
      z: CAMERAPOS.z,
    }

    const startQuaternion = this.camera.quaternion.clone()
    const dummyCamera = this.camera.clone()
    tt = 0
    new TWEEN.Tween(this.camera.position)
      .to(target, 1000)
      .easing(TWEEN.Easing.Cubic.Out)
      .onUpdate((timestamp) => {
        // Smooth to Camera Start Position angle
        THREE.Quaternion.slerp(
          startQuaternion,
          dummyCamera.quaternion,
          this.camera.quaternion,
          timestamp
        )
        // Smooth to Camera Start Target look
        tt += dtt
        this.controls.target.x = lerp(this.controls.target.x, 0, ease(tt))
        this.controls.target.y = lerp(this.controls.target.y, 0, ease(tt))
        this.controls.target.z = lerp(this.controls.target.z, 0, ease(tt))
      })
      .onComplete(() => {
        this.controls = null
        const controls = new TrackballControls(this.camera, this.mount)
        controls.maxDistance = 800
        controls.minDistance = 10
        this.controls = controls
      })
      .start()

    // Remove Particle system if no focus
    this.scene.remove(this.addressParticleSystem)
    // this.selectedAddress = ''
  }

  spawnParticle = (object, pivotName: string) => {
    // Apply lerp to address with Particle
    const objWorldPos = object.getWorldPosition()
    const a = {
      x: objWorldPos.x,
      y: objWorldPos.y,
      z: objWorldPos.z,
    }
    const b = {
      x: 0,
      y: 0,
      z: 0,
    }
    // If not INTERSECTED == TRUE, dispatch all particle in random ?
    const newX = lerp(a.x, b.x, ease(t))
    const newY = lerp(a.y, b.y, ease(t))
    const newZ = lerp(a.z, b.z, ease(t))
    this.addressParticleOptions.position.x = newX
    this.addressParticleOptions.position.y = newY
    this.addressParticleOptions.position.z = newZ
    t += dt
    if (t <= 0 || t >= 1) dt = -dt

    // SpawnParticle
    const delta =
      this.clock.getDelta() * this.addressSpawnerParticleOptions.timeScale
    this.tick += delta
    if (this.tick < 0) {
      this.tick = 0
    }
    if (delta > 0) {
      this.addressParticleOptions.color =
        pivotName === 'to' ? 0xf6ebd7 : 0xdef4ee
      for (
        let x = 0;
        x < this.addressSpawnerParticleOptions.spawnRate * delta;
        x += 1
      ) {
        this.addressParticleSystem.spawnParticle(this.addressParticleOptions)
      }
    }
    this.addressParticleSystem.update(this.tick)
  }

  //    Declaring important variable
  mount: HTMLDivElement
  scene: THREE.scene
  raycaster: THREE.raycaster
  mouse: THREE.Vector2
  clock: THREE.clock
  camera: THREE.PerspectiveCamera
  material: THREE.MeshBasicMaterial
  controls: THREE.TrackballControls
  parent: THREE.Object3D
  pivotFrom: THREE.Object3D
  pivotTo: THREE.Object3D
  addressParticleSystem: THREE.GPUParticleSystem
  addressParticleOptions: Object
  addressSpawnerParticleOptions: Object
  tick: number
  frameId: number

  tween: any
  start: Function
  stop: Function
  animate: Function

  start() {
    if (!this.frameId) {
      this.frameId = window.requestAnimationFrame(this.animate)
    }
  }

  stop() {
    window.cancelAnimationFrame(this.frameId)
  }

  animate(time) {
    // Rotation From / To
    this.pivotTo.rotation.z += 0.0004
    this.pivotFrom.rotation.z -= 0.0004

    TWEEN.update(time)
    if (this.controls) {
      this.controls.update()
    }
    if (INTERSECTED) {
      const { name } = INTERSECTED.parent
      const actualPos = INTERSECTED.parent.getWorldPosition()
      this.controls.target = new THREE.Vector3(
        actualPos.x,
        actualPos.y,
        actualPos.z
      )
      this.camera.position.x += (this.mouse.x - this.camera.position.x) * 0.05
      this.camera.position.y += (-this.mouse.y - this.camera.position.y) * 0.05
      this.camera.position.z +=
        (this.mouse.x + this.camera.position.x + -this.mouse.y) * 0.001

      // ParticleSystem
      this.spawnParticle(INTERSECTED.parent, name)
    }
    this.renderScene()
    this.frameId = window.requestAnimationFrame(this.animate)
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera)
  }

  renderer: THREE.WebGLRenderer

  render() {
    const config = {
      loop: true,
      autoplay: true,
      animationData,
    }
    const { isLoading } = this.props.input
    return (
      <div className={styles.container}>
        <Infos
          input={this.props.input}
          selectedAddress={this.state.selectedAddress}
        />
        <div className={styles.content_canvas}>
          {isLoading && (
            <div className={styles.loader}>
              <Lottie options={config} isStopped={!isLoading} />
            </div>
          )}
          <div
            style={{ display: isLoading ? 'none' : 'block' }}
            className={styles.canvas}
            ref={(mount) => {
              if (mount) {
                const tmp: HTMLDivElement = mount
                this.mount = tmp
              }
            }}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ input }) => ({
  input,
})

export default connect(mapStateToProps, null)(Body)
