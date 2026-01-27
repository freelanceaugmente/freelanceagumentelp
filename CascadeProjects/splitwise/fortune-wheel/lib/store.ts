import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WheelSegment {
  id: string;
  label: string;
  value: string;
  color?: string;
  textColor?: string;
  probability?: number;
  isWinning?: boolean;
  prizeId?: string | number;
}

export interface WheelConfig {
  segments: WheelSegment[];
  theme: string;
  size: number;
  borderStyle: string;
  customBorderColor?: string;
  customBorderWidth?: number;
  showBulbs?: boolean;
  brandColors: {
    primary: string;
    secondary: string;
    accent?: string;
  };
  customButton: {
    text: string;
    color: string;
    textColor: string;
  };
  buttonPosition: 'top' | 'bottom' | 'left' | 'right' | 'center';
  spinMode: 'random' | 'instant_winner' | 'probability';
  winProbability: number;
  speed: 'slow' | 'medium' | 'fast';
  formFields: Array<{
    id: string;
    type: 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'checkbox';
    label: string;
    placeholder?: string;
    required?: boolean;
    options?: string[];
  }>;
}

interface WheelStore {
  config: WheelConfig;
  updateConfig: (config: Partial<WheelConfig>) => void;
  addSegment: (segment: WheelSegment) => void;
  updateSegment: (id: string, segment: Partial<WheelSegment>) => void;
  deleteSegment: (id: string) => void;
  resetConfig: () => void;
}

const defaultConfig: WheelConfig = {
  segments: [
    { id: '1', label: 'Prix 1', value: 'prize1', color: '#FF6B6B', textColor: '#FFFFFF', probability: 25, isWinning: true },
    { id: '2', label: 'Prix 2', value: 'prize2', color: '#4ECDC4', textColor: '#FFFFFF', probability: 25, isWinning: true },
    { id: '3', label: 'Perdu', value: 'lose1', color: '#95E1D3', textColor: '#000000', probability: 25, isWinning: false },
    { id: '4', label: 'Prix 3', value: 'prize3', color: '#F38181', textColor: '#FFFFFF', probability: 25, isWinning: true },
  ],
  theme: 'modern',
  size: 400,
  borderStyle: 'classic',
  customBorderColor: '#FFD700',
  customBorderWidth: 20,
  showBulbs: true,
  brandColors: {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    accent: '#FFD700',
  },
  customButton: {
    text: 'Faire tourner',
    color: '#FF6B6B',
    textColor: '#FFFFFF',
  },
  buttonPosition: 'bottom',
  spinMode: 'random',
  winProbability: 50,
  speed: 'medium',
  formFields: [
    { id: 'firstName', label: 'Prénom', type: 'text', required: true },
    { id: 'lastName', label: 'Nom', type: 'text', required: true },
    { id: 'email', label: 'Email', type: 'email', required: true },
    { id: 'phone', label: 'Téléphone', type: 'tel', required: false },
  ],
};

export const useWheelStore = create<WheelStore>()(
  persist(
    (set) => ({
      config: defaultConfig,
      updateConfig: (newConfig) =>
        set((state) => ({
          config: { ...state.config, ...newConfig },
        })),
      addSegment: (segment) =>
        set((state) => ({
          config: {
            ...state.config,
            segments: [...state.config.segments, segment],
          },
        })),
      updateSegment: (id, updatedSegment) =>
        set((state) => ({
          config: {
            ...state.config,
            segments: state.config.segments.map((seg) =>
              seg.id === id ? { ...seg, ...updatedSegment } : seg
            ),
          },
        })),
      deleteSegment: (id) =>
        set((state) => ({
          config: {
            ...state.config,
            segments: state.config.segments.filter((seg) => seg.id !== id),
          },
        })),
      resetConfig: () => set({ config: defaultConfig }),
    }),
    {
      name: 'wheel-config-storage',
    }
  )
);
