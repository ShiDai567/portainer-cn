import i18n from '@/i18n';
import { notifyError, notifySuccess } from '@/portainer/services/notifications';
import { userQueryKeys } from '@/portainer/users/queries/queryKeys';
import { queryClient } from '@/react-tools/react-query';
import { options } from '@/react/portainer/account/AccountView/theme-options';

export default class ThemeSettingsController {
  /* @ngInject */
  constructor($async, $scope, Authentication, ThemeManager, StateManager, UserService) {
    this.$async = $async;
    this.$scope = $scope;
    this.Authentication = Authentication;
    this.ThemeManager = ThemeManager;
    this.StateManager = StateManager;
    this.UserService = UserService;

    this.setThemeColor = this.setThemeColor.bind(this);
  }

  async setThemeColor(color) {
    return this.$async(async () => {
      if (color === 'auto' || !color) {
        this.ThemeManager.autoTheme();
      } else {
        this.ThemeManager.setTheme(color);
      }

      this.state.themeColor = color;
      this.updateThemeSettings({ color });
    });
  }

  async updateThemeSettings(theme) {
    try {
      await this.UserService.updateUserTheme(this.state.userId, theme);
      await queryClient.invalidateQueries(userQueryKeys.base());

      notifySuccess(i18n.t('account.theme.successTitle'), i18n.t('account.theme.updated'));
    } catch (err) {
      notifyError(i18n.t('account.theme.failureTitle'), err, i18n.t('account.theme.updateError'));
    }
  }

  updateThemeOptions() {
    this.state.availableThemes = options.map((option) => ({
      ...option,
      label: i18n.t(`account.theme.${option.id}`),
    }));
  }

  $onInit() {
    this.state = {
      userId: null,
      themeColor: 'auto',
    };
    this.updateThemeOptions();

    this.onLanguageChanged = () => {
      this.$scope.$evalAsync(() => this.updateThemeOptions());
    };
    i18n.on('languageChanged', this.onLanguageChanged);

    return this.$async(async () => {
      try {
        this.state.userId = await this.Authentication.getUserDetails().ID;
        const user = await this.UserService.user(this.state.userId);

        this.state.themeColor = user.ThemeSettings.color || this.state.themeColor;
      } catch (err) {
        notifyError(i18n.t('account.theme.failureTitle'), err, i18n.t('account.theme.userDetailsError'));
      }
    });
  }

  $onDestroy() {
    i18n.off('languageChanged', this.onLanguageChanged);
  }
}
