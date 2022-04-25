import "mind-ar/dist/mindar-image-three.prod.js";
const THREE = window.MINDAR.IMAGE.THREE;

import HMatrix from "@/helpers/HMatrix";

export default {
  state: {
    target_anchor: -1,
    frame_callbacks_stack: [],
    scene: {
      anchors: [],
      scene_anchor: null,
    },
    options: null,
  },
  mutations: {
    updateSceneAnchorMatrix(state) {
      let target_anchor;
      let index;

      state.scene.anchors.forEach((anchor, i) => {
        if (anchor.visible == true) {
          target_anchor = anchor;
          index = i;
        }
      });

      if (!state.scene.scene_anchor || !target_anchor) {
        state.target_anchor = -1;
        state.scene.scene_anchor.visible = false;
        state.scene.scene_anchor.group.visible = false;

        return;
      }

      state.target_anchor = index;
      state.scene.scene_anchor.visible = true;
      state.scene.scene_anchor.group.visible = true;

      let scene_anchor_matrix = state.scene.scene_anchor.group.matrix;
      let target_anchor_matrix = target_anchor.group.matrix;

      scene_anchor_matrix.elements = HMatrix.smoothMatrixChange(
        scene_anchor_matrix.elements,
        target_anchor_matrix.elements
      );
    },
    addFrameCallback(state, cb) {
      state.frame_callbacks_stack.push(cb);
    },
    addLight(state, anchor) {
      const light = new THREE.PointLight(0x404040);
      light.position.set(-40, -120, -40);
      anchor.group.add(light);
    },
  },
  actions: {
    async setUpScene({ state, commit }, options) {
      state.options = options;

      const mindarThree = new window.MINDAR.IMAGE.MindARThree({
        container: document.querySelector("#container"),
        imageTargetSrc: state.options.target,
      });

      const { renderer, scene, camera } = mindarThree;

      let i = 0;

      for (i; i < state.options.contacts.length; i++) {
        state.scene.anchors.push(mindarThree.addAnchor(i));
      }

      state.scene.scene_anchor = mindarThree.addAnchor(i + 1);

      const start = async () => {
        await mindarThree.start();

        renderer.setAnimationLoop(() => {
          state.frame_callbacks_stack.forEach((cb) => cb());

          renderer.render(scene, camera);
        });

        commit("addFrameCallback", () => commit("updateSceneAnchorMatrix"));
      };

      window.requestAnimationFrame(start);

      commit("addLight", state.scene.scene_anchor);
    },
  },
};
