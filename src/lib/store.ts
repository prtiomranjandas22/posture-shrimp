import { create } from 'zustand';
import { load } from '@tauri-apps/plugin-store';

// Initialize a store file for local preservation
const tauriStore = await load('settings.json', { autoSave: true });

interface AppState {
  xp: number;
  level: number;
  alertSensitivity: number;
  addXp: (amount: number) => void;
  setSensitivity: (val: number) => void;
  initStore: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  xp: 0,
  level: 1,
  alertSensitivity: 60,
  addXp: async (amount) => {
    const newXp = get().xp + amount;
    const newLevel = Math.floor(newXp / 100) + 1;
    set({ xp: newXp, level: newLevel });
    await tauriStore.set('xp', newXp);
    await tauriStore.set('level', newLevel);
    await tauriStore.save();
  },
  setSensitivity: async (val) => {
    set({ alertSensitivity: val });
    await tauriStore.set('alertSensitivity', val);
    await tauriStore.save();
  },
  initStore: async () => {
    try {
      const xp = await tauriStore.get<number>('xp') || 0;
      const level = await tauriStore.get<number>('level') || 1;
      const alertSensitivity = await tauriStore.get<number>('alertSensitivity') || 60;
      set({ xp, level, alertSensitivity });
    } catch(e) {
      console.warn("Failed to init store from tauri", e);
    }
  }
}));
