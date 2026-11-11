import { createColumnHelper } from '@tanstack/react-table';
import { createElement } from 'react';
import { Trans } from 'react-i18next';

import { isoDateFromTimestamp } from '@/portainer/filters/filters';

import { AccessToken } from '../../access-tokens/types';

const columnHelper = createColumnHelper<AccessToken>();

export const columns = [
  columnHelper.accessor('description', {
    header: () =>
      createElement(Trans, {
        i18nKey: 'account.accessTokens.columns.description',
        defaults: 'Description',
      }),
  }),
  columnHelper.accessor('prefix', {
    header: () =>
      createElement(Trans, {
        i18nKey: 'account.accessTokens.columns.prefix',
        defaults: 'Prefix',
      }),
  }),
  columnHelper.accessor('dateCreated', {
    header: () =>
      createElement(Trans, {
        i18nKey: 'account.accessTokens.columns.created',
        defaults: 'Created',
      }),
    cell: ({ getValue }) => isoDateFromTimestamp(getValue()),
  }),
  columnHelper.accessor('lastUsed', {
    header: () =>
      createElement(Trans, {
        i18nKey: 'account.accessTokens.columns.lastUsed',
        defaults: 'Last Used',
      }),
    cell: ({ getValue }) => isoDateFromTimestamp(getValue()),
  }),
];
