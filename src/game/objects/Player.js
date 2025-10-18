import Phaser from 'phaser'

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player_idle')

    this.targetTile = null
    this.isMoving = false
    this.currentAnimation = 'idle_down'
    this.lastDirection = 'idle_down'
    this.offsetConfig = { x: 0, y: -15 }

    // Configuração da sprite do player, caso esteja desalinhada
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.body.setSize(200, 300)
    this.setOrigin(0.5, 0.5)
    this.setDepth(1)
    this.setDisplaySize(40, 40)
    this.play('idle_down') // Por padrão já inicia com a animação idle olhando pra baixo
  }

  // Mover o jogador para um tile específico do mapa
  moveTo(tile) {
    if (tile) {
      this.targetTile = tile
      this.isMoving = true
    }
  }

  update() {
    if (this.isMoving && this.targetTile) {
      const targetX = this.targetTile.getCenterX() + this.offsetConfig.x
      const targetY = this.targetTile.getCenterY() + this.offsetConfig.y
      const dx = targetX - this.x
      const dy = targetY - this.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      const speed = 100

      if (distance > 2) {
        const angle = Math.atan2(dy, dx)
        this.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed)
        this.updateAnimation(dx, dy)
      } else {
        this.stopMoving()
      }
    } else {
      this.stopMoving()
    }
  }

  updateAnimation(dx, dy) {
    let animationKey = 'walk_down'
    let idleKey = 'idle_down'
    let flipX = false

    // Determinar a direção do player baseada em dx e dy
    if (dx > 0 && dy > 0) {
      animationKey = 'walk_downRight'
      idleKey = 'idle_downRight'
      flipX = true
    } else if (dx < 0 && dy < 0) {
      animationKey = 'walk_upLeft'
      idleKey = 'idle_upLeft'
    } else if (dx < 0 && dy > 0) {
      animationKey = 'walk_downLeft'
      idleKey = 'idle_downLeft'
    } else if (dx > 0 && dy < 0) {
      animationKey = 'walk_upRight'
      idleKey = 'idle_upRight'
      flipX = true
    } else if (dx > 0) {
      animationKey = 'walk_right'
      idleKey = 'idle_right'
      flipX = true
    } else if (dx < 0) {
      animationKey = 'walk_left'
      idleKey = 'idle_left'
    } else if (dy > 0) {
      animationKey = 'walk_down'
      idleKey = 'idle_down'
    } else if (dy < 0) {
      animationKey = 'walk_up'
      idleKey = 'idle_up'
    }

    if (this.currentAnimation !== animationKey) {
      this.play(animationKey)
      this.currentAnimation = animationKey
    }
    this.flipX = flipX //Flipa a sprite quando o player estiver indo para a direção oposta
    this.lastDirection = idleKey
  }

  stopMoving() {
    this.setVelocity(0)
    if (this.isMoving) {
      this.isMoving = false
      this.targetTile = null
      this.x = Math.round(this.x)
      this.y = Math.round(this.y)
    }

    if (this.currentAnimation !== this.lastDirection) {
      this.play(this.lastDirection)
      this.currentAnimation = this.lastDirection
    }
  }
}