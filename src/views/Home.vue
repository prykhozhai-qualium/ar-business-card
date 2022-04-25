<template>
  <div class="home">
    <a
      v-if="options"
      :href="options.contacts[contact]"
      download
      ref="contact"
    ></a>
    <div id="container"></div>
  </div>
</template>

<script>
import "mind-ar/dist/mindar-image-three.prod.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
const loader = new GLTFLoader();
import axios from "axios";

export default {
  name: "App",
  data: () => ({
    options: null,
    contact: 0,
  }),
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
    async setUp() {

      let id = location.href.split("/")[location.href.split("/").length - 1];

      let response = await axios.get(
        `https://qr.qualium-systems.com/api/v1/users/${id}/files/`,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        }
      );

      if (response && response.data) {
        this.options = {
          gltf: "./assets/Object.gltf",
          target: response.data.targetLink,
          contacts: [response.data.vcfLink]
        };

        let gltf = await this.loadModel(this.options.gltf);

        this.$nextTick(async () => {
          this.loadContacts();
          await this.$store.dispatch("setUpScene", this.options);
          this.setUpMainModel(gltf);
        });
      }
    },
  },
  async mounted() {
    await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    this.setUp();
  },
};
</script>

<style>
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
