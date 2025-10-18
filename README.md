# Vue & Phaser Isometric Clicker Game

![Vue.js](https://img.shields.io/badge/Vue.js-3-4FC08D?style=for-the-badge&logo=vue.js)
![Phaser](https://img.shields.io/badge/Phaser-3-882474?style=for-the-badge&logo=phaser)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)

This is a proof-of-concept for a hybrid idle/clicker and simulation game. It combines a reactive UI built with **Vue.js** for the core clicker mechanics with a rich, interactive isometric world rendered by **Phaser.js** to visualize progress.

The core gameplay loop is simple: the player generates resources in the Vue-powered UI, and then spends those resources within the Phaser game world to unlock new areas, purchase upgrades, and visually expand their map area.

---

### ✨ Features

* **Hybrid Gameplay:** Combines the addictive loop of an idle/clicker game with the visual satisfaction of a simulation/building game.
* **Reactive UI Layer (Vue):** The UI for resource generation (the "clicker"), automatic upgrades, and statistics is handled by Vue for maximum reactivity and a modern web feel.
* **Interactive Game World (Phaser):** All progression is visualized on an isometric map. Players spend resources to unlock new parts of the map, explore the area, and interact with the doors around the map.
* **Decoupled Architecture:** The Vue UI and the Phaser game world are completely decoupled and communicate through a lightweight **Event Bus** (`mitt`). This keeps the codebase clean, modular, and easy to maintain.
* **Point-and-Click Interaction:** The player interacts with the isometric world using intuitive point-and-click controls (Map tiles's placeholder).
* **8-Directional Animations:** The player character features smooth idle and walk animations for 8 different directions (Player sprite's placeholder).

---

### 🛠️ Tech Stack

* **[Vue.js 3](https://vuejs.org/):** Manages the entire user interface layer outside of the game canvas. This includes the clicker button, resource counters, and upgrade shops.
* **[Phaser.js](https://phaser.io/):** The game engine that handles all internal game logic: rendering the isometric map, character physics, animations, and in-game interactions.
* **[Mitt](https://github.com/developit/mitt):** A tiny, functional event emitter library used as the Event Bus for communication between Vue components and the Phaser scene.
* **[Vite](https://vitejs.dev/):** The build tool used for a fast and modern development workflow.
* **[Tiled Map Editor](https://www.mapeditor.org/):** External tool used to design the game maps, defining layers for the ground, overlays, and unlockable areas.

---

### 📂 Project Structure

The project is architected to enforce a clean separation of concerns between the UI and the game engine.

```
src/
├── components/
│   ├── GameCanvas.vue      # Vue component that serves as the entry point for the Phaser game
│   └── ClickerComponent.vue  # Example Vue component for the clicker UI
│
├── game/                   # All Phaser game engine code lives here
│   ├── scenes/
│   │   └── GameScene.js    # The main game scene, which orchestrates the game world
│   ├── objects/
│   │   └── Player.js       # The Player class
│   ├── managers/
│   │   ├── MapManager.js   # Manages map creation
│   │   └── AnimationManager.js # Manages all game animations
│   ├── config.js           # Global Phaser settings
│   └── index.js            # Entry point that initializes the Phaser game instance
│
├── eventBus.js             # The shared Mitt instance for Vue-Phaser communication
│
└── App.vue                 # The root component of the Vue application
```

---

### 🚀 Running Locally

To run this project on your local machine, follow the steps below.

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/sphenisscidae/cpw2-clicker.git](https://github.com/sphenisscidae/cpw2-clicker.git)
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd cpw2-clicker
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Start the development server:**
    ```bash
    npm run dev
    ```

5.  Open your browser and navigate to `http://localhost:5173` (or the address provided in your terminal).

---

### 🎯 Future Goals (Ideas)

-   [ ] Add automated resource generators (e.g., "Doors," "Rooms", "Floors").
-   [ ] Balance the costs of upgrades and map unlocks.
-   [ ] Persist game state to `localStorage` so progress is saved.
-   [ ] Add more interactive elements to the unlocked map areas.

---

### 👨‍💻 Author

Made with ❤️ by **Sphenisscidae**.

A portfolio project to deepen my knowledge in web development as part of my studies in "Technology of Systems for the Internet" at Federal Institute of Rio Grande do Sul (IFRS).

[GitHub](https://github.com/sphenisscidae)
