import angular from 'angular';

import i18n from '@/i18n';

angular
  .module('portainer.app')
  .filter('portainerTranslate', function portainerTranslate() {
    function translate(key, options) {
      return i18n.t(key, options);
    }
    // Translations depend on the current language as well as the input key.
    translate.$stateful = true;
    return translate;
  })
  .run(
    /* @ngInject */ function syncTranslation($rootScope) {
      const onLanguageChanged = () => $rootScope.$evalAsync();
      i18n.on('languageChanged', onLanguageChanged);
      $rootScope.$on('$destroy', () => i18n.off('languageChanged', onLanguageChanged));
    }
  )
  .component('languageSelector', {
    template: `
      <label class="inline-flex items-center gap-2 py-2">
        <span>{{ 'language.label' | portainerTranslate }}</span>
        <select class="form-control !w-auto" ng-model="$ctrl.language" ng-change="$ctrl.changeLanguage()" data-cy="language-selector">
          <option value="zh-CN">简体中文</option>
          <option value="en">English</option>
        </select>
      </label>
    `,
    controller: /* @ngInject */ function LanguageSelectorController($scope) {
      this.language = i18n.resolvedLanguage;
      this.changeLanguage = () => i18n.changeLanguage(this.language);

      const onLanguageChanged = (language) => {
        $scope.$evalAsync(() => {
          this.language = language;
        });
      };
      i18n.on('languageChanged', onLanguageChanged);
      $scope.$on('$destroy', () => i18n.off('languageChanged', onLanguageChanged));
    },
  });
