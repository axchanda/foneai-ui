import { Card, Table, TableBody } from '@mui/material';
import React from 'react';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom, useTable } from 'src/components/table';
import type { IWebhookItem } from 'src/types/webhook';
import WebhookTableRow from './webhook-table-row';

interface Props {
  webhooks: IWebhookItem[];
}

const TABLE_HEAD = [
  { id: 'name', label: 'Name', width: 150 },
  { id: 'description', label: 'Description', width: 180 },
  { id: 'url', label: 'URL', width: 300 },
  { id: 'timeout', label: 'Timeout', width: 100 },
  { id: 'restMethod', label: 'Method', width: 100 },
  { id: '', width: 88 },
];

const WebhookTable: React.FC<Props> = ({ webhooks }) => {
  const table = useTable();

  return (
    <Card>
      <Scrollbar>
        <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
          <TableHeadCustom
            order={table.order}
            orderBy={table.orderBy}
            headLabel={TABLE_HEAD}
            rowCount={webhooks.length}
            numSelected={table.selected.length}
            onSort={table.onSort}
            // onSelectAllRows={(checked) =>
            //   table.onSelectAllRows(
            //     checked,
            //     dataFiltered.map((row) => row.id)
            //   )
            // }
          />
          <TableBody>
            {webhooks.map((row) => (
              <WebhookTableRow
                key={row._id}
                row={row}
                selected={table.selected.includes(row._id)}
                onEditRow={() => {
                  console.log('Edit row');
                }}
                onSelectRow={() => {
                  console.log('Select row');
                }}
                onDeleteRow={() => {
                  console.log('Delete row');
                }}
              />
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>
  );
};

export default WebhookTable;
