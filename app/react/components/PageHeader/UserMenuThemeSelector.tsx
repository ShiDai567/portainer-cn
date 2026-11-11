import { Eye, Moon, RefreshCw, Sun } from 'lucide-react';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { User, ThemeColor } from '@/portainer/users/types';
import { applyTheme } from '@/react/portainer/services/applyTheme';
import { useUpdateUserMutation } from '@/react/portainer/account/useUpdateUserMutation';
import { options as themeOptions } from '@/react/portainer/account/AccountView/theme-options';

import {
  SegmentItem,
  SegmentedControl,
} from '@@/form-components/SegmentedControl';
import { Icon } from '@@/Icon';

const themeIconMap: Record<ThemeColor, ReactNode> = {
  light: <Icon icon={Sun} />,
  dark: <Icon icon={Moon} />,
  highcontrast: <Icon icon={Eye} />,
  auto: <Icon icon={RefreshCw} />,
};

export function ThemeSelector({ user }: { user: User }) {
  const { t } = useTranslation();
  const updateMutation = useUpdateUserMutation();
  const activeTheme = user?.ThemeSettings?.color ?? 'auto';
  const themeSegmentItems: SegmentItem[] = themeOptions.map((option) => ({
    id: option.id,
    label: themeIconMap[option.id],
    title: t(`account.theme.${option.id}`, { defaultValue: option.label }),
  }));

  function handleThemeSelect(id: string) {
    const color = id as ThemeColor;
    applyTheme(color);
    updateMutation.mutate({ theme: { color } });
  }

  return (
    <SegmentedControl
      label={t('account.theme.label', { defaultValue: 'Theme' })}
      items={themeSegmentItems}
      activeId={activeTheme}
      onChange={handleThemeSelect}
      size="md"
    />
  );
}
