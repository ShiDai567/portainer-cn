import angular from 'angular';
import 'angular-mocks';

import i18n from '@/i18n';

angular.module('portainer.app', []);
await import('./i18n');

let injector;
let scope;

beforeEach(async () => {
  await i18n.changeLanguage('en');
  injector = angular.injector(['ng', 'portainer.app']);
  scope = injector.get('$rootScope');
});

afterEach(() => {
  scope.$destroy();
});

it('updates existing Angular bindings and interpolated attributes after a language change', async () => {
  const element = injector.get('$compile')(`
    <div>
      <span>{{ 'auth.loginTitle' | portainerTranslate }}</span>
      <input placeholder="{{ 'auth.usernamePlaceholder' | portainerTranslate }}" />
      <p>{{ 'auth.loginWithProvider' | portainerTranslate:{ provider: 'GitHub' } }}</p>
    </div>
  `)(scope);
  scope.$digest();
  expect(element.find('span').text()).toBe('Log in to your account');

  await i18n.changeLanguage('zh-CN');
  scope.$digest();
  expect(element.find('span').text()).toBe('登录您的账户');
  expect(element.find('input').attr('placeholder')).toBe('请输入用户名');
  expect(element.find('p').text()).toBe('使用 GitHub 登录');
});

it('keeps the Angular language selector in sync with the shared language instance', async () => {
  const element = injector.get('$compile')('<language-selector></language-selector>')(scope);
  scope.$digest();
  const select = element.find('select');
  select.val('zh-CN');
  select.triggerHandler('change');
  scope.$digest();

  expect(i18n.resolvedLanguage).toBe('zh-CN');
  expect(localStorage.getItem('i18nextLng')).toBe('zh-CN');
  expect(element.find('span').text()).toBe('语言');

  await i18n.changeLanguage('en');
  scope.$digest();
  expect(select.val()).toBe('en');
});
