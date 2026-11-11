import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

async function loadLanguage(browserLanguages: string[], cached?: string) {
  vi.resetModules();
  localStorage.clear();
  if (cached) {
    localStorage.setItem('i18nextLng', cached);
  }
  vi.spyOn(navigator, 'languages', 'get').mockReturnValue(browserLanguages);
  vi.spyOn(navigator, 'language', 'get').mockReturnValue(browserLanguages[0]);
  return (await vi.importActual<typeof import('./i18n')>('./i18n')).default;
}

describe('interface language', () => {
  it.each(['zh-CN', 'zh', 'zh-TW', 'zh-Hans-CN'])(
    'maps browser language %s to Simplified Chinese synchronously',
    async (language) => {
      const i18n = await loadLanguage([language]);

      expect(i18n.isInitialized).toBe(true);
      expect(i18n.resolvedLanguage).toBe('zh-CN');
      expect(i18n.t('auth.username')).toBe('用户名');
      expect(document.documentElement.lang).toBe('zh-CN');
    }
  );

  it('prefers a stored choice to the browser language and persists changes', async () => {
    const i18n = await loadLanguage(['zh-CN'], 'en');

    expect(i18n.t('auth.username')).toBe('Username');
    await i18n.changeLanguage('zh-CN');
    expect(localStorage.getItem('i18nextLng')).toBe('zh-CN');
    expect(document.documentElement.lang).toBe('zh-CN');

    vi.resetModules();
    const reloaded = (await vi.importActual<typeof import('./i18n')>('./i18n'))
      .default;
    expect(reloaded.resolvedLanguage).toBe('zh-CN');
  });

  it('checks the browser preference list and falls back to English', async () => {
    const preferred = await loadLanguage(['fr-FR', 'zh-CN']);
    expect(preferred.resolvedLanguage).toBe('zh-CN');

    const fallback = await loadLanguage(['de-DE']);
    expect(fallback.resolvedLanguage).toBe('en');
  });

  it('falls back to English when a Chinese key is absent', async () => {
    const i18n = await loadLanguage(['zh-CN']);
    i18n.addResource(
      'en',
      'translation',
      'test.englishOnly',
      'English fallback'
    );

    expect(i18n.t('test.englishOnly')).toBe('English fallback');
    expect(i18n.t('auth.loginWithProvider', { provider: 'GitHub' })).toBe(
      '使用 GitHub 登录'
    );
  });

  it('resolves localized notification times and Helm confirmation counts', async () => {
    const i18n = await loadLanguage(['en-US']);

    expect(
      i18n.t('header.notifications.relativeTime.hoursAgo', { count: 1 })
    ).toBe('1 hour ago');
    expect(
      i18n.t('header.notifications.relativeTime.hoursAgo', { count: 2 })
    ).toBe('2 hours ago');

    await i18n.changeLanguage('zh-CN');
    expect(
      i18n.t('header.notifications.relativeTime.hoursAgo', { count: 2 })
    ).toBe('2 小时前');
    expect(i18n.t('account.helm.confirmRemove', { count: 2 })).toBe(
      '确定要删除选中的 2 个 Helm 仓库吗？'
    );
  });

  it('works when browser storage is unavailable', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage blocked', 'SecurityError');
    });

    const i18n = await loadLanguage(['zh-CN']);
    await i18n.changeLanguage('en');
    expect(i18n.t('auth.username')).toBe('Username');
  });
});
