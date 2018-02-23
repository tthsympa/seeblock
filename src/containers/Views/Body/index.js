// @flow

import React from 'react';
import * as THREE from 'three';
import { connect } from 'react-redux';
import Lottie from 'react-lottie';
import type { InputState } from 'reduxTypes/input';
import TrackballControls from 'snippets/custom/TrackballControls';
import GPUParticleSystem from 'snippets/custom/GPUParticleSystem';
import AdressModel from 'snippets/custom/AdressModel';
import * as animationData from 'assets/eyeball.json';
import renderIf from 'utils/renderIf';
import styles from './Body.css';

type Props = {
  input: InputState,
};

type State = {

}

const TRESHOLDOFFSET = 3;
const SCALEMAX = 3;
const SCALEMIN = 0.5;
const SCALEZERO = 0.2;
const FOCUSEDSCALE = 1.2;
let INTERSECTED;
let FOCUSED;

// Lerping
let t = 0;
let dt = 0.01;
const lerp = (a, b, c) => a + ((b - a) * c);
const ease = c => (c < 0.5 ? 2 * c * c : -1 + ((4 - (2 * c)) * c));

const createAdressModel = (account: string = 'None', value: number, status: string, from: boolean) => {
  let treshold = 3;
  let step = 1;
  let scale = 0;
  while (value > treshold) {
    step += 1;
    treshold += TRESHOLDOFFSET;
  }
  if (value === 0) {
    scale = SCALEZERO;
  } else {
    scale = value - (SCALEMAX * step);
    if (scale < 1) {
      scale = SCALEMIN;
    }
  }
  const adress = new AdressModel(status, step > 8 ? '8' : step.toString());
  adress.name = account;
  adress.scale.multiplyScalar(scale);

  let randX = Math.random();
  let randZ = Math.random();
  let randY = Math.random();
  randX = randX <= 0.2 ? 0.5 : randX;
  randZ = randZ <= 0.2 ? 0.5 : randZ;
  randY = randY <= 0.2 ? 0.5 : randY;
  adress.position.x = (randX * 200) - 100;
  adress.position.z = from ? -(randZ * 100) : (randZ * 100);
  adress.position.y = (randY * 200) - 100;

  return adress;
};

