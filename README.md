# 🦐 PostureShrimp

**PostureShrimp** is a cross-platform, privacy-first desktop application designed to continuously monitor your posture using MediaPipe local AI models, gently alert you to slouching behavior, and gamify your journey toward an upright back.

## ✨ Core Features
- **Zero-Trust Privacy:** Frames NEVER leave your device. Only numeric coordinates are processed in isolated local memory.
- **Smart Gamification:** Gain XP and evolve your shrimp avatar as you spend minutes sitting properly.
- **Real-Time FPS Throttling:** Resource-friendly bounding running seamlessly in the background (10-15 FPS average) on either CPU/WASM delegates.
- **Native OS Alerts:** Hooks directly into macOS, Windows, and Linux Notification Centers, naturally respecting DND (Do Not Disturb) configurations.

## 🛠️ Tech Stack
- **Framework:** Tauri v2 + React 18 + TypeScript
- **Styling:** Tailwind CSS + custom UI blocks + Framer Motion
- **AI Core:** Google MediaPipe (Pose Landmarker Lite) over WASM
- **Backend Sync:** Local SQLite + `tauri-plugin-store`

## 🚀 Getting Started

### Prerequisites
1. [Node.js](https://nodejs.org/en/) (v20+ recommended)
2. [Rust / Cargo](https://rustup.rs/)

### Setup Development
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Download MediaPipe tasks:
   Download the `pose_landmarker_lite.task` from Google into `./public/mediapipe/`.
3. Start the Vite server + Tauri development window:
   ```bash
   npm run build:deps # If you have script steps
   npm run tauri dev
   ```

### Production Build
```bash
# Verify unit tests are passing
npm run test

# Pack into platform-native desktop installer (.exe, .dmg, .AppImage)
npm run build:app
```

## 🔐 Licensing (SaaS Mode)
For production builds, replace the mock intercept logic in `src-tauri/src/commands/license.rs` with your own secure REST calls handling Stripe/Paddle activations.

## 🤝 Contributing
Contributions are welcome. Run `npm run lint` and `npm run test:e2e` prior to opening any PRs. 
