<template>
  <div id="app">
    <div id="control">
      <button
        class="button"
        :class="{
          button_hidden: scene_active,
        }"
        ref="StartButton"
      >
        Start
      </button>
      <button
        :class="{
          button_hidden: !scene_active,
        }"
        class="button"
        ref="StopButton"
      >
        Stop
      </button>
    </div>
    <div id="container"></div>
    <div
      class="image-container"
      :class="{
        'image-container_active': image_container.active,
      }"
    >
      <button
        class="image-container__toggle button"
        @click="image_container.active = !image_container.active"
      >
        <template v-if="image_container.active"> Close </template>
        <template v-else> GetQR </template>
      </button>
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
  data: () => ({
    main_ancor: null,
    scene_anchor: null,
    frame_callbacks_stack: [],
    image_container: {
      active: false,
    },
    scene_active: false,
  }),
  components: {},
  methods: {
    addFrameCallback(cb) {
      this.frame_callbacks_stack.push(cb);
    },
    smoothMatrixChange(Matrix_1, Matrix_2) {
      return Matrix_2.map((i, k) => {
        return Matrix_1[k] + (i - Matrix_1[k]) / 2;
      });
    },
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
    countAnchors() {
      if (!this.scene_anchor || !this.main_ancor) {
        return;
      }

      this.scene_anchor.visible = this.main_ancor.visible;
      this.scene_anchor.group.visible = this.main_ancor.group.visible;

      let scene_anchor_matrix = this.scene_anchor.group.matrix;
      let main_anchor_matrix = this.main_ancor.group.matrix;

      scene_anchor_matrix.elements = this.smoothMatrixChange(
        scene_anchor_matrix.elements,
        main_anchor_matrix.elements
      );
    },
    setUpScene() {
      const mindarThree = new window.MINDAR.IMAGE.MindARThree({
        container: document.querySelector("#container"),
        imageTargetSrc: "./assets/targets_min.mind",
      });

      const { renderer, scene, camera } = mindarThree;

      this.main_ancor = mindarThree.addAnchor(0);
      this.scene_anchor = mindarThree.addAnchor(1);

      this.addFrameCallback(this.countAnchors);

      const start = async () => {
        await mindarThree.start();

        renderer.setAnimationLoop(() => {
          this.frame_callbacks_stack.forEach((cb) => cb());

          renderer.render(scene, camera);
        });
      };

      const startButton = this.$refs.StartButton;
      const stopButton = this.$refs.StopButton;

      startButton.addEventListener("click", () => {
        start();
        this.scene_active = true;
      });

      stopButton.addEventListener("click", () => {
        mindarThree.stop();
        mindarThree.renderer.setAnimationLoop(null);
        this.scene_active = false;
      });
    },
  },
  mounted() {
    this.setUpScene();
    this.setUpLight(this.scene_anchor);
    this.loadModel("./assets/Object.gltf", (gltf) => {
      let model = gltf.scene;
      model.scale.set(0.5, 0.5, 0.5);
      this.scene_anchor.group.add(model);
    });
  },
};
</script>

<style>
body {
  margin: 0;
}
#container {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  float: right;
}
.image-container {
  width: 300px;
  height: 100vh;
  float: left;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: -300px;
  z-index: 1000;
  box-shadow: 0 0 32px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  transition: 0.5s;
}

.image-container_active {
  left: 0px;
}

.image-container_active .image-container__toggle {
  right: 0;
}

.image-container__image {
  width: 250px;
  overflow: hidden;
  border-radius: 30px;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.2);
}
.image-container__toggle {
  position: absolute;
  top: 0;
  right: -100px;
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

.button_hidden {
  display: none;
}
</style>
