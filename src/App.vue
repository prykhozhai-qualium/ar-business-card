<template>
  <div id="app">
    <div id="control">
      <button class="button" ref="StartButton">Start</button>
      <button class="button" ref="StopButton">Stop</button>
    </div>
    <div id="container"></div>
    <div class="image-container">
      <img class="image-container__image" src="assets/target.jpg" alt="" />
    </div>
  </div>
</template>

<script>
import "mind-ar/dist/mindar-image-three.prod.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
const THREE = window.MINDAR.IMAGE.THREE;
const loader = new GLTFLoader();

export default {
  name: "App",
  components: {},
  methods: {
    loadModel(path, cb) {
      loader.load(
        path,
        function (gltf) {
          cb(gltf);
        },
        function (xhr) {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        function (error) {
          console.log("An error happened", error, path);
        }
      );
    },
    setUpLight(anchor) {
      const light = new THREE.PointLight(0x404040);
      light.position.set(-40, -120, -40);
      anchor.group.add(light);
    },
    setUpScene() {
      const mindarThree = new window.MINDAR.IMAGE.MindARThree({
        container: document.querySelector("#container"),
        imageTargetSrc: "./assets/targets_min.mind",
      });

      const { renderer, scene, camera } = mindarThree;

      const anchor = mindarThree.addAnchor(0);

      const start = async () => {
        await mindarThree.start();

        renderer.setAnimationLoop(() => {
          renderer.render(scene, camera);
        });
      };

      const startButton = this.$refs.StartButton;
      const stopButton = this.$refs.StopButton;

      startButton.addEventListener("click", () => {
        start();
      });

      stopButton.addEventListener("click", () => {
        mindarThree.stop();
        mindarThree.renderer.setAnimationLoop(null);
      });

      return anchor;
    },
  },
  mounted() {
    let anchor = this.setUpScene();
    this.setUpLight(anchor);
    this.loadModel("./assets/Object.gltf", (gltf) => {
      let model = gltf.scene;
      model.scale.set(0.5, 0.5, 0.5);
      anchor.group.add(model);
    });
  },
};
</script>

<style>
body {
  margin: 0;
}
#container {
  width: calc(100vw - 400px);
  height: 100vh;
  position: relative;
  overflow: hidden;
  float: right;
}
.image-container {
  width: 400px;
  height: 100vh;
  float: left;
  display: flex;
  align-items: center;
}

.image-container__image {
  width: 250px;
}
#control {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

button {
  border: 0;
  background-color: white;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  color: black;
  font-weight: bold;
  padding: 8px 20px;
  margin: 4px 4px 16px 4px;
}
</style>
