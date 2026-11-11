import { Box, Clock, LayoutGrid, Layers, Puzzle, Edit } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { isBE } from '../portainer/feature-flags/feature-flags.service';
import { useSettings } from '../portainer/settings/queries';

import { SidebarItem } from './SidebarItem';
import { SidebarSection } from './SidebarSection';
import { SidebarParent } from './SidebarItem/SidebarParent';

export function EdgeComputeSidebar() {
  const { t } = useTranslation();
  // this sidebar is rendered only for admins, so we can safely assume that settingsQuery will succeed
  const settingsQuery = useSettings();

  if (!settingsQuery.data || !settingsQuery.data.EnableEdgeComputeFeatures) {
    return null;
  }

  const settings = settingsQuery.data;

  return (
    <SidebarSection
      title={t('navigation.edge.title', { defaultValue: 'Edge compute' })}
    >
      <SidebarItem
        to="edge.groups"
        label={t('navigation.edge.groups', { defaultValue: 'Edge Groups' })}
        icon={LayoutGrid}
        data-cy="portainerSidebar-edgeGroups"
      />
      <SidebarItem
        to="edge.stacks"
        label={t('navigation.edge.stacks', { defaultValue: 'Edge Stacks' })}
        icon={Layers}
        data-cy="portainerSidebar-edgeStacks"
      />
      <SidebarItem
        to="edge.jobs"
        label={t('navigation.edge.jobs', { defaultValue: 'Edge Jobs' })}
        icon={Clock}
        data-cy="portainerSidebar-edgeJobs"
      />
      {isBE && (
        <SidebarItem
          to="edge.configurations"
          label={t('navigation.edge.configurations', {
            defaultValue: 'Edge Configurations',
          })}
          icon={Puzzle}
          data-cy="portainerSidebar-edgeConfigurations"
        />
      )}
      {isBE && !settings.TrustOnFirstConnect && (
        <SidebarItem
          to="edge.devices.waiting-room"
          label={t('navigation.edge.waitingRoom', {
            defaultValue: 'Waiting Room',
          })}
          icon={Box}
          data-cy="portainerSidebar-edgeDevicesWaitingRoom"
        />
      )}
      <SidebarParent
        icon={Edit}
        label={t('navigation.edge.templates', {
          defaultValue: 'Edge Templates',
        })}
        to="edge.templates"
        data-cy="edgeSidebar-templates"
        listId="edgeSidebar-templates"
      >
        <SidebarItem
          label={t('navigation.edge.application', {
            defaultValue: 'Application',
          })}
          to="edge.templates"
          ignorePaths={['edge.templates.custom']}
          isSubMenu
          data-cy="edgeSidebar-appTemplates"
        />
        <SidebarItem
          label={t('navigation.edge.custom', { defaultValue: 'Custom' })}
          to="edge.templates.custom"
          isSubMenu
          data-cy="edgeSidebar-customTemplates"
        />
      </SidebarParent>
    </SidebarSection>
  );
}
