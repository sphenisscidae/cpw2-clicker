// src/game/GameScene.js

import Phaser from 'phaser'
import Player from './objects/Player'
import AnimationManager from './managers/AnimationManager'
import MapManager from './managers/MapManager'

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })

    this.player = null
    this.map = null
    this.highlightGraphics = null
    this.config = {
      highlight: { x: -2, y: 9, z: 1000 },
      visualPointerOffsetY: -5,
    }
  }

  preload() {
    this.load.image('room_tileset', 'assets/tileset.png')
    this.load.tilemapTiledJSON('room_map', 'assets/map.tmj')
    this.load.spritesheet('player_idle', '/assets/player_idle_spritesheet.png', {
      frameWidth: 460,
      frameHeight: 460,
    })
    this.load.spritesheet('player_walk', 'assets/player_walk_spritesheet.png', {
      frameWidth: 460,
      frameHeight: 460,
    })
  }

  create() {
    // Instancia AnimationManager e cria as animações do jogador
    new AnimationManager(this).createPlayerAnimations()

    // Monta o mapa usando MapManager.js
    const mapManager = new MapManager(this)
    this.map = mapManager.createMap('room_map', 'room_tileset', 'tileset') // 'tileset' é o nome no Tiled
    const overlayLayer = mapManager.getLayer('Overlay')

    // Cria o jogador no centro do mapa
    const centerX = this.map.widthInPixels / 2
    const centerY = this.map.heightInPixels / 2
    this.player = new Player(this, centerX, centerY)

    // Adiciona o colisor entre o jogador e a camada de overlay.
    if (overlayLayer) {
      this.physics.add.collider(this.player, overlayLayer)
    }

    // Configura a câmera para seguir o jogador
    this.cameras.main.setZoom(2)
    this.cameras.main.startFollow(this.player)

    // Highlight do tile sob o cursor e configuração de input do mouse
    this.highlightGraphics = this.add.graphics().setDepth(this.config.highlight.z)
    this.input.on('pointerdown', this.handlePointerDown, this)
  }

  // Clique do mouse nos tiles
  handlePointerDown(pointer) {
    const worldPoint = pointer.positionToCamera(this.cameras.main)
    const tile = this.map.getTileAtWorldXY(
      worldPoint.x,
      worldPoint.y - this.config.visualPointerOffsetY,
      true,
      this.cameras.main,
      'Chao',
    )
    if (tile) {
      this.player.moveTo(tile)
    }
  }

  update() {
    if (this.player) {
      this.player.update()
    }
    this.updateHighlight()
  }

  updateHighlight() {
    const pointer = this.input.activePointer
    const worldPoint = pointer.positionToCamera(this.cameras.main)
    const hoverTile = this.map.getTileAtWorldXY(
      worldPoint.x,
      worldPoint.y - this.config.visualPointerOffsetY,
      true,
      this.cameras.main,
      'Chao',
    )

    this.highlightGraphics.clear()
    if (hoverTile) {
      const { x, y } = this.config.highlight
      const tileWidth = this.map.tileWidth
      const tileHeight = this.map.tileHeight
      const points = [
        { x: hoverTile.pixelX + x + tileWidth / 2, y: hoverTile.pixelY + y },
        { x: hoverTile.pixelX + x + tileWidth, y: hoverTile.pixelY + y + tileHeight / 2 },
        { x: hoverTile.pixelX + x + tileWidth / 2, y: hoverTile.pixelY + y + tileHeight },
        { x: hoverTile.pixelX + x, y: hoverTile.pixelY + y + tileHeight / 2 },
      ]

      this.highlightGraphics.lineStyle(2, 0xffffff, 1).strokePoints(points, true)
    }
  }
}