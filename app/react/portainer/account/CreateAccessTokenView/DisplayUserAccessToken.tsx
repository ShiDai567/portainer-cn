import { useTranslation } from 'react-i18next';

import { Button, CopyButton } from '@@/buttons';
import { FormSectionTitle } from '@@/form-components/FormSectionTitle';
import { TextTip } from '@@/Tip/TextTip';
import { Link } from '@@/Link';

export function DisplayUserAccessToken({ apikey }: { apikey: string }) {
  const { t } = useTranslation();

  return (
    <>
      <FormSectionTitle>
        {t('users.access-tokens.create.new-access-token.title', {
          defaultValue: 'New access token',
        })}
      </FormSectionTitle>
      <TextTip>
        {t('users.access-tokens.create.new-access-token.explanation', {
          defaultValue:
            "Please copy the new access token. You won't be able to view the token again.",
        })}
      </TextTip>
      <div className="pt-5">
        <div className="inline-flex">
          <div className="">{apikey}</div>
          <div>
            <CopyButton
              copyText={apikey}
              displayText={t(
                'users.access-tokens.create.new-access-token.copied',
                { defaultValue: 'copied' }
              )}
              color="link"
              data-cy="create-access-token-copy-button"
            >
              <span className="sr-only">
                {t('users.access-tokens.create.new-access-token.copy-button', {
                  defaultValue: 'Copy access token',
                })}
              </span>
            </CopyButton>
          </div>
        </div>
        <hr />
      </div>
      <Button
        as={Link}
        props={{
          to: 'portainer.account',
        }}
        data-cy="create-access-token-done-button"
      >
        {t('users.access-tokens.create.done-button', {
          defaultValue: 'Done',
        })}
      </Button>
    </>
  );
}
