// Main theme configuration - centralized design tokens
import { lightColors, darkColors } from './colors';
import fonts from './fonts';
import spacing from './spacing';

export const getTheme = (isDark = false) => ({
  colors: isDark ? darkColors : lightColors,
  fonts,
  spacing,
  isDark,
});

// Backward compat
export const theme = getTheme(false);
export default theme;
