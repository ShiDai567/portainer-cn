import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import axios, { parseAxiosError } from '@/portainer/services/axios/axios';
import { withError } from '@/react-tools/react-query';
import { notifySuccess } from '@/portainer/services/notifications';

import { ApiKeyFormValues } from './types';

export interface ApiKeyResponse {
  rawAPIKey: string;
}

export function useCreateUserAccessTokenMutation() {
  const { t } = useTranslation();

  return useMutation(createUserAccessToken, {
    ...withError(
      t('users.access-tokens.create.error', {
        defaultValue: 'Unable to create access token',
      })
    ),
    onSuccess: () => {
      notifySuccess(
        t('users.access-tokens.create.success-title', {
          defaultValue: 'Success',
        }),
        t('users.access-tokens.create.success', {
          defaultValue: 'Access token successfully created',
        })
      );
      // TODO: invalidate query when user page migrated to react.
    },
  });
}

async function createUserAccessToken({
  values,
  userid,
}: {
  values: ApiKeyFormValues;
  userid: number;
}) {
  try {
    const response = await axios.post<ApiKeyResponse>(
      `/users/${userid}/tokens`,
      values
    );
    return response.data.rawAPIKey;
  } catch (e) {
    throw parseAxiosError(e);
  }
}
