export class ThreeDeClass {
  constructor(THREE, OrbitControls, CANNON) {
    // three
    this.THREE = THREE;
    this.renderer = new THREE.WebGLRenderer();
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this._makeOrbit(OrbitControls);
    this.init();
  }
  init = () => {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.append(this.renderer.domElement);
    this.renderer.setAnimationLoop(this._animate);

    // --------------------
    this.camera.position.set(6, 15, 20);
    this.orbit.update();
    this.createPlane();
    this.createHighlight();
    this.intersectedObjects();
  };

  intersectedObjects = () => {
    const raycaster = new this.THREE.Raycaster();
    const mousePosition = new this.THREE.Vector2();
    let intersectes = []; // the intersected object that mouse will detecte
    this.objects = [];

    window.addEventListener("mousemove", (e) => {
      mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mousePosition, this.camera);
      intersectes = raycaster.intersectObjects(this.scene.children);

      // loop throw each object
      intersectes.forEach((ele) => {
        if (ele.object.name !== "ground") return;
        const highlightPos = new this.THREE.Vector3()
          .copy(ele.point)
          .floor()
          .addScalar(0.5);
        this.highlight.position.set(highlightPos.x, 0, highlightPos.z);
        this.highlight.position.set(highlightPos.x, 0, highlightPos.z);

        const isExist = this.objects.find(
          (obj) =>
            obj.position.x === highlightPos.x &&
            obj.position.z === highlightPos.z
        );
        this.highlight.material.color.setHex(isExist ? 0xff0000 : 0xffffff);
      });

      // change the color of grid if it have an object
    });

    window.addEventListener("mousedown", (e) => {
      intersectes.forEach((ele) => {
        if (ele.object.name !== "ground") return;
        this.createObject(this.highlight.position);
      });
    });
  };

  createPlane = () => {
    const plane = new this.THREE.Mesh(
      new this.THREE.PlaneGeometry(20, 20),
      new this.THREE.MeshBasicMaterial({
        side: this.THREE.DoubleSide,
        visible: false,
      })
    );

    plane.rotateX(-Math.PI * 0.5);
    plane.name = "ground";
    this.scene.add(plane);

    const gridHelper = new this.THREE.GridHelper(20, 20);
    this.scene.add(gridHelper);

    this.plane = plane;
  };

  createObject = (position) => {
    const isExist = this.objects.find(
      (obj) =>
        obj.position.x === position.x &&
        obj.position.y === position.y &&
        obj.position.z === position.z
    );
    if (isExist) return;

    const object = new this.THREE.Mesh(
      new this.THREE.SphereGeometry(0.4, 4, 2),
      new this.THREE.MeshBasicMaterial({
        color: 0xffea00,
        wireframe: true,
      })
    );
    object.position.copy(position);
    this.scene.add(object);
    this.objects.push(object);
    this.highlight.material.color.setHex(0xff0000);
  };

  createHighlight = () => {
    const plane = new this.THREE.Mesh(
      new this.THREE.PlaneGeometry(1, 1),
      new this.THREE.MeshBasicMaterial({
        side: this.THREE.DoubleSide,
        transparent: true,
      })
    );

    plane.rotateX(-Math.PI * 0.5);
    plane.position.set(0.5, 0, 0.5);
    this.scene.add(plane);

    this.highlight = plane;
  };

  helperAxes = () => {
    const helper = new this.THREE.AxesHelper(5);
    this.scene.add(helper);
  };

  makeLight = () => {
    const light = new this.THREE.DirectionalLight(0xffffff);
    this.scene.add(light);
  };
  _makeOrbit = (OrbitControls) => {
    this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
  };
  _animate = (time) => {
    // make the highlighted box flash
    this.highlight.material.opacity = 1 + Math.sin(time / 120);

    // make boxes animate
    this.objects.forEach((object) => {
      object.rotation.x = time / 1000;
      object.rotation.z = time / 1000;
      object.position.y = 0.5 + 0.5 * Math.abs(Math.sin(time / 1000));
    });

    this.highlight.opacity = this.renderer.render(this.scene, this.camera);
  };
}
