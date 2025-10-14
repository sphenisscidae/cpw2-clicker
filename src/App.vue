<script setup>
import GameCanvas from './components/GameCanvas.vue'
</script>

<template>
  <section class="section">
    <div class="container">
      <h1 class="title has-text-centered">Teste Render Isométrico</h1>
      <p class="subtitle has-text-centered">UI com Vue.js + Bulma</p>

      <div class="game-wrapper">
        <GameCanvas />
      </div>
    </div>
  </section>
</template>

<style scoped>
.game-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  padding: 1rem;
}
</style>
