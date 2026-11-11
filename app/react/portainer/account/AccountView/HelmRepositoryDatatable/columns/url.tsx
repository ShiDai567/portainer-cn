import { Trans } from 'react-i18next';

import { Badge } from '@@/Badge';

import { columnHelper } from './helper';

export const url = columnHelper.accessor('URL', {
  id: 'url',
  cell: ({ row }) => (
    <div className="flex">
      {row.original.URL}
      {row.original.Global && (
        <Badge type="success" className="ml-2">
          <Trans i18nKey="account.helm.globallySet" defaults="Globally-set" />
        </Badge>
      )}
    </div>
  ),
});
