// ----------------------------------------------------------------------

export type LanguageValue = 'en' | 'fr' | 'vi' | 'cn' | 'ar' | 'ja' | 'ko' | 'es' | 'de' | 'ru';

export const fallbackLng = 'en';
export const languages = ['en', 'fr', 'vi', 'cn', 'ar', 'ja', 'ko', 'es', 'de', 'ru'];
export const defaultNS = 'common';
export const cookieName = 'i18next';

// ----------------------------------------------------------------------

export function i18nOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    // debug: true,
    lng,
    fallbackLng,
    ns,
    defaultNS,
    fallbackNS: defaultNS,
    supportedLngs: languages,
  };
}

// ----------------------------------------------------------------------

export const changeLangMessages: Record<
  LanguageValue,
  { success: string; error: string; loading: string }
> = {
  en: {
    success: 'Language has been changed!',
    error: 'Error changing language!',
    loading: 'Loading...',
  },
  vi: {
    success: 'Ngôn ngữ đã được thay đổi!',
    error: 'Lỗi khi thay đổi ngôn ngữ!',
    loading: 'Đang tải...',
  },
  fr: {
    success: 'La langue a été changée!',
    error: 'Erreur lors du changement de langue!',
    loading: 'Chargement...',
  },
  cn: {
    success: '语言已更改！',
    error: '更改语言时出错！',
    loading: '加载中...',
  },
  ar: {
    success: 'تم تغيير اللغة!',
    error: 'خطأ في تغيير اللغة!',
    loading: 'جارٍ التحميل...',
  },
  ja: {
    success: '言語が変更されました！',
    error: '言語の変更中にエラーが発生しました！',
    loading: '読み込み中...',
  },
  ko: {
    success: '언어가 변경되었습니다!',
    error: '언어 변경 중 오류가 발생했습니다!',
    loading: '로드 중...',
  },
  es: {
    success: '¡El idioma ha sido cambiado!',
    error: '¡Error al cambiar el idioma!',
    loading: 'Cargando...',
  },
  de: {
    success: 'Sprache wurde geändert!',
    error: 'Fehler beim Ändern der Sprache!',
    loading: 'Wird geladen...',
  },
  ru: {
    success: 'Язык был изменен!',
    error: 'Ошибка при изменении языка!',
    loading: 'загрузка...',
  },
};
