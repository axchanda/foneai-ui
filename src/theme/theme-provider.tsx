import type {} from '@mui/lab/themeAugmentation';
import type {} from '@mui/x-tree-view/themeAugmentation';
import type {} from '@mui/x-data-grid/themeAugmentation';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import type {} from '@mui/material/themeCssVarsAugmentation';

import CssBaseline from '@mui/material/CssBaseline';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';

import { createTheme } from './create-theme';
import { RTL } from './with-settings/right-to-left';
import { schemeConfig } from './color-scheme-script';
import { ThemeLocaleComponents } from './types';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: Props) {
  const { currentLang } = useTranslate();
  const RTLLangs = ['ar', 'he'];
  const settings = useSettingsContext();
  const defaultThemeLocale: ThemeLocaleComponents = {
    components: {} // Provide at least an empty object for components
  };
  const theme = createTheme(currentLang?.systemValue ?? defaultThemeLocale, settings);

  return (
    <CssVarsProvider
      theme={theme}
      defaultMode={schemeConfig.defaultMode}
      modeStorageKey={schemeConfig.modeStorageKey}
    >
      <CssBaseline />
      <RTL direction={RTLLangs.includes(currentLang?.value || 'en') ? 'rtl' : 'ltr'}>
        {children}
      </RTL>
      {/* <RTL direction={settings.direction}>{children}</RTL> */}
    </CssVarsProvider>
  );
}
