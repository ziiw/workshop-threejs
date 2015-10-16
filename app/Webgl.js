'use strict';

// -----------------------------
// Imports

import THREE from 'three';
window.THREE = THREE;

import Cube from './objects/Cube';
import Tween from 'gsap';




// -----------------------------
// Constant

const _cubeSize  = 200;
const _totalRows = 50;

export default class Webgl {

  constructor(width, height, gui) {

    // Scene
    this.scene      = new THREE.Scene();
    this.scene.fog  = new THREE.FogExp2( 0xffffff, 0.00025) // 0.0003

    // Camera
    this.camera = new THREE.PerspectiveCamera(50, width / height, 1, 100000);
      // avancement
    this.camera.position.y = -5500;
      // hauteur
    this.camera.position.z = 500
    this.camera.rotation.x = 90 * Math.PI / 180

    // Renderer
    this.renderer                   = new THREE.WebGLRenderer( { antialias: false, alpha: true } )
    this.renderer.shadowMapEnabled  = true;
    this.renderer.shadowMapType     = THREE.PCFSoftShadowMap;
    this.renderer.setPixelRatio( window.devicePixelRatio )
    this.renderer.setClearColor( 0xffffff, 1 );

    // PostProcessing
    this.usePostprocessing = true;
    this.composer = new WAGNER.Composer(this.renderer);
    this.composer.setSize(width, height);



    
    // -----------------------------
    // Init

    this.allCubes       = [];
    this.allCubesLength = 0;
    this.nextLineToMove = 0;
    this.distanceMax    = 0;
    this.intro          = true;
    this.menuOpen       = false;
    this.deltaCam       = 1;
    this.gui            = gui;


    // -----------------------------
    // GUI

    // this.gui.add(this.camera.rotation, "z").min(0).max(6).step(0.001);
    // this.gui.add(this.camera.rotation, "x").min(-2).max(2).step(0.001);


    this.initPostprocessing();
    this.createObjects()
  }

  initPostprocessing() {
    if (!this.usePostprocessing) return;

    this.blurPass = new WAGNER.BoxBlurPass();
    this.blurPass.params.delta.x = -60;
    // this.blurPass.params.delta.y = 100;

    // this.gui.add(this.blurPass.params.delta, 'x').min(-100).max(100).step(1);
    // this.gui.add(this.blurPass.params.delta, 'y').min(-100).max(100).step(1);
  }

