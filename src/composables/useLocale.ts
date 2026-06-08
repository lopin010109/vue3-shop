import { useI18n } from 'vue-i18n';

export function useLocale() {
  const { locale, t } = useI18n();

  function toggleLocale() {
    locale.value = locale.value === 'zh-TW' ? 'en' : 'zh-TW';
  }

  return { locale, t, toggleLocale };
}
