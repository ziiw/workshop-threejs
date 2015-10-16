'use strict';

import THREE from 'three';
import Tween from 'gsap';

export default class Cube extends THREE.Object3D {
  constructor(size, type) {
    super();

    this.geom = new THREE.BoxGeometry(size.x, size.y, size.z);
    this.mat = new THREE.MeshLambertMaterial({
      color: 0xFFFFFF,
      vertexColors: THREE.FaceColors,
      wireframe: false
    });
    this.mesh = new THREE.Mesh(this.geom, this.mat);
    this.type = type;

    // for (var i = 0; i < this.geom.faces.length; i++) {
    //   this.geom.faces[i].color.setRGB(200,200,200);
    // }

    this.add(this.mesh);
  }

  update(data) {
    if(!this.type && this.type != 0){
      return;
    }

    let val = 1;
    let rand = Math.random() * 100;

    // Lets do some moyennes !

    switch(this.type){
      case 0:
        val = ((data.freq[5] / 255) * 1000) + 1;
        break;

      case 1:
        val = ((data.freq[10] / 255) * 850) + 1;
        break;

      case 2:
        val = ((data.freq[99] / 255) * 650) + 1;
        break;

      case 3:
        val = ((data.freq[170] / 255) * 400) + 1;
        break;

      case 4:
        val = ((data.freq[130] / 255) * 950) + 1;
        break;
    }

    // Tween.to(this.scale, 0.1, {
    //   z: val,
    //   ease: Power2.easeOut
    // });
    this.scale.set(1,1,val);
  }
}