export default class AnimationManager {
  constructor(scene) {
    this.scene = scene
    this.animationConfig = {
      idle: {
        up: { start: 32, end: 39 },
        down: { start: 0, end: 7 },
        left: { start: 16, end: 23 },
        right: { start: 16, end: 23 },
        upRight: { start: 24, end: 31 },
        downRight: { start: 8, end: 15 },
        upLeft: { start: 24, end: 31 },
        downLeft: { start: 8, end: 15 },
      },
      walk: {
        up: { start: 24, end: 29 },
        down: { start: 0, end: 5 },
        left: { start: 12, end: 17 },
        right: { start: 12, end: 17 },
        upRight: { start: 18, end: 23 },
        downRight: { start: 6, end: 11 },
        upLeft: { start: 18, end: 23 },
        downLeft: { start: 6, end: 11 },
      },
    }
  }

  createPlayerAnimations() {
    // Animações IDLE
    Object.entries(this.animationConfig.idle).forEach(([dir, frames]) => {
      this.scene.anims.create({
        key: `idle_${dir}`,
        frames: this.scene.anims.generateFrameNumbers('player_idle', {
          start: frames.start,
          end: frames.end,
        }),
        frameRate: 10,
        repeat: -1,
      })
    })

    // Animações WALK
    Object.entries(this.animationConfig.walk).forEach(([dir, frames]) => {
      this.scene.anims.create({
        key: `walk_${dir}`,
        frames: this.scene.anims.generateFrameNumbers('player_walk', {
          start: frames.start,
          end: frames.end,
        }),
        frameRate: 10,
        repeat: -1,
      })
    })
  }
}