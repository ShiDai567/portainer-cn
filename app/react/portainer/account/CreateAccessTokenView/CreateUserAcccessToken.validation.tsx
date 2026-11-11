import { TFunction } from 'i18next';
import { SchemaOf, object, string } from 'yup';

import { ApiKeyFormValues } from './types';

export function getAPITokenValidationSchema(
  requirePassword: boolean,
  t: TFunction
): SchemaOf<ApiKeyFormValues> {
  const descriptionMax = t(
    'users.access-tokens.create.validation.descriptionMax',
    {
      defaultValue: 'Description must be at most 128 characters',
    }
  );
  const descriptionRequired = t(
    'users.access-tokens.create.validation.descriptionRequired',
    { defaultValue: 'Description is required.' }
  );
  const description = string()
    .max(128, descriptionMax)
    .required(descriptionRequired);

  if (requirePassword) {
    return object({
      password: string().required(
        t('users.access-tokens.create.validation.passwordRequired', {
          defaultValue: 'Password is required.',
        })
      ),
      description,
    });
  }

  return object({
    password: string().optional(),
    description,
  });
}
