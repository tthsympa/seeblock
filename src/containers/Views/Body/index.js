// @flow

import React from 'react';
import * as THREE from 'three';
import { connect } from 'react-redux';
import type { InputState, AdressDatas } from 'reduxTypes/input';
import TrackballControls from 'snippets/custom/TrackballControls';
import AdressModel from 'snippets/custom/AdressModel';
import styles from './Body.css';

type Props = {
  input: InputState,
};

type State = {

}

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
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const controls = new TrackballControls(camera, this.mount);

    const light = new THREE.PointLight('#FFFFFF');
    light.position.set(0, 250, 0);
    scene.add(light);

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
    scene.add(new THREE.AxesHelper(20));

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
        to.forEach((v, key) => {
          const adress = new AdressModel(v.status);
          let rand = Math.random();
          rand = rand <= 0.05 ? 0.1 : rand;
          adress.position.x = (Math.random() * 200) - 100;
          adress.position.z = (rand * 100);
          adress.position.y = (Math.random() * 200) - 100;
          let scale = v.value / 10;
          if (scale <= 0) {
            scale = 0.3;
          }
          console.log(v.value);
          adress.scale.multiplyScalar(scale);
          this.pivot.add(adress);
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
    return (
      <div className={styles.container}>
        <div style={{ flex: 3 }}>
          <p>left</p>
        </div>
        <div style={{ flex: 7 }}>
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
