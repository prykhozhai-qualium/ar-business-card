<template>
  <div id="app">
    <a v-if="options" :href="options.contacts[0]" download ref="contact"></a>
    <div id="container"></div>
  </div>
</template>

<script>
import "mind-ar/dist/mindar-image-three.prod.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
const loader = new GLTFLoader();

export default {
  name: "App",
  data: () => ({
    options: null,
  }),
  components: {},
  methods: {
    async loadModel(path) {
      return await loader.loadAsync(path);
    },
    loadContacts() {
      this.$refs.contact.click();
    },
    setUpMainModel(gltf) {
      let model = gltf.scene;
      model.scale.set(0.5, 0.5, 0.5);
      this.$store.state.scene.scene_anchor.group.add(model);
    },
    async loadOptions() {
      return await (
        await fetch("./options.json", {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
      ).json();
    },
  },
  async mounted() {
    console.log();
    let gltf = await this.loadModel("./assets/Object.gltf");
    this.options = await this.loadOptions();

    this.$nextTick(() => {
      this.loadContacts();
      this.$store.dispatch("setUpScene", this.options);
      this.setUpMainModel(gltf);
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
