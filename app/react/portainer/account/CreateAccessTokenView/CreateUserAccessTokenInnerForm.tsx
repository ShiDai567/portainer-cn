import { Field, Form, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';

import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';
import { LoadingButton } from '@@/buttons';

import { ApiKeyFormValues } from './types';

interface Props {
  showAuthentication: boolean;
}

export function CreateUserAccessTokenInnerForm({ showAuthentication }: Props) {
  const { t } = useTranslation();
  const { errors, values, handleSubmit, isValid, dirty } =
    useFormikContext<ApiKeyFormValues>();

  return (
    <Form
      className="form-horizontal"
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      {showAuthentication && (
        <FormControl
          inputId="password"
          label={t('users.access-tokens.create.current-password-field-label', {
            defaultValue: 'Current password',
          })}
          required
          errors={errors.password}
        >
          <Field
            as={Input}
            type="password"
            id="password"
            name="password"
            value={values.password}
            autoComplete="new-password"
          />
        </FormControl>
      )}
      <FormControl
        inputId="description"
        label={t('users.access-tokens.create.description-field-label', {
          defaultValue: 'Description',
        })}
        required
        errors={errors.description}
      >
        <Field
          as={Input}
          id="description"
          name="description"
          value={values.description}
        />
      </FormControl>
      <LoadingButton
        disabled={!isValid || !dirty}
        data-cy="create-access-token-button"
        isLoading={false}
        loadingText={t('users.access-tokens.create.adding-access-token', {
          defaultValue: 'Adding access token...',
        })}
      >
        {t('users.access-tokens.create.add-button', {
          defaultValue: 'Add access token',
        })}
      </LoadingButton>
    </Form>
  );
}