// eslint-disable-next-line react/prefer-stateless-function
class Body extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.animate = this.animate.bind(this);
  }

  componentDidMount() {
    // Classic
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;
    const clock = new THREE.Clock();
    const scene = new THREE.Scene();
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const tick = 0;
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      1,
      1000,
    );
    camera.position.set(0, 181, 77);

    //  Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor('#FFFFFF');
    renderer.setSize(width, height);

    //    Controls
    const controls = new TrackballControls(camera, this.mount);
    controls.maxDistance = 1000;
    controls.minDistance = 10;
    //  Lights
    const light = new THREE.PointLight('#FFFFFF', 1, 0, 2);
    light.position.set(0, 250, 0);
    const light2 = new THREE.PointLight('#FFFFFF', 1, 0, 2);
    light2.position.set(0, -250, 0);
    scene.add(light);
    scene.add(light2);

    //  Custom
    const adressParticleSystem = new GPUParticleSystem({
      maxParticles: 2000,
    });

    // options passed during each spawned
    const adressParticleOptions = {
      position: new THREE.Vector3(),
      positionRandomness: 0.1,
      velocity: new THREE.Vector3(),
      velocityRandomness: 0.2,
      color: 0x000000,
      colorRandomness: 0.2,
      turbulence: 0.01,
      lifetime: 0.2,
      size: 1,
      sizeRandomness: 0.5,
    };
    const adressSpawnerParticleOptions = {
      spawnRate: 2000,
      horizontalSpeed: 1.5,
      verticalSpeed: 1.33,
      timeScale: 2,
    };

    //    Central sphere & pivot
    const parent = new THREE.Object3D();
    scene.add(parent);
    const pivotFrom = new THREE.Object3D();
    pivotFrom.name = 'from';
    parent.add(pivotFrom);
    const pivotTo = new THREE.Object3D();
    pivotTo.name = 'to';
    const testadress = createAdressModel('none', 5, 'success', false);
    //  pivotTo.add(testadress);
    // pivotTo.add(adressParticleSystem);
    // pivotFrom.add(adressParticleSystem);
    parent.add(pivotTo);
    scene.add(adressParticleSystem);

    //    Central sphere
    const geometry = new THREE.SphereGeometry(2, 16, 8);
    const material1 = new THREE.MeshBasicMaterial({ color: '#4FDE3D', wireframe: true });
    const mesh1 = new THREE.Mesh(geometry, material1);

    parent.add(mesh1);

    //    Assign to this
    this.scene = scene;
    this.raycaster = raycaster;
    this.mouse = mouse;
    this.clock = clock;
    this.camera = camera;
    this.renderer = renderer;
    this.controls = controls;
    this.parent = parent;
    this.pivotFrom = pivotFrom;
    this.pivotTo = pivotTo;
    this.tick = tick;
    this.adressParticleSystem = adressParticleSystem;
    this.adressParticleOptions = adressParticleOptions;
    this.adressSpawnerParticleOptions = adressSpawnerParticleOptions;

    //    test
    this.testadress = testadress;
    //    Starting
    this.mount.appendChild(this.renderer.domElement);
    this.mount.addEventListener('mousedown', this.onDocumentMouseDown, false);
    this.mount.addEventListener('mousemove', this.onDocumentMouseMove, false);
    this.start();
  }

  componentDidUpdate() {
    INTERSECTED = null;
    while (this.pivotFrom.children.length) {
      this.pivotFrom.remove(this.pivotFrom.children[0]);
    }
    while (this.pivotTo.children.length) {
      this.pivotTo.remove(this.pivotTo.children[0]);
    }
    if (!this.pivotFrom.children.length && !this.pivotTo.children.length) {
      // this.pivotFrom.add(this.adressParticleSystem);
      // this.pivotTo.add(this.adressParticleSystem);
      const { data } = this.props.input;
      if (Object.keys(data).length !== 0 && data.constructor === Object) {
        const { from, to } = data;
        to.forEach((v) => {
          this.pivotTo.add(createAdressModel(data.adress, v.value, v.status, false));
        });

        from.forEach((v) => {
          this.pivotFrom.add(createAdressModel(data.adress, v.value, v.status, true));
        });
      }
    }
  }

  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }

  onDocumentMouseMove: Function = (event) => {
    if (INTERSECTED) {
      this.mouse.x = (event.offsetX - (this.mount.clientWidth / 2)) / 3;
      this.mouse.y = (event.offsetY - (this.mount.clientHeight / 2)) / 3;
    } else {
      this.mouse.x = (((event.offsetX) / this.mount.clientWidth) * 2) - 1;
      this.mouse.y = (-((event.offsetY) / this.mount.clientHeight) * 2) + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.scene.children, true);
      if (intersects.length > 0) {
        if (FOCUSED !== intersects[0].object) {
          if (FOCUSED !== null) {
            FOCUSED.parent.scale.divideScalar(FOCUSEDSCALE);
          }
          FOCUSED = intersects[0].object;
          FOCUSED.parent.scale.multiplyScalar(FOCUSEDSCALE);
        }
      } else {
        FOCUSED
          ? FOCUSED.parent.scale.divideScalar(FOCUSEDSCALE)
          : FOCUSED = null;
        FOCUSED = null;
      }
    }
  }

  onDocumentMouseDown: Function = (event) => {
    event.preventDefault();
    this.mouse.x = (((event.offsetX) / this.mount.clientWidth) * 2) - 1;
    this.mouse.y = (-((event.offsetY) / this.mount.clientHeight) * 2) + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    // const arrow = new THREE.ArrowHelper(this.raycaster.ray.direction,
    // this.raycaster.ray.origin, 1000, 0xffff00);
    // this.scene.add(arrow);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);
    if (intersects.length > 0) {
      if (INTERSECTED !== intersects[0].object) {
        INTERSECTED = intersects[0].object;
        const actualPos = INTERSECTED.parent.getWorldPosition();
        this.controls.target = new THREE.Vector3(actualPos.x, actualPos.y, actualPos.z);
        this.controls.enabled = false;
      }
    } else {
      FOCUSED
        ? FOCUSED.parent.scale.divideScalar(FOCUSEDSCALE)
        : FOCUSED = null;
      FOCUSED = null;
      INTERSECTED = null;
      this.controls.target = new THREE.Vector3(0, 0, 0);
      this.controls.enabled = true;
    }
  };

  spawnParticle = (object, pivotName: string) => {
    // Apply lerp to adress with Particle
    const objWorldPos = object.getWorldPosition();
    const a = {
      x: objWorldPos.x,
      y: objWorldPos.y,
      z: objWorldPos.z,
    };
    const b = {
      x: 0,
      y: 0,
      z: 0,
    };
    // If not INTERSECTED == TRUE, dispatch all particle in random
    const newX = lerp(a.x, b.x, ease(t));
    const newY = lerp(a.y, b.y, ease(t));
    const newZ = lerp(a.z, b.z, ease(t));
    this.adressParticleOptions.position.x = newX;
    this.adressParticleOptions.position.y = newY;
    this.adressParticleOptions.position.z = newZ;
    t += dt;
    if (t <= 0 || t >= 1) dt = -dt;

    // SpawnParticle
    const delta = this.clock.getDelta() * this.adressSpawnerParticleOptions.timeScale;
    this.tick += delta;
    if (this.tick < 0) {
      this.tick = 0;
    }
    if (delta > 0) {
      this.adressParticleOptions.color = pivotName === 'to' ? 0x546A7B : 0xD81E5B;
      for (let x = 0; x < this.adressSpawnerParticleOptions.spawnRate * delta; x += 1) {
        this.adressParticleSystem.spawnParticle(this.adressParticleOptions);
      }
    }
    this.adressParticleSystem.update(this.tick);
  };

  //    Declaring important variable
  mount: HTMLDivElement;
  scene: THREE.scene;
  raycaster: THREE.raycaster;
  mouse: THREE.Vector2
  clock: THREE.clock;
  camera: THREE.PerspectiveCamera;
  material: THREE.MeshBasicMaterial;
  controls: THREE.TrackballControls;
  parent: THREE.Object3D
  pivotFrom: THREE.Object3D;
  pivotTo: THREE.Object3D;
  adressParticleSystem: THREE.GPUParticleSystem;
  adressParticleOptions: Object;
  adressSpawnerParticleOptions: Object;
  tick: number
  frameId: number;

  testadress: any;
  start: Function;
  stop: Function;
  animate: Function;

  start() {
    if (!this.frameId) {
      this.frameId = window.requestAnimationFrame(this.animate);
    }
  }

  stop() {
    window.cancelAnimationFrame(this.frameId);
  }

  animate() {
    // Rotation From / To
    this.pivotTo.rotation.z += 0.0004;
    this.pivotFrom.rotation.z -= 0.0004;

    if (INTERSECTED) {
      const { name } = INTERSECTED.parent.parent;
      const actualPos = INTERSECTED.parent.getWorldPosition();
      this.controls.target = new THREE.Vector3(actualPos.x, actualPos.y, actualPos.z);
      this.camera.position.x += (this.mouse.x - this.camera.position.x) * 0.05;
      this.camera.position.y += (-this.mouse.y - this.camera.position.y) * 0.05;
      this.spawnParticle(INTERSECTED.parent, name);
    }
    // ParticleSystem
    this.controls.update();
    this.frameId = window.requestAnimationFrame(this.animate);
    this.renderScene();
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera);
  }

  renderer: THREE.WebGLRenderer;

  render() {
    const config = {
      loop: true,
      autoplay: true,
      animationData,
    };
    const { isLoading } = this.props.input;
    return (
      <div className={styles.container}>
        <div style={{ flex: 3 }}>
          <p>left</p>
        </div>
        <div style={{ flex: 7 }}>
          {
          // eslint-disable-next-line function-paren-newline
          renderIf(isLoading)(
            <div
              className={styles.loader}
            >
              <Lottie
                options={config}
                isStopped={!isLoading}
              />
            </div>)
        }
          <div
            className={styles.draw}
            ref={(mount) => {
              if (mount) {
                const tmp: HTMLDivElement = mount;
                this.mount = tmp;
              }
            }}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ input }) => ({
  input,
});

export default connect(mapStateToProps, null)(Body);
