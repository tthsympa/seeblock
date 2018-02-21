/* eslint-disable */

import * as THREE from 'three';

const AdressModel = function(status: string) {
  // Run the Group constructor with the given arguments
  THREE.Group.apply(this, arguments);

  const colors = {
    pending: '#f5a162',
    success: '#47689B',
  };

  const addNoise = (geometry, noiseX, noiseY, noiseZ) => {
    const nX = noiseX || 2;
    const nY = noiseY || noiseX;
    const nZ = noiseZ || noiseY;
    for (let i = 0; i < geometry.vertices.length; i += 1) {
      const v = geometry.vertices[i];
      v.x += (-nX / 2) + (Math.random() * nX);
      v.y += (-nY / 2) + (Math.random() * nY);
      v.z += (-nZ / 2) + (Math.random() * nZ);
    }
    return geometry;
  };

  const adress = new THREE.Mesh(
    addNoise(new THREE.OctahedronGeometry(12, 1), 4, 8, 2),
    new THREE.MeshStandardMaterial({
      color: colors[status],
      transparent: true,
      flatShading: THREE.FlatShading,
      metalness: 0,
      roughness: 0.8,
    }),
  );
  adress.rotateZ(Math.random() * Math.PI * 0.5);
  adress.rotateY(Math.random() * Math.PI * 0.5);
  this.add(adress);
};

const updateRotation = function() {
  this.rotationPosition += this.rotationSpeed;
  this.rotation.y = (Math.sin(this.rotationPosition));
};

AdressModel.prototype = Object.create(THREE.Group.prototype);
AdressModel.prototype.constructor = AdressModel;
AdressModel.prototype.updateRotation = updateRotation;

export default AdressModel;
