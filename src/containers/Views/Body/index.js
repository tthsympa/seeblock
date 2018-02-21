// @flow

import React from 'react';
import * as THREE from 'three';
import { connect } from 'react-redux';
import Lottie from 'react-lottie';
import type { InputState } from 'reduxTypes/input';
import TrackballControls from 'snippets/custom/TrackballControls';
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

const createAdressModel = (value: number, status: string, from: boolean) => {
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
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000,
    );
    camera.position.set(0, 181, 77);
    camera.lookAt(scene.position);
    camera.position.z -= 20;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor('#FFFFFF');
    renderer.setSize(width, height);

    const controls = new TrackballControls(camera, this.mount);

    const light = new THREE.PointLight('#FFFFFF', 1, 0, 2);
    light.position.set(0, 250, 0);
    const light2 = new THREE.PointLight('#FFFFFF', 1, 0, 2);
    light2.position.set(0, -250, 0);
    scene.add(light);
    scene.add(light2);

    // Custom
    //    Central sphere & pivot
    const parent = new THREE.Object3D();
    scene.add(parent);
    const pivot = new THREE.Object3D();
    parent.add(pivot);

    //    Central sphere
    const geometry = new THREE.SphereGeometry(2, 16, 8);
    const material1 = new THREE.MeshBasicMaterial({ color: '#4FDE3D', wireframe: true });
    const mesh1 = new THREE.Mesh(geometry, material1);

    parent.add(mesh1);
    // scene.add(new THREE.AxesHelper(20));

    //    Assign to this
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.controls = controls;
    this.pivot = pivot;

    //    Starting
    this.mount.appendChild(this.renderer.domElement);
    this.start();
  }

  componentDidUpdate() {
    while (this.pivot.children.length) {
      this.pivot.remove(this.pivot.children[0]);
    }
    if (!this.pivot.children.length) {
      const { data } = this.props.input;
      if (Object.keys(data).length !== 0 && data.constructor === Object) {
        const { from, to } = data;
        to.forEach((v) => {
          this.pivot.add(createAdressModel(v.value, v.status, false));
        });

        from.forEach((v) => {
          this.pivot.add(createAdressModel(v.value, v.status, true));
        });
      }
    }
  }

  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }

  //    Declaring important variable
  mount: HTMLDivElement;
  scene: THREE.scene;
  camera: THREE.PerspectiveCamera;
  material: THREE.MeshBasicMaterial;
  controls: THREE.TrackballControls;
  adress: THREE.Mesh;
  pivot: THREE.Object3D;
  frameId: number;

  start: Function;
  stop: Function;
  animate: Function;
  // createAdressModel: Function;

  start() {
    if (!this.frameId) {
      this.frameId = window.requestAnimationFrame(this.animate);
    }
  }

  stop() {
    window.cancelAnimationFrame(this.frameId);
  }

  animate() {
    this.pivot.rotation.z += 0.0003;
    this.controls.update();
    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
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
          renderIf(isLoading)(<div
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
            ref={(mount) => { this.mount = mount; }}
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
