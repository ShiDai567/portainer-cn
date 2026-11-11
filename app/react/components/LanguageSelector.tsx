import { useTranslation } from 'react-i18next';

export function LanguageSelector() {
  const { t, i18n } = useTranslation();

  return (
    <label className="inline-flex items-center gap-2 py-2">
      <span>{t('language.label', { defaultValue: 'Language' })}</span>
      <select
        className="form-control !w-auto"
        value={i18n.resolvedLanguage}
        onChange={(event) => i18n.changeLanguage(event.target.value)}
        data-cy="language-selector"
      >
        <option value="zh-CN">简体中文</option>
        <option value="en">English</option>
      </select>
    </label>
  );
}
