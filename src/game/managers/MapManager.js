export default class MapManager {
  constructor(scene) {
    this.scene = scene
    this.map = null
    this.tileset = null
    this.groundLayer = null
    this.overlayLayer = null
  }

  createMap(mapKey, tilesetImageKey, tilesetNameInTiled) {
    this.map = this.scene.make.tilemap({ key: mapKey })
    this.tileset = this.map.addTilesetImage(tilesetNameInTiled, tilesetImageKey)

    this.groundLayer = this.map.createLayer('Chao', this.tileset, 0, 0)
    this.groundLayer.setDepth(0)

    this.overlayLayer = this.map.createLayer('Overlay', this.tileset, 0, 0)
    this.overlayLayer.setDepth(0.5)

    return this.map
  }

  getLayer(layerName) {
    if (layerName === 'Overlay') {
      return this.overlayLayer
    }
    if (layerName === 'Chao') {
      return this.groundLayer
    }
    return null
  }
}