import * as THREE from "three";
import * as CANNON from "cannon-es";

import { ThreeDeClass } from "./main";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const main = new ThreeDeClass(THREE, OrbitControls, CANNON);

window.addEventListener("click", (e) => {
  // main.createBall(intersectionPoint);
});
