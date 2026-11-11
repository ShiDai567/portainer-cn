import { getEnvironments } from '@/react/portainer/environments/environment.service';
import { restoreOptions } from '@/react/portainer/init/InitAdminView/restore-options';
import i18n from '@/i18n';

const REDIRECT_REASON_TIMEOUT = 'AdminInitTimeout';

angular.module('portainer.app').controller('InitAdminController', [
  '$scope',
  '$state',
  'Notifications',
  'Authentication',
  'StateManager',
  'SettingsService',
  'UserService',
  'BackupService',
  'StatusService',
  function ($scope, $state, Notifications, Authentication, StateManager, SettingsService, UserService, BackupService, StatusService) {
    function updateRestoreOptions() {
      $scope.restoreOptions = restoreOptions.map((option) => ({
        ...option,
        label: option.value === 'file' ? i18n.t('init.admin.uploadBackupOption') : option.value === 's3' ? i18n.t('init.admin.retrieveFromS3') : option.label,
      }));
    }

    updateRestoreOptions();
    const onLanguageChanged = () => $scope.$evalAsync(updateRestoreOptions);
    i18n.on('languageChanged', onLanguageChanged);
    $scope.$on('$destroy', () => i18n.off('languageChanged', onLanguageChanged));

    $scope.uploadBackup = uploadBackup;

    $scope.logo = StateManager.getState().application.logo;
    $scope.RESTORE_FORM_TYPES = { S3: 's3', FILE: 'file' };

    $scope.formValues = {
      Username: 'admin',
      Password: '',
      ConfirmPassword: '',
      SetupToken: '',
      restoreFormType: $scope.RESTORE_FORM_TYPES.FILE,
    };

    $scope.state = {
      actionInProgress: false,
      showInitPassword: true,
      showRestorePortainer: false,
    };

    createAdministratorFlow();

    $scope.togglePanel = function () {
      $scope.state.showInitPassword = !$scope.state.showInitPassword;
      $scope.state.showRestorePortainer = !$scope.state.showRestorePortainer;
    };

    $scope.onChangeRestoreType = onChangeRestoreType;
    function onChangeRestoreType(value) {
      $scope.$evalAsync(() => {
        $scope.formValues.restoreFormType = value;
      });
    }

    $scope.createAdminUser = function () {
      var username = $scope.formValues.Username;
      var password = $scope.formValues.Password;

      $scope.state.actionInProgress = true;
      UserService.initAdministrator(username, password, $scope.formValues.SetupToken)
        .then(function success() {
          return Authentication.login(username, password);
        })
        .then(() => {
          return StateManager.initialize();
        })
        .then(function () {
          return getEnvironments({ limit: 100 });
        })
        .then(function success(data) {
          if (data.value.length !== 0) {
            return $state.go('portainer.home');
          }

          // On a fresh install (no environments yet), offer the edge compute setup
          // step before the environment wizard — unless edge compute was already
          // configured headlessly via the startup CLI flags, in which case skip
          // straight to the wizard. The step forwards to the wizard on submit/skip.
          return SettingsService.settings().then(function (settings) {
            return $state.go(settings.EnableEdgeComputeFeatures ? 'portainer.wizard' : 'portainer.init.edge');
          });
        })
        .catch(function error(err) {
          if (!handleError(err)) {
            Notifications.error(i18n.t('init.admin.failure'), err, i18n.t('init.admin.createAdministratorFailure'));
          }
        })
        .finally(function final() {
          $scope.state.actionInProgress = false;
        });
    };

    function handleError(err) {
      if (err.status === 303) {
        const headers = err.response?.headers ?? {};
        if (headers['redirect-reason'] === REDIRECT_REASON_TIMEOUT) {
          window.location.href = '/timeout.html';
        }
        return true;
      }
      if (err.status === 403) {
        Notifications.error(i18n.t('init.admin.failure'), err, i18n.t('init.admin.setupTokenInvalid'));
        return true;
      }
      return false;
    }

    function createAdministratorFlow() {
      SettingsService.publicSettings()
        .then(function success(data) {
          $scope.requiredPasswordLength = data.RequiredPasswordLength;
          $scope.requiresSetupToken = data.RequiresSetupToken;
        })
        .catch(function error(err) {
          Notifications.error(i18n.t('init.admin.failure'), err, i18n.t('init.admin.retrieveApplicationSettingsFailure'));
        });

      UserService.administratorExists()
        .then(function success(exists) {
          if (exists) {
            $state.go('portainer.wizard');
          }
        })
        .catch(function error(err) {
          Notifications.error(i18n.t('init.admin.failure'), err, i18n.t('init.admin.verifyAdministratorFailure'));
        });
    }

    async function uploadBackup() {
      $scope.state.backupInProgress = true;

      const file = $scope.formValues.BackupFile;
      const password = $scope.formValues.Password;

      restoreAndRefresh(() => BackupService.uploadBackup(file, password, $scope.formValues.SetupToken));
    }

    async function restoreAndRefresh(restoreAsyncFn) {
      $scope.state.backupInProgress = true;

      try {
        await restoreAsyncFn();
      } catch (err) {
        if (!handleError(err)) {
          Notifications.error(i18n.t('init.admin.failure'), err, i18n.t('init.admin.restoreBackupFailure'));
        }
        $scope.state.backupInProgress = false;

        return;
      }

      try {
        await waitPortainerRestart();
        Notifications.success(i18n.t('init.admin.success'), i18n.t('init.admin.backupRestored'));
        $state.go('portainer.auth');
      } catch (err) {
        handleError(err);
        Notifications.error(i18n.t('init.admin.failure'), err, i18n.t('init.admin.checkStatusFailure'));
        await wait(2);
        location.reload();
      }

      $scope.state.backupInProgress = false;
    }

    async function waitPortainerRestart() {
      for (let i = 0; i < 10; i++) {
        await wait(5);
        try {
          const status = await StatusService.status();
          if (status && status.Version) {
            return;
          }
        } catch (e) {
          // pass
        }
      }
      throw new Error(i18n.t('init.admin.restartTimeout'));
    }
  },
]);

function wait(seconds = 0) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
