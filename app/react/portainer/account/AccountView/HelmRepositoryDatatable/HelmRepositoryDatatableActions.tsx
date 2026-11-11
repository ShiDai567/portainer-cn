import { useRouter } from '@uirouter/react';
import { useTranslation } from 'react-i18next';

import { AddButton } from '@@/buttons';
import { DeleteButton } from '@@/buttons/DeleteButton';

import { HelmRepository } from './types';
import { useDeleteHelmRepositoriesMutation } from './helm-repositories.service';

interface Props {
  selectedItems: HelmRepository[];
}

export function HelmRepositoryDatatableActions({ selectedItems }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const deleteHelmRepoMutation = useDeleteHelmRepositoriesMutation();

  return (
    <>
      <DeleteButton
        disabled={selectedItems.length === 0}
        onConfirmed={() => onDeleteClick(selectedItems)}
        confirmMessage={t('account.helm.confirmRemove', {
          count: selectedItems.length,
          defaultValue_one:
            'Are you sure you want to remove the selected {{count}} Helm repository?',
          defaultValue_other:
            'Are you sure you want to remove the selected {{count}} Helm repositories?',
        })}
        data-cy="helmRepository-deleteButton"
      />
      <AddButton
        to="portainer.account.createHelmRepository"
        data-cy="helmRepository-addButton"
      >
        {t('account.helm.add', { defaultValue: 'Add Helm repository' })}
      </AddButton>
    </>
  );

  async function onDeleteClick(selectedItems: HelmRepository[]) {
    deleteHelmRepoMutation.mutate(selectedItems, {
      onSuccess: () => {
        router.stateService.reload();
      },
    });
  }
}
