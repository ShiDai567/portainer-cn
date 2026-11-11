import { Formik } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useCurrentUser } from '@/react/hooks/useUser';
import { AuthenticationMethod } from '@/react/portainer/settings/types';

import { Widget } from '@@/Widget';
import { PageHeader } from '@@/PageHeader';

import { usePublicSettings } from '../../settings/queries/usePublicSettings';

import { ApiKeyFormValues } from './types';
import { getAPITokenValidationSchema } from './CreateUserAcccessToken.validation';
import { useCreateUserAccessTokenMutation } from './useCreateUserAccessTokenMutation';
import { CreateUserAccessTokenInnerForm } from './CreateUserAccessTokenInnerForm';
import { DisplayUserAccessToken } from './DisplayUserAccessToken';

const initialValues: ApiKeyFormValues = {
  password: '',
  description: '',
};

export function CreateUserAccessToken() {
  const { t } = useTranslation();
  const mutation = useCreateUserAccessTokenMutation();
  const { user } = useCurrentUser();
  const [newAPIToken, setNewAPIToken] = useState('');
  const settings = usePublicSettings();

  const requirePassword =
    settings.data?.AuthenticationMethod === AuthenticationMethod.Internal ||
    user.Id === 1;

  return (
    <>
      <PageHeader
        title={t('users.access-tokens.create.page-title', {
          defaultValue: 'Create access token',
        })}
        breadcrumbs={[
          {
            label: t('users.access-tokens.create.my-account', {
              defaultValue: 'My account',
            }),
            link: 'portainer.account',
          },
          t('users.access-tokens.create.add-button', {
            defaultValue: 'Add access token',
          }),
        ]}
        reload
      />

      <div className="row">
        <div className="col-sm-12">
          <Widget>
            <Widget.Body>
              {newAPIToken === '' ? (
                <Formik
                  initialValues={initialValues}
                  onSubmit={onSubmit}
                  validationSchema={getAPITokenValidationSchema(
                    requirePassword,
                    t
                  )}
                >
                  <CreateUserAccessTokenInnerForm
                    showAuthentication={requirePassword}
                  />
                </Formik>
              ) : (
                <DisplayUserAccessToken apikey={newAPIToken} />
              )}
            </Widget.Body>
          </Widget>
        </div>
      </div>
    </>
  );

  async function onSubmit(values: ApiKeyFormValues) {
    mutation.mutate(
      { values, userid: user.Id },
      {
        onSuccess(response) {
          setNewAPIToken(response);
        },
      }
    );
  }
}
