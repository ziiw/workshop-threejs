'use strict';

// -----------------------------
// Imports

import domready from 'domready';
import Webgl from './Webgl';
import Sound from './../build/vendors/sound';
import raf from 'raf';
import dat from 'dat-gui';
import 'gsap';



// -----------------------------
// Locals

let webgl;
let gui;
let button;
let audio;



// -----------------------------
// Methods

function resizeHandler() {
  webgl.resize(window.innerWidth, window.innerHeight);
}

function animate() {
  // Main loop 
  raf(animate);
  
  // Loop stuff
  webgl.render(Sound.getData());
}

function handleKeyUp(e){
  // Space bar
  if(e.keyCode == 32){  
    webgl.showMenu();
  }
}

function handleClick(e) {

  // button.innerText = "Just few secs...";
  let text = document.getElementById("text");
  let start = document.getElementById("start");
  let options = document.getElementById("options");
  let intro = document.getElementById("intro");


  // Kick to intro
  TweenMax.to(text, 1.5, {
    opacity: 0,
    ease: Power4.easeIn
  });  

  // Kick button
  TweenMax.to(start, 1.5, {
    opacity: 0,
    ease: Power4.easeIn
  });  

  // Show gif
  TweenMax.to(options, 1.5, {
    delay: 1,
    opacity: 1,
    ease: Power4.easeIn
  });  

  // kick all intro
  TweenMax.to(intro, 1.5, {
    delay: 5,
    opacity: 0,
    ease: Power4.easeIn
  });

  // Load sound
  setTimeout(function(){
    Sound.load( "./../build/mp3/music6.mp3" ); // music 7
    Sound.on( "start", () => {
      
      audio  = document.getElementById("audioSource");
      Sound.player.addEventListener("ended", endExp);
      // Sound.player.currentTime = 150;
      // Let's play
      animate();
    })
  }, 6500);
}

function expIntro() {

  let spans = document.querySelectorAll("h1 > span");

  let t1 = new TimelineMax({paused: true});
  let rand = Math.floor(Math.random() * 3) + 4;

  for(let i = 0; i < spans.length; i++){
    
    t1.addLabel("anim"+i, "-="+i/rand);

    t1.add(new TweenMax.fromTo(spans[i], 1, {
      height: 0,
      scaleY: 0.5
    },
    {
      height: 65,
      scaleY: 1,
      ease: Power4.easeOut
    }), "anim"+i);

  }

  t1.play();
}

function endExp() {
  webgl.showMenu();
}

// function replay(){
//   webgl.showMenu();
//   webgl.blurPass.params.delta = -60;
//   webgl.intro = true;
// }


// -----------------------------
// Core

domready(() => {

  // -----------------------------
  // GUI settings

  // gui = new dat.GUI();
  
  // -----------------------------
  // WebGL settings
  webgl = new Webgl(window.innerWidth, window.innerHeight, gui);
  document.body.appendChild(webgl.renderer.domElement);
  // gui.add(webgl, 'usePostprocessing');


  // -----------------------------
  // Events

  // let replay = document.getElementById("replay");
  button = document.getElementById("start");

  // replay.addEventListener("click", replay);
  button.addEventListener("click", handleClick);
  window.addEventListener("keyup", handleKeyUp);
  window.onresize = resizeHandler;
  resizeHandler();


  expIntro();
});