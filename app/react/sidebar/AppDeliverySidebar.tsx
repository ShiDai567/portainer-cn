import { Database, GitBranch } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { SidebarItem } from './SidebarItem';
import { SidebarSection } from './SidebarSection';

export function AppDeliverySidebar() {
  const { t } = useTranslation();

  return (
    <SidebarSection
      title={t('navigation.appDelivery.title', {
        defaultValue: 'App Delivery',
      })}
    >
      <SidebarItem
        label={t('navigation.appDelivery.workflows', {
          defaultValue: 'Workflows',
        })}
        to="portainer.gitops.workflows"
        icon={GitBranch}
        data-cy="portainerSidebar-workflows"
      />

      <SidebarItem
        label={t('navigation.appDelivery.sources', { defaultValue: 'Sources' })}
        to="portainer.gitops.sources"
        icon={Database}
        data-cy="portainerSidebar-sources"
      />
    </SidebarSection>
  );
}
