import Phaser from 'phaser'
import { gameConfig } from './config'
import GameScene from './GameScene'

const scenes = [GameScene]
const config = {
  ...gameConfig,
  scene: scenes,
}

export function createPhaserGame(parentEl) {
  config.parent = parentEl

  return new Phaser.Game(config)
}