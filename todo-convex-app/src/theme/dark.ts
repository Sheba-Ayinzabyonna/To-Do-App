// src/theme/light.ts
import { COLOR_PALETTE } from './colors';

export const lightTheme = {
  isDark: false,
  background: COLOR_PALETTE.GRAY_LIGHT,
  itemBackground: COLOR_PALETTE.ITEM_BG_LIGHT,
  text: COLOR_PALETTE.TEXT_PRIMARY_LIGHT,
  textSecondary: COLOR_PALETTE.TEXT_SECONDARY_LIGHT,
  border: COLOR_PALETTE.GRAY_MEDIUM,
  inputPlaceholder: COLOR_PALETTE.TEXT_SECONDARY_LIGHT,
  // Add other elements like Shadow, HeaderGradient, etc.
};

// src/theme/dark.ts
import { COLOR_PALETTE } from './colors';

export const darkTheme = {
  isDark: true,
  background: COLOR_PALETTE.GRAY_DARK,
  itemBackground: COLOR_PALETTE.ITEM_BG_DARK,
  text: COLOR_PALETTE.TEXT_PRIMARY_DARK,
  textSecondary: COLOR_PALETTE.TEXT_SECONDARY_DARK,
  border: COLOR_PALETTE.TEXT_SECONDARY_DARK,
  inputPlaceholder: COLOR_PALETTE.TEXT_SECONDARY_DARK,
};

// Define a type for themes for better TypeScript support
export type AppTheme = typeof lightTheme;