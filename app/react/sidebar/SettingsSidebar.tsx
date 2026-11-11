import {
  Users,
  Award,
  Settings,
  HardDrive,
  Radio,
  FileText,
  Bell,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { usePublicSettings } from '@/react/portainer/settings/queries';
import { isBE } from '@/react/portainer/feature-flags/feature-flags.service';

import { SidebarItem } from './SidebarItem';
import { SidebarSection } from './SidebarSection';
import { SidebarParent } from './SidebarItem/SidebarParent';

interface Props {
  isPureAdmin: boolean;
  isAdmin: boolean;
  isTeamLeader?: boolean;
}

export function SettingsSidebar({
  isPureAdmin,
  isAdmin,
  isTeamLeader = false,
}: Props) {
  const { t } = useTranslation();
  const teamSyncQuery = usePublicSettings<boolean>({
    select: (settings) => settings.TeamSync,
  });

  const isPureAdminOrTeamLeader =
    isPureAdmin || (isTeamLeader && !teamSyncQuery.data && !isAdmin);
  const showUsersSection = !window.ddExtension && isPureAdminOrTeamLeader;

  return (
    <SidebarSection
      title={t('navigation.settings.administration', {
        defaultValue: 'Administration',
      })}
    >
      {showUsersSection && (
        <SidebarParent
          label={t('navigation.settings.userRelated', {
            defaultValue: 'User-related',
          })}
          icon={Users}
          to="portainer.users"
          pathOptions={{ includePaths: ['portainer.teams', 'portainer.roles'] }}
          data-cy="portainerSidebar-userRelated"
          listId="portainerSidebar-userRelated"
        >
          <SidebarItem
            to="portainer.users"
            label={t('navigation.settings.users', { defaultValue: 'Users' })}
            isSubMenu
            data-cy="portainerSidebar-users"
          />
          <SidebarItem
            to="portainer.teams"
            label={t('navigation.settings.teams', { defaultValue: 'Teams' })}
            isSubMenu
            data-cy="portainerSidebar-teams"
          />

          {isPureAdmin && (
            <SidebarItem
              to="portainer.roles"
              label={t('navigation.settings.roles', { defaultValue: 'Roles' })}
              isSubMenu
              data-cy="portainerSidebar-roles"
            />
          )}
        </SidebarParent>
      )}
      {isPureAdmin && (
        <>
          <SidebarParent
            label={t('navigation.settings.environmentRelated', {
              defaultValue: 'Environment-related',
            })}
            icon={HardDrive}
            to="portainer.endpoints"
            pathOptions={{
              includePaths: [
                'portainer.wizard.endpoints',
                'portainer.groups',
                'portainer.tags',
              ],
            }}
            data-cy="portainerSidebar-environments-area"
            listId="portainer-environments"
          >
            <SidebarItem
              label={t('navigation.settings.environments', {
                defaultValue: 'Environments',
              })}
              to="portainer.endpoints"
              ignorePaths={['portainer.endpoints.updateSchedules']}
              includePaths={['portainer.wizard.endpoints']}
              isSubMenu
              data-cy="portainerSidebar-environments"
            />
            <SidebarItem
              to="portainer.groups"
              label={t('navigation.settings.groups', {
                defaultValue: 'Groups',
              })}
              isSubMenu
              data-cy="portainerSidebar-environmentGroups"
            />
            <SidebarItem
              to="portainer.tags"
              label={t('navigation.settings.tags', { defaultValue: 'Tags' })}
              isSubMenu
              data-cy="portainerSidebar-environmentTags"
            />
            <EdgeUpdatesSidebarItem />
          </SidebarParent>

          <SidebarItem
            label={t('navigation.settings.registries', {
              defaultValue: 'Registries',
            })}
            to="portainer.registries"
            icon={Radio}
            data-cy="portainerSidebar-registries"
          />

          {isBE && (
            <SidebarItem
              to="portainer.licenses"
              label={t('navigation.settings.licenses', {
                defaultValue: 'Licenses',
              })}
              icon={Award}
              data-cy="portainerSidebar-licenses"
            />
          )}

          <SidebarParent
            label={t('navigation.settings.logs', { defaultValue: 'Logs' })}
            to="portainer.authLogs"
            icon={FileText}
            pathOptions={{
              includePaths: ['portainer.activityLogs'],
            }}
            data-cy="k8sSidebar-logs"
            listId="k8sSidebar-logs"
          >
            <SidebarItem
              label={t('navigation.settings.authentication', {
                defaultValue: 'Authentication',
              })}
              to="portainer.authLogs"
              isSubMenu
              data-cy="portainerSidebar-authLogs"
            />
            <SidebarItem
              to="portainer.activityLogs"
              label={t('navigation.settings.activity', {
                defaultValue: 'Activity',
              })}
              isSubMenu
              data-cy="portainerSidebar-activityLogs"
            />
          </SidebarParent>
        </>
      )}
      {isBE && !isPureAdmin && isAdmin && (
        <SidebarParent
          label={t('navigation.settings.environmentRelated', {
            defaultValue: 'Environment-related',
          })}
          icon={HardDrive}
          to="portainer.endpoints.updateSchedules"
          data-cy="portainerSidebar-environments-area"
          listId="portainer-environments-area"
        >
          <EdgeUpdatesSidebarItem />
        </SidebarParent>
      )}

      <SidebarItem
        to="portainer.notifications"
        icon={Bell}
        label={t('navigation.settings.notifications', {
          defaultValue: 'Notifications',
        })}
        data-cy="portainerSidebar-notifications"
      />
      {isPureAdmin && (
        <SidebarParent
          to="portainer.settings"
          label={t('navigation.settings.settings', {
            defaultValue: 'Settings',
          })}
          icon={Settings}
          data-cy="portainerSidebar-settings"
          listId="portainer-settings"
        >
          <SidebarItem
            to="portainer.settings"
            label={t('navigation.settings.general', {
              defaultValue: 'General',
            })}
            isSubMenu
            ignorePaths={[
              'portainer.settings.authentication',
              'portainer.settings.sharedcredentials',
              'portainer.settings.edgeCompute',
            ]}
            data-cy="portainerSidebar-generalSettings"
          />
          {!window.ddExtension && (
            <SidebarItem
              to="portainer.settings.authentication"
              label={t('navigation.settings.authentication', {
                defaultValue: 'Authentication',
              })}
              isSubMenu
              data-cy="portainerSidebar-authentication"
            />
          )}
          {isBE && (
            <SidebarItem
              to="portainer.settings.sharedcredentials"
              label={t('navigation.settings.sharedCredentials', {
                defaultValue: 'Shared Credentials',
              })}
              isSubMenu
              data-cy="portainerSidebar-cloud"
            />
          )}

          <SidebarItem
            to="portainer.settings.edgeCompute"
            label={t('navigation.settings.edgeCompute', {
              defaultValue: 'Edge Compute',
            })}
            isSubMenu
            data-cy="portainerSidebar-edgeCompute"
          />

          <SidebarItem.Wrapper
            label={t('navigation.settings.getHelp', {
              defaultValue: 'Get Help',
            })}
          >
            <a
              href="https://www.portainer.io/resources/get-support"
              target="_blank"
              rel="noreferrer"
              className="flex h-8 w-full items-center rounded px-3 text-sm !text-inherit transition-colors duration-200 hover:bg-blue-5/20 hover:!underline focus:no-underline be:hover:bg-gray-5/20 th-dark:hover:bg-gray-true-5/20"
            >
              {t('navigation.settings.getHelp', { defaultValue: 'Get Help' })}
            </a>
          </SidebarItem.Wrapper>
        </SidebarParent>
      )}
    </SidebarSection>
  );
}

function EdgeUpdatesSidebarItem() {
  const { t } = useTranslation();
  const settingsQuery = usePublicSettings();

  if (!isBE || !settingsQuery.data?.EnableEdgeComputeFeatures) {
    return null;
  }

  return (
    <SidebarItem
      to="portainer.endpoints.updateSchedules"
      label={t('navigation.settings.updateRollback', {
        defaultValue: 'Update & Rollback',
      })}
      isSubMenu
      data-cy="portainerSidebar-updateSchedules"
    />
  );
}