  resize(width, height) {
    this.composer.setSize(width, height);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  createObjects() {
    // -----------------------------
    // Cubes
    let size    = {}
        size.x  = window.innerWidth / 5
        size.y  = _cubeSize
        size.z  = 1

    // largeur
    for (var i = 0; i < 9; i++) {
      
      let column = [];
      let type;

      switch(i){
        case 0:
        case 8:
          type = 0;
          break;

        case 1:
        case 7:
          type = 1;
          break;

        case 2:
        case 6:
          type = 2;
          break;

        case 3:
        case 5:
          type = 3;
          break;

        case 4:
          type = 4;
          break;
      }

      // longueur
      for (var j = 0; j < _totalRows; j++) {
        
        let pairsCube = {}

        // sol
        pairsCube.ground                = new Cube(size, type);
        pairsCube.ground.castShadow     = true;
        pairsCube.ground.receiveShadow  = true;
        pairsCube.ground.position.set(((i+1) * (window.innerWidth/5) - window.innerWidth), j*(size.y + 400), 0)
        this.scene.add(pairsCube.ground)

        // plafond
        pairsCube.sky               = new Cube(size, type)
        pairsCube.sky.castShadow    = true;
        pairsCube.sky.receiveShadow = true;
        pairsCube.sky.position.set(((i+1) * (window.innerWidth/5) - window.innerWidth), j*(size.y + 400), 1000)
        this.scene.add(pairsCube.sky)


        column.push(pairsCube);

        this.distanceMax = j*(size.y + 400);
      }

      this.allCubes.push(column);
    }

    this.allCubesLength = this.allCubes.length;

    // Debug
    // console.log(this.allCubes);
    // console.log("Distance max: ", this.distanceMax);


    // -----------------------------
    // Lights

    // Debug
    // var geometry = new THREE.SphereGeometry( 50, 32, 32 );
    // var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    // var sphere = new THREE.Mesh( geometry, material );
    // sphere.position.set(0,400,100);
    // this.scene.add( sphere );

    this.directionalLight = new THREE.DirectionalLight( 0x222222, 1 );
    this.directionalLight.position.set( 0, 0, 500 )
    this.directionalLight.castShadow = true
    this.directionalLight.shadowDarkness = 0.5;
    this.scene.add(this.directionalLight);

    this.directionalLightClone = new THREE.DirectionalLight( 0x222222, 1 );
    this.directionalLightClone.position.set(0, 0, 400 );
    this.directionalLightClone.target = this.camera;
    this.directionalLightClone.shadowDarkness = 0.5;
    this.directionalLightClone.castShadow = true;
    this.scene.add(this.directionalLightClone);
  }

  showMenu(){
    let audio = window.source.mediaElement;
    let pauseMenu = document.getElementById("pause");
    let canvas = document.querySelectorAll("canvas");

    if(!this.menuOpen){

      // Fade sound
      Tween.to(audio, 2.5, {
        delay: 0.5,
        volume: 0,
        ease: Power4.easeOut,
        onComplete: function(){
          if(!this.menuOpen){
            audio.pause();
          }
        }
      });

      // Slow down
      Tween.to(this, 1.5, {
        deltaCam: 0.2,
        ease: Power2.easeIn
      });

      // Blur
      Tween.to(this.blurPass.params.delta, 3, {
        delay: 0.5,
        y: -80,
        ease: Power4.easeInOut
      });

      // reduce opacity
      Tween.to(canvas, 1.5, {
        opacity: 0.2,
        ease: Power4.easeIn
      });      

      // Show text
      Tween.to(pauseMenu, 2.5, {
        opacity: 1,
        ease: Power4.easeIn
      });

      this.menuOpen = true;
    }else{
      
      // Fade sound
      audio.play();

      Tween.to(audio, 2.5, {
        volume: 1,
        ease: Power4.easeIn
      });

      // Accelerate
      Tween.to(this, 2, {
        delay: 0.5,
        deltaCam: 1,
        ease: Power4.easeInOut
      });

      // reduce opacity
      Tween.to(canvas, 1.5, {
        opacity: 1,
        ease: Power4.easeIn
      });      

      // Show text
      Tween.to(pauseMenu, 1.5, {
        opacity: 0,
        ease: Power4.easeIn
      });

      Tween.to(this.blurPass.params.delta, 3, {
        delay: 0.5,
        y: 0,
        ease: Power4.easeInOut
      });

      this.menuOpen = false;
    } 
  }

  infiniteGround(camPosition) {
    
    let currentCubePos  = this.allCubes[0][this.nextLineToMove].ground.position.y;

    // If camera pass a line
    if(camPosition >= currentCubePos){
      
      // Update position for one line
      for (var i = 0; i < 9 ; i++) {

        // Add the cube size to the distance max
        this.allCubes[i][this.nextLineToMove].ground.position.y += this.distanceMax;
        this.allCubes[i][this.nextLineToMove].sky.position.y    += this.distanceMax;
      }

      // Use for test only one line and not the whole tab of cube
      if(this.nextLineToMove == _totalRows - 1){
        this.nextLineToMove = 0
      }else{
        this.nextLineToMove ++;
      }
    }
  }

  render(data) {
    if (this.usePostprocessing) {
      this.composer.reset();
      this.composer.renderer.clear();
      this.composer.render(this.scene, this.camera);
      // this.composer.pass(this.vignette2Pass);
      this.composer.pass( this.blurPass );
      this.composer.toScreen();
    } else {
      this.renderer.autoClear = false;
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
    }

    if(this.intro){
      this.camera.position.y = -5500;
      Tween.to(this.blurPass.params.delta, 4.5, {
        x: 0,
        ease: Power4.easeInOut
      });

      this.intro = false;
    }

    this.camera.position.y += 25 * this.deltaCam;
    this.directionalLightClone.position.set(0, this.camera.position.y, 400 );
    this.infiniteGround(this.camera.position.y);

    for (var i = 0; i < this.allCubesLength; i++) {
      for (var j = 0; j < _totalRows; j++) {
        this.allCubes[i][j].ground.update(data);
        this.allCubes[i][j].sky.update(data);
      }
    }
  }
}