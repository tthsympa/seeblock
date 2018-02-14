import * as THREE from 'three'

const AddressModel = function (status: string, step: string, source: string) {
  // Run the Group constructor with the given arguments
  THREE.Group.apply(this, arguments)

  const colors = {
    '1': '#CBD1F2',
    '2': '#6EA3D5',
    '3': '#448F2A',
    '4': '#F7D048',
    '5': '#F4A73C',
    '6': '#EA518C',
    '7': '#442197',
  }
  const config = {
    pending: {
      detail: 1,
    },
    success: {
      detail: 0,
    },
  }
  const addNoise = (geometry, noiseX, noiseY, noiseZ) => {
    const nX = noiseX || 2
    const nY = noiseY || noiseX
    const nZ = noiseZ || noiseY
    for (let i = 0; i < geometry.vertices.length; i += 1) {
      const v = geometry.vertices[i]
      v.x += -nX / 2 + Math.random() * nX
      v.y += -nY / 2 + Math.random() * nY
      v.z += -nZ / 2 + Math.random() * nZ
    }
    return geometry
  }
  const RADIUS = 12
  const geometry =
    source === 'from'
      ? addNoise(
          new THREE.OctahedronGeometry(RADIUS, config[status].detail),
          4,
          8,
          2
        )
      : addNoise(new THREE.DodecahedronGeometry(8, 0), 1, 2, 4)

  let material
  if (step !== '8') {
    material = new THREE.MeshStandardMaterial({
      color: colors[step],
      transparent: true,
      flatShading: THREE.FlatShading,
      metalness: 0,
      roughness: 0.8,
    })
  } else {
    material = new THREE.MeshBasicMaterial({
      color: '#FFFFFF',
      vertexColors: THREE.VertexColors,
    })
    let point
    let color, face, numberOfSides, vertexIndex
    const faceIndices = ['a', 'b', 'c', 'd']
    for (let i = 0; i < geometry.faces.length; i++) {
      face = geometry.faces[i]
      numberOfSides = face instanceof THREE.Face3 ? 3 : 4
      for (let j = 0; j < numberOfSides; j++) {
        vertexIndex = face[faceIndices[j]]
        point = geometry.vertices[vertexIndex]
        color = new THREE.Color('#FFFFFF')
        color.setRGB(
          0.5 + point.x / RADIUS,
          0.5 + point.y / RADIUS,
          0.5 + point.z / RADIUS
        )
        face.vertexColors[j] = color
      }
    }
  }

  const address = new THREE.Mesh(geometry, material)
  address.rotateZ(Math.random() * Math.PI * 0.5)
  address.rotateY(Math.random() * Math.PI * 0.5)
  this.add(address)
}

AddressModel.prototype = Object.create(THREE.Group.prototype)
AddressModel.prototype.constructor = AddressModel

export default AddressModel
