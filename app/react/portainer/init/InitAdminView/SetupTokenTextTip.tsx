import { Trans, useTranslation } from 'react-i18next';

import { TextTip } from '@@/Tip/TextTip';

export function SetupTokenTextTip() {
  const { t } = useTranslation();

  return (
    <TextTip color="blue">
      <Trans
        t={t}
        i18nKey="init.admin.setupTokenHelp"
        defaults="Find this token in the Portainer server logs. See the <faq>setup token FAQ</faq> for more information."
        components={{
          faq: (
            <a
              href="https://docs.portainer.io/faqs/installing/setup-token"
              target="_blank"
              rel="noreferrer"
            >
              setup token FAQ
            </a>
          ),
        }}
      />
    </TextTip>
  );
}
