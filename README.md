# FRACTURED: Ghost in the Machine

> **Status:** Active // **System:** Online // **Sanity:** Critical

**FRACTURED** is a high-fidelity, React-based narrative game engine designed for psychological horror, cyberpunk, and meta-aware interactive fiction. It treats the browser window as a diegetic interface, blurring the line between the player and the "system."

## 👁️ Key Features

*   **Meta-Narrative Engine:** The game remembers your choices across different playthroughs (`localStorage` persistence). Characters may "remember" you after a system reset.
*   **Dynamic Glitch System:**
    *   **Sanity System:** As sanity drops, text becomes harder to read, the screen desaturates, and auditory hallucinations (visual text overrides) appear.
    *   **Corruption System:** High corruption causes UI tearing, color inversion, and "system overrides" where the UI fights the player.
*   **Neural Topology Visualizer:** A dynamic, canvas-based directed graph that visualizes the player's path through the narrative tree in real-time.
*   **Atmospheric UI:**
    *   CRT scanlines, chromatic aberration, and noise filters.
    *   Typewriter text effects with per-character voice styling.
    *   CSS-based holographic animations.
*   **Responsive Design:** Mobile-first architecture using Tailwind CSS.

## 🛠️ Tech Stack

*   **Core:** React 19, TypeScript
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS (with custom animations)
*   **State Management:** React Context API + `useReducer`
*   **Persistence:** LocalStorage API

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18 or higher recommended)
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    https://github.com/divicoded/fractured-game.git
    cd fractured
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Build for production**
    ```bash
    npm run build
    ```

## 📂 Project Structure

```
/src
  ├── components/      # UI elements (GlitchButton, StatMonitor, Typewriter)
  ├── context/         # Game state management (GameContext)
  ├── data/            # The narrative content (story.ts)
  ├── services/        # Utility logic (glitchLogic, textUtils)
  ├── types.ts         # TypeScript interfaces (Scene, Choice, Stats)
  ├── constants.ts     # Config constants (Colors, Speaker Names)
  ├── App.tsx          # Main entry and view manager
  └── index.tsx        # React root
```

## ✍️ Writing Stories

The narrative is defined in `src/data/story.ts`. The engine uses a node-based structure where every "Scene" is a key in a large object.

### Scene Structure
To add a new scene, define it in the `SCENES` object:

```typescript
'scene_id_here': {
  id: 'scene_id_here',
  speaker: 'IRIS', // Who is talking? (Defined in constants.ts)
  text: "The narrative text goes here.",
  glitchIntensity: 0.2, // 0 to 1 (Optional: affects visual noise)
  choices: [
    { 
      id: 'choice_1', 
      text: 'Say something nice', 
      nextSceneId: 'nice_response',
      effects: { sanity: 5, trust: 10 } // Optional stat changes
    },
    { 
      id: 'choice_2', 
      text: 'Scream', 
      nextSceneId: 'bad_response',
      effects: { sanity: -10 } 
    }
  ]
}
```

### Advanced Features

1.  **Meta-Effects:**
    Use `metaEffect` in a choice to trigger special system events or remember flags forever.
    ```typescript
    { id: 'c1', text: 'Open the door', nextSceneId: 'room', metaEffect: 'SEE_DOOR' }
    ```

2.  **Hidden Choices:**
    Hide choices based on previous flags or stats.
    ```typescript
    { 
      id: 'secret', 
      text: 'Use the code', 
      nextSceneId: 'secret_room', 
      hidden: true, // Requires flag 'found_code' to be true
      requiredStats: [{ stat: 'truth', value: 50, condition: 'gt' }]
    }
    ```

3.  **Auto-Transition:**
    Create cutscenes by automatically moving to the next scene after a delay.
    ```typescript
    autoTransition: { delay: 3000, nextSceneId: 'next_scene' }
    ```

## 🎨 Customization

*   **Colors/Theme:** Modify `tailwind.config.js` to change the neon color palette.
*   **Speakers:** Add new characters in `src/types.ts` (Speaker type) and `src/constants.ts` (Colors/Names).
*   **Stats:** Modify `PlayerStats` in `src/types.ts` to track different metrics (e.g., Health, Ammo).

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

*System Message: TERMINAL SESSION ENDED. HAVE A NICE DAY.*
