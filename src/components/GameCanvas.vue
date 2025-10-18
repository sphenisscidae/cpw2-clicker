<template>
  <div ref="gameContainer" style="cursor: pointer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { createPhaserGame } from '../game'

const gameContainer = ref(null)
let gameInstance = null

onMounted(() => {
  if (gameContainer.value && !gameInstance) {
    gameInstance = createPhaserGame(gameContainer.value)
  }
})

onUnmounted(() => {
  if (gameInstance) {
    gameInstance.destroy(true)
    gameInstance = null
  }
})
</script>

<style scoped>
div[ref='gameContainer'] {
  display: block;
}
</style>