
import { BoardTheme } from './types';

export const INITIAL_RATING = 1200;
export const BOARD_SIZE = 8;
export const OFFLINE_TIMEOUT = 30000; // 30s

export const THEME_COLORS = {
  [BoardTheme.WOOD]: {
    light: 'bg-[#DEB887]',
    dark: 'bg-[#8B4513]',
    border: 'border-[#5D2E0A]'
  },
  [BoardTheme.DARK]: {
    light: 'bg-[#404040]',
    dark: 'bg-[#1a1a1a]',
    border: 'border-[#000000]'
  },
  [BoardTheme.GREEN]: {
    light: 'bg-[#769656]',
    dark: 'bg-[#2d4a22]',
    border: 'border-[#1a2e13]'
  },
  [BoardTheme.MINIMAL]: {
    light: 'bg-[#f0f0f0]',
    dark: 'bg-[#cccccc]',
    border: 'border-[#999999]'
  }
};
