// core (MUI)
import {
  frFR as frFRCore,
  viVN as viVNCore,
  zhCN as zhCNCore,
  arSA as arSACore,
  esES as esESCore,
  deDE as deDECore,
  jaJP as jaJPCore,
  ruRU as ruRUCore,
} from '@mui/material/locale';
// date pickers (MUI)
import {
  enUS as enUSDate,
  frFR as frFRDate,
  viVN as viVNDate,
  zhCN as zhCNDate,
  esES as esESDate,
  deDE as deDEDate,
  jaJP as jaJPDate,
  ruRU as ruRUDate,
} from '@mui/x-date-pickers/locales';
// data grid (MUI)
import {
  enUS as enUSDataGrid,
  frFR as frFRDataGrid,
  viVN as viVNDataGrid,
  zhCN as zhCNDataGrid,
  arSD as arSDDataGrid,
  esES as esESDataGrid,
  deDE as deDEDataGrid,
  jaJP as jaJPDataGrid,
  ruRU as ruRUDataGrid,
} from '@mui/x-data-grid/locales';

// ----------------------------------------------------------------------

export const allLangs = [
  {
    value: 'en',
    label: 'English',
    countryCode: 'GB',
    adapterLocale: 'en',
    numberFormat: { code: 'en-US', currency: 'USD' },
    systemValue: {
      components: { ...enUSDate.components, ...enUSDataGrid.components },
    },
  },
  {
    value: 'es',
    label: 'Español',
    countryCode: 'ES',
    adapterLocale: 'es',
    numberFormat: { code: 'es-ES', currency: 'EUR' },
    systemValue: {
      components: { ...esESCore.components, ...esESDate.components, ...esESDataGrid.components },
    },
  },
  // {
  //   value: 'de',
  //   label: 'German',
  //   countryCode: 'DE',
  //   adapterLocale: 'de',
  //   numberFormat: { code: 'de-DE', currency: 'EUR' },
  //   systemValue: {
  //     components: { ...deDECore.components, ...deDEDate.components, ...deDEDataGrid.components },
  //   },
  // },
  // {
  //   value: 'fr',
  //   label: 'French',
  //   countryCode: 'FR',
  //   adapterLocale: 'fr',
  //   numberFormat: { code: 'fr-Fr', currency: 'EUR' },
  //   systemValue: {
  //     components: { ...frFRCore.components, ...frFRDate.components, ...frFRDataGrid.components },
  //   },
  // },
  {
    value: 'ru',
    label: 'Русский',
    countryCode: 'RU',
    adapterLocale: 'ru',
    numberFormat: { code: 'ru-RU', currency: 'RUB' },
    systemValue: {
      components: { ...ruRUCore.components, ...ruRUDate.components, ...ruRUDataGrid.components },
    },
  },
  // {
  //   value: 'vi',
  //   label: 'Vietnamese',
  //   countryCode: 'VN',
  //   adapterLocale: 'vi',
  //   numberFormat: { code: 'vi-VN', currency: 'VND' },
  //   systemValue: {
  //     components: { ...viVNCore.components, ...viVNDate.components, ...viVNDataGrid.components },
  //   },
  // },
  // {
  //   value: 'cn',
  //   label: 'Chinese',
  //   countryCode: 'CN',
  //   adapterLocale: 'zh-cn',
  //   numberFormat: { code: 'zh-CN', currency: 'CNY' },
  //   systemValue: {
  //     components: { ...zhCNCore.components, ...zhCNDate.components, ...zhCNDataGrid.components },
  //   },
  // },
  {
    value: 'ar',
    label: 'العربية',
    countryCode: 'SA',
    adapterLocale: 'ar-sa',
    numberFormat: { code: 'ar', currency: 'AED' },
    systemValue: {
      components: { ...arSACore.components, ...arSDDataGrid.components },
    },
  },
  // {
  //   value: 'ja',
  //   label: 'Japanese',
  //   countryCode: 'JP',
  //   adapterLocale: 'ja',
  //   numberFormat: { code: 'ja-JP', currency: 'JPY' },
  //   systemValue: {
  //     components: { ...jaJPCore.components, ...jaJPDate.components, ...jaJPDataGrid.components },
  //   },
  // },
  // {
  //   value: 'ko',
  //   label: 'Korean',
  //   countryCode: 'KR',
  //   adapterLocale: 'ko',
  //   numberFormat: { code: 'ko-KR', currency: 'KRW' },
  // },
];

/**
 * Country code:
 * https://flagcdn.com/en/codes.json
 *
 * Number format code:
 * https://gist.github.com/raushankrjha/d1c7e35cf87e69aa8b4208a8171a8416
 */
