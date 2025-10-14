<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Phaser from 'phaser'

const gameContainer = ref(null)
let gameInstance = null

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })

    // Estado
    this.targetTile = null
    this.isMoving = false
    this.highlightGraphics = null
    this.hoveredTile = null
    this.currentAnimation = null
    this.lastDirection = 'down'; // Direção inicial do player

    // Configurações de offset
    this.config = {
      player: {
        x: 0,
        y: -15,
        z: 1
      },
      highlight: {
        x: -2,
        y: 9,
        z: 1000
      },
      visualPointerOffsetY: -5
    }

    // Configurações de animação
    this.animationConfig = {
      idle: {
        up: { start: 32, end: 39},
        down: { start: 0, end: 7 },
        left: { start: 16, end: 23 },
        right: { start: 16, end: 23 },
        upRight: { start: 24, end: 31 },
        downRight: { start: 8, end: 15 },
        upLeft: { start: 24, end: 31 },
        downLeft: { start: 8, end: 15 }
      },
      walk: {
        up: { start: 24, end: 29 }, // Diagonal para cima-esquerda
        down: { start: 0, end: 5 }, // Diagonal para baixo-esquerda
        left: { start: 12, end: 17 }, // Esquerda
        right: { start: 12, end: 17 }, // Direita (flip da esquerda)
        upRight: { start: 18, end: 23 }, // Diagonal para cima-direita (flip da up)
        downRight: { start: 6, end: 11 }, // Diagonal para baixo-direita (flip da down)
        upLeft: { start: 18, end: 23 }, // Diagonal para cima-esquerda
        downLeft: { start: 6, end: 11 } // Diagonal para baixo-esquerda
      }
    }
  }

  preload() {
    this.load.image('room_tileset', 'assets/tileset.png')
    this.load.tilemapTiledJSON('room_map', 'assets/map.tmj')
    this.load.spritesheet('player_idle', '/assets/player_idle_spritesheet.png', {
      frameWidth: 460,
      frameHeight: 460,
    });
    this.load.spritesheet('player_walk', 'assets/player_walk_spritesheet.png', {
      frameWidth: 460,
      frameHeight: 460,
    });
  }

  create() {
    this.map = this.make.tilemap({ key: 'room_map' })
    this.tileset = this.map.addTilesetImage('tileset', 'room_tileset')
    this.groundLayer = this.map.createLayer('Chao', this.tileset, 0, 0)
    this.groundLayer.setDepth(0);
    this.groundOverLayer = this.map.createLayer('Overlay', this.tileset, 0, 0)
    this.groundOverLayer.setDepth(0.5);

    const centerX = this.map.widthInPixels / 2;
    const centerY = this.map.heightInPixels / 2;

    this.player = this.physics.add.sprite(centerX, centerY, 'player_idle');
    this.player.body.setSize(200, 300)
    this.player.setOrigin(0.5, 0.5)
    this.player.setDepth(this.config.player.z)
    this.player.setDisplaySize(40, 40);

    // Animações
    this.anims.create({
      key: 'idle_up',
      frames: this.anims.generateFrameNumbers('player_idle', {
        start: this.animationConfig.idle.up.start,
        end: this.animationConfig.idle.up.end
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'idle_down',
      frames: this.anims.generateFrameNumbers('player_idle', {
        start: this.animationConfig.idle.down.start,
        end: this.animationConfig.idle.down.end
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'idle_left',
      frames: this.anims.generateFrameNumbers('player_idle', {
        start: this.animationConfig.idle.left.start,
        end: this.animationConfig.idle.left.end
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'idle_right',
      frames: this.anims.generateFrameNumbers('player_idle', {
        start: this.animationConfig.idle.right.start,
        end: this.animationConfig.idle.right.end
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'idle_upRight',
      frames: this.anims.generateFrameNumbers('player_idle', {
        start: this.animationConfig.idle.upRight.start,
        end: this.animationConfig.idle.upRight.end
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'idle_downRight',
      frames: this.anims.generateFrameNumbers('player_idle', {
        start: this.animationConfig.idle.downRight.start,
        end: this.animationConfig.idle.downRight.end
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'idle_upLeft',
      frames: this.anims.generateFrameNumbers('player_idle', {
        start: this.animationConfig.idle.upLeft.start,
        end: this.animationConfig.idle.upLeft.end
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'idle_downLeft',
      frames: this.anims.generateFrameNumbers('player_idle', {
        start: this.animationConfig.idle.downLeft.start,
        end: this.animationConfig.idle.downLeft.end
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'walk_up',
      frames: this.anims.generateFrameNumbers('player_walk', {
        start: this.animationConfig.walk.up.start,
        end: this.animationConfig.walk.up.end
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'walk_down',
      frames: this.anims.generateFrameNumbers('player_walk', {
        start: this.animationConfig.walk.down.start,
        end: this.animationConfig.walk.down.end
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'walk_left',
      frames: this.anims.generateFrameNumbers('player_walk', {
        start: this.animationConfig.walk.left.start,
        end: this.animationConfig.walk.left.end
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'walk_right',
      frames: this.anims.generateFrameNumbers('player_walk', {
        start: this.animationConfig.walk.right.start,
        end: this.animationConfig.walk.right.end
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'walk_upRight',
      frames: this.anims.generateFrameNumbers('player_walk', {
        start: this.animationConfig.walk.upRight.start,
        end: this.animationConfig.walk.upRight.end
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'walk_downRight',
      frames: this.anims.generateFrameNumbers('player_walk', {
        start: this.animationConfig.walk.downRight.start,
        end: this.animationConfig.walk.downRight.end
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'walk_upLeft',
      frames: this.anims.generateFrameNumbers('player_walk', {
        start: this.animationConfig.walk.upLeft.start,
        end: this.animationConfig.walk.upLeft.end
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'walk_downLeft',
      frames: this.anims.generateFrameNumbers('player_walk', {
        start: this.animationConfig.walk.downLeft.start,
        end: this.animationConfig.walk.downLeft.end
      }),
      frameRate: 10,
      repeat: -1
    });

    // Animação inicial
    this.player.play('idle_down');
    this.currentAnimation = 'idle_down';

    // Câmera
    this.cameras.main.setZoom(2)
    this.cameras.main.startFollow(this.player)

    // Colisões (ignorado por enquanto)
    this.physics.add.collider(this.player, this.groundOverLayer)

    this.highlightGraphics = this.add.graphics()
    this.highlightGraphics.setDepth(this.config.highlight.z)
    this.input.on('pointerdown', this.handlePointerDown, this)
  }

  handlePointerDown(pointer) {
    const worldPoint = pointer.positionToCamera(this.cameras.main)
    const adjustedY = worldPoint.y - (this.config.visualPointerOffsetY || 0)
    const tile = this.map.getTileAtWorldXY(
      worldPoint.x,
      adjustedY,
      true,
      this.cameras.main,
      'Chao'
    )

    if (tile) {
      this.targetTile = tile
      this.isMoving = true
    }
  }

  update() {
    if (this.isMoving && this.targetTile) {
      const targetX = this.targetTile.getCenterX() + this.config.player.x
      const targetY = this.targetTile.getCenterY() + this.config.player.y
      const dx = targetX - this.player.x
      const dy = targetY - this.player.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      const speed = 100

      if (distance > 2) {
        const angle = Math.atan2(dy, dx)
        this.player.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed)

        // Determinar a direção do movimento
        let animationKey = 'walk_down'; // Default
        let idleKey = 'idle_down';
        let flipX = false;

        if (dx > 0 && dy > 0) {
          animationKey = 'walk_downRight'; // Diagonal para baixo-direita
          idleKey = 'idle_downRight';
          flipX = true;
        } else if (dx < 0 && dy < 0) {
          animationKey = 'walk_upLeft'; // Diagonal para cima-esquerda
          idleKey = 'idle_upLeft';
        } else if (dx < 0 && dy > 0) {
          animationKey = 'walk_downLeft'; // Diagonal para baixo-esquerda
          idleKey = 'idle_downLeft';
        } else if (dx > 0 && dy < 0) {
          animationKey = 'walk_upRight'; // Diagonal para cima-direita
          idleKey = 'idle_upRight';
          flipX = true;
        } else if (dx > 0) {
          animationKey = 'walk_right'; // Direita
          idleKey = 'idle_right';
          flipX = true;
        } else if (dx < 0) {
          animationKey = 'walk_left'; // Esquerda
          idleKey = 'idle_left';
        } else if (dy > 0) {
          animationKey = 'walk_down'; // Para baixo
          idleKey = 'idle_down';
        } else if (dy < 0) {
          animationKey = 'walk_up'; // Para cima
          idleKey = 'idle_up';
        }

        // Trocar para animação de caminhada
        if (this.currentAnimation !== animationKey) {
          this.player.play(animationKey);
          this.currentAnimation = animationKey;
        }
        this.player.flipX = flipX;
        this.lastDirection = idleKey;
      } else {
        this.player.setVelocity(0)
        this.isMoving = false
        this.targetTile = null
        this.player.x = Math.round(this.player.x)
        this.player.y = Math.round(this.player.y)

        // Trocar para animação idle
        if (this.currentAnimation !== this.lastDirection) {
          this.player.play(this.lastDirection);
          this.currentAnimation = this.lastDirection;
        }
      }
    } else {
      this.player.setVelocity(0)

      // Trocar para animação idle
      if (this.currentAnimation !== this.lastDirection) {
        this.player.play(this.lastDirection);
        this.currentAnimation = this.lastDirection;
      }
    }

    // Hover calculado todo frame a partir do ponteiro ativo (sem depender de evento)
    const pointer = this.input.activePointer
    const worldPoint = pointer.positionToCamera(this.cameras.main)
    const adjustedY = worldPoint.y - (this.config.visualPointerOffsetY || 0)

    const hoverTile = this.map.getTileAtWorldXY(
      worldPoint.x,
      adjustedY,
      true,
      this.cameras.main,
      'Chao'
    )

    this.hoveredTile = hoverTile || null

    // Desenha highlight se houver hoveredTile
    this.highlightGraphics.clear()
    if (this.hoveredTile) {
      const x = this.hoveredTile.pixelX + this.config.highlight.x
      const y = this.hoveredTile.pixelY + this.config.highlight.y
      const tileWidth = this.map.tileWidth
      const tileHeight = this.map.tileHeight

      const points = [
        { x: x + tileWidth / 2, y: y },
        { x: x + tileWidth, y: y + tileHeight / 2 },
        { x: x + tileWidth / 2, y: y + tileHeight },
        { x: x, y: y + tileHeight / 2 }
      ]

      this.highlightGraphics.lineStyle(2, 0xffffff, 1)
      this.highlightGraphics.beginPath()
      this.highlightGraphics.moveTo(points[0].x, points[0].y)
      for (let i = 1; i < points.length; i++) {
        this.highlightGraphics.lineTo(points[i].x, points[i].y)
      }
      this.highlightGraphics.closePath()
      this.highlightGraphics.strokePath()
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#2d2d2d',
  parent: 'gameContainer',
  render: { pixelArt: true, antialias: false },
  physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: true } },
  scene: [GameScene],
}

onMounted(() => {
  if (gameContainer.value && !gameInstance) {
    config.parent = gameContainer.value
    gameInstance = new Phaser.Game(config)
  }
})

onUnmounted(() => {
  if (gameInstance) {
    gameInstance.destroy(true)
    gameInstance = null
  }
})
</script>

<template>
  <div
    ref="gameContainer"
    style="width: 800px; height: 600px; cursor: pointer;"
  ></div>
</template>

<style scoped>
div[ref="gameContainer"] {
  display: block;
}
</style>