import {
  Box,
  Clock,
  Layers,
  List,
  Lock,
  Shuffle,
  Trello,
  Clipboard,
  Edit,
  Network,
  Database,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import {
  type Environment,
  type EnvironmentId,
} from '@/react/portainer/environments/types';
import { Authorized, useIsEnvironmentAdmin } from '@/react/hooks/useUser';
import { useInfo } from '@/react/docker/proxy/queries/useInfo';
import { useApiVersion } from '@/react/docker/proxy/queries/useVersion';

import { SidebarItem } from './SidebarItem';
import { DashboardLink } from './items/DashboardLink';
import { SidebarParent } from './SidebarItem/SidebarParent';

interface Props {
  environmentId: EnvironmentId;
  environment: Environment;
}

export function DockerSidebar({ environmentId, environment }: Props) {
  const { t } = useTranslation();
  const { authorized: isEnvironmentAdmin } = useIsEnvironmentAdmin({
    adminOnlyCE: true,
  });

  const areStacksVisible =
    isEnvironmentAdmin ||
    environment.SecuritySettings.allowStackManagementForRegularUsers;

  const envInfoQuery = useInfo(environmentId, {
    select: (info) => !!info.Swarm?.NodeID && !!info.Swarm?.ControlAvailable,
  });

  const apiVersion = useApiVersion(environmentId);

  const isSwarmManager = envInfoQuery.data;

  const setupSubMenuProps = isSwarmManager
    ? {
        label: t('navigation.docker.swarm', { defaultValue: 'Swarm' }),
        icon: Trello,
        to: 'docker.swarm',
        dataCy: 'portainerSidebar-swarm',
      }
    : {
        label: t('navigation.docker.host', { defaultValue: 'Host' }),
        icon: Trello,
        to: 'docker.host',
        dataCy: 'portainerSidebar-host',
      };

  const featSubMenuTo = isSwarmManager
    ? 'docker.swarm.featuresConfiguration'
    : 'docker.host.featuresConfiguration';
  const registrySubMenuTo = isSwarmManager
    ? 'docker.swarm.registries'
    : 'docker.host.registries';

  return (
    <>
      <DashboardLink
        environmentId={environmentId}
        platformPath="docker"
        data-cy="dockerSidebar-dashboard"
      />
      <SidebarParent
        icon={Edit}
        label={t('navigation.docker.templates', { defaultValue: 'Templates' })}
        to="docker.templates"
        params={{ endpointId: environmentId }}
        data-cy="portainerSidebar-templates"
        listId="dockerSidebar-templates"
      >
        <SidebarItem
          label={t('navigation.docker.application', {
            defaultValue: 'Application',
          })}
          to="docker.templates"
          ignorePaths={['docker.templates.custom']}
          params={{ endpointId: environmentId }}
          isSubMenu
          data-cy="portainerSidebar-appTemplates"
        />
        <SidebarItem
          label={t('navigation.docker.custom', { defaultValue: 'Custom' })}
          to="docker.templates.custom"
          params={{ endpointId: environmentId }}
          isSubMenu
          data-cy="dockerSidebar-customTemplates"
        />
      </SidebarParent>

      {areStacksVisible && (
        <SidebarItem
          to="docker.stacks"
          params={{ endpointId: environmentId }}
          icon={Layers}
          label={t('navigation.docker.stacks', { defaultValue: 'Stacks' })}
          data-cy="dockerSidebar-stacks"
        />
      )}

      {isSwarmManager && (
        <SidebarItem
          to="docker.services"
          params={{ endpointId: environmentId }}
          icon={Shuffle}
          label={t('navigation.docker.services', { defaultValue: 'Services' })}
          data-cy="dockerSidebar-services"
        />
      )}

      <SidebarItem
        to="docker.containers"
        params={{ endpointId: environmentId }}
        icon={Box}
        label={t('navigation.docker.containers', {
          defaultValue: 'Containers',
        })}
        data-cy="dockerSidebar-containers"
      />

      <SidebarItem
        to="docker.images"
        params={{ endpointId: environmentId }}
        icon={List}
        label={t('navigation.docker.images', { defaultValue: 'Images' })}
        data-cy="dockerSidebar-images"
      />

      <SidebarItem
        to="docker.networks"
        params={{ endpointId: environmentId }}
        icon={Network}
        label={t('navigation.docker.networks', { defaultValue: 'Networks' })}
        data-cy="dockerSidebar-networks"
      />

      <SidebarItem
        to="docker.volumes"
        params={{ endpointId: environmentId }}
        icon={Database}
        label={t('navigation.docker.volumes', { defaultValue: 'Volumes' })}
        data-cy="dockerSidebar-volumes"
      />

      {apiVersion >= 1.3 && isSwarmManager && (
        <SidebarItem
          to="docker.configs"
          params={{ endpointId: environmentId }}
          icon={Clipboard}
          label={t('navigation.docker.configs', { defaultValue: 'Configs' })}
          data-cy="dockerSidebar-configs"
        />
      )}

      {apiVersion >= 1.25 && isSwarmManager && (
        <SidebarItem
          to="docker.secrets"
          params={{ endpointId: environmentId }}
          icon={Lock}
          label={t('navigation.docker.secrets', { defaultValue: 'Secrets' })}
          data-cy="dockerSidebar-secrets"
        />
      )}

      {!isSwarmManager && isEnvironmentAdmin && (
        <SidebarItem
          to="docker.events"
          params={{ endpointId: environmentId }}
          icon={Clock}
          label={t('navigation.docker.events', { defaultValue: 'Events' })}
          data-cy="dockerSidebar-events"
        />
      )}

      <SidebarParent
        label={setupSubMenuProps.label}
        icon={setupSubMenuProps.icon}
        to={setupSubMenuProps.to}
        params={{ endpointId: environmentId }}
        data-cy="portainerSidebar-host-area"
        listId="portainerSidebar-host-area"
      >
        <SidebarItem
          label={t('navigation.docker.details', { defaultValue: 'Details' })}
          isSubMenu
          to={setupSubMenuProps.to}
          params={{ endpointId: environmentId }}
          ignorePaths={[featSubMenuTo, registrySubMenuTo]}
          data-cy={setupSubMenuProps.dataCy}
        />

        <Authorized
          authorizations="PortainerEndpointUpdateSettings"
          adminOnlyCE
          environmentId={environmentId}
        >
          <SidebarItem
            label={t('navigation.docker.setup', { defaultValue: 'Setup' })}
            isSubMenu
            to={featSubMenuTo}
            params={{ endpointId: environmentId }}
            data-cy="portainerSidebar-docker-setup"
          />
        </Authorized>

        <SidebarItem
          label={t('navigation.docker.registries', {
            defaultValue: 'Registries',
          })}
          isSubMenu
          to={registrySubMenuTo}
          params={{ endpointId: environmentId }}
          data-cy="portainerSidebar-docker-registries"
        />
      </SidebarParent>
    </>
  );
}
