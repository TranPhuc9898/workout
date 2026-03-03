import { useContext, useMemo } from 'react';
import { SettingsContext } from '../SettingsContext';
import { getTheme } from '../theme';

export const useTheme = () => {
  const { isDarkMode } = useContext(SettingsContext);
  return useMemo(() => getTheme(isDarkMode), [isDarkMode]);
};
