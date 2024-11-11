<template>
  <div>
    <main>
      <section>
        <img class="back" src="/img/background/backScene1.png" alt="background">
          <ThreeView class="three" />                
      </section>
      </main>
  </div>



</template>

<script>
import ThreeView from '../components/canvas.vue';

export default {
  components: {
    ThreeView,
  }, 
};

</script>

<style>

  body{
    margin: 0;
    background-color: black;
    padding: 0;
  }

.back {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 100vw; 
}

</style>
