import { create } from 'zustand';
import { load } from '@tauri-apps/plugin-store';

interface AppState {
  xp: number;
  level: number;
  alertSensitivity: number;
  addXp: (amount: number) => void;
  setSensitivity: (val: number) => void;
  initStore: () => Promise<void>;
}

// We'll initialize this lazily inside initStore
let tauriStore: any = null;

export const useAppStore = create<AppState>((set, get) => ({
  xp: 0,
  level: 1,
  alertSensitivity: 60,
  addXp: async (amount) => {
    const newXp = get().xp + amount;
    const newLevel = Math.floor(newXp / 100) + 1;
    set({ xp: newXp, level: newLevel });
    if (tauriStore) {
      await tauriStore.set('xp', newXp);
      await tauriStore.set('level', newLevel);
      await tauriStore.save();
    }
  },
  setSensitivity: async (val) => {
    set({ alertSensitivity: val });
    if (tauriStore) {
      await tauriStore.set('alertSensitivity', val);
      await tauriStore.save();
    }
  },
  initStore: async () => {
    try {
      if (!tauriStore) {
        tauriStore = await load('settings.json', { autoSave: true, defaults: {} });
      }
      const xp = await tauriStore.get('xp') || 0;
      const level = await tauriStore.get('level') || 1;
      const alertSensitivity = await tauriStore.get('alertSensitivity') || 60;
      set({ xp, level, alertSensitivity });
    } catch(e) {
      console.warn("Failed to init store from tauri", e);
    }
  }
}));
