import { act, fireEvent, render, screen } from '@testing-library/react';

import i18n from '@/i18n';

import { LanguageSelector } from './LanguageSelector';

it('switches rendered React text and remembers the selected language', async () => {
  await i18n.changeLanguage('en');
  render(<LanguageSelector />);

  await act(async () => {
    fireEvent.change(screen.getByRole('combobox', { name: 'Language' }), {
      target: { value: 'zh-CN' },
    });
  });

  expect(screen.getByRole('combobox', { name: '语言' })).toHaveValue('zh-CN');
  expect(localStorage.getItem('i18nextLng')).toBe('zh-CN');

  await act(async () => {
    await i18n.changeLanguage('en');
  });
  expect(screen.getByRole('combobox', { name: 'Language' })).toHaveValue('en');
});
