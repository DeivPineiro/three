<template>
  <div class="canvas-container">
    <div class="loading-container" v-if="loading">
      <div class="loading">    
        <p class="pt-5">Espere...</p>
      </div>
    </div>  
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script type="module">
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

export default {
  name: 'ThreeCanvas',
  data() {
    return {
      loading: true,
    };
  },
  mounted() {
    this.initThreeJS();
  },

  methods: {
    async initThreeJS() {
      const canvas = this.$refs.canvas;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 80);
      camera.position.set(-2, 30, -55);
      camera.lookAt(-2, 10, 0);

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
      renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;

      await this.loadResources(scene);

      this.setupLights(scene);

      this.animate(renderer, scene, camera);

      window.addEventListener('resize', this.onWindowResize(renderer, camera));
    },

    async loadResources(scene) {
      const gltfLoader = new GLTFLoader();
      const rgbeLoader = new RGBELoader();

      const texture = await new Promise((resolve) => {
        rgbeLoader.load('/assets/MR_INT-005_WhiteNeons_NAD.hdr', resolve);
      });

      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;

      const gltf = await new Promise((resolve) => {
        gltfLoader.load('/static/personaje/sin_nombre.gltf', resolve);
      });

      const model = gltf.scene;
      model.scale.set(0.5, 0.5, 0.5);
      model.position.set(0, 0.1, 0);
      model.rotation.x = Math.PI;

      scene.add(model);

      this.mixer = new THREE.AnimationMixer(model);
      gltf.animations.forEach((clip) => {
        this.mixer.clipAction(clip).play();
      });

      this.loading = false;
    },

    setupLights(scene) {
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(-2, 25, -100);
      directionalLight.castShadow = true;
      scene.add(directionalLight);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
    },

    animate(renderer, scene, camera) {
      const clock = new THREE.Clock();
      const animate = () => {
        if (this.mixer) {
          const deltaTime = clock.getDelta();
          this.mixer.update(deltaTime);
        }
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    },

    onWindowResize(renderer, camera) {
      return () => {
        const width = window.innerWidth / 2;
        const height = window.innerHeight / 2;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
    },
  }
};
</script>

<style scoped>
.canvas-container {
  position: relative;
  width: 50vw;
  height: 50vh;
}

.loading-container {
  position: fixed;
  top: 25%;
  left: 25%;
  width: 50vw;
  height: 50vh;
  z-index: 10; 
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5); 
}

.loading {
  color: white;
  font-size: 2rem;
  text-align: center;
}

canvas {
  background-color: black;
  position: absolute;
  top: 0;
  left: 0;
  width: 50vw;
  height: 50vh;
  z-index: -1; 
  pointer-events: none;
}
</style>
