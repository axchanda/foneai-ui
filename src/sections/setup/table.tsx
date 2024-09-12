import { Card, Table, TableBody } from '@mui/material';
import { useState } from 'react';
import { Scrollbar } from 'src/components/scrollbar';
import {
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  useTable,
} from 'src/components/table';
import type { ISetupItem } from 'src/types/setup';
import { _mock } from 'src/_mock';
import { SetupTableRow } from './table-row';

const TABLE_HEAD = [
  { id: 'comment', label: 'Comment', width: 100 },
  { id: 'secret', label: 'Secret', width: 140 },
  {
    id: 'createdAt',
    label: 'Created At',
    width: 110,
    align: 'center',
  },
  {
    id: 'updatedAt',
    label: 'Updated At',
    width: 110,
    align: 'center',
  },
  {
    id: 'expiresOn',
    label: 'Expires On',
    width: 110,
    align: 'center',
  },
  { id: 'status', label: 'Status', width: 110 },
  { id: '', width: 50 },
];

export const SetupTable = () => {
  const table = useTable();
  const [data, setData] = useState<ISetupItem[]>([
    {
      id: _mock.id(0),
      comment: 'lorem ipsum',
      secret: new Array(24).fill('*').join(''),
      createdAt: _mock.time(0),
      updatedAt: _mock.time(1),
      expiresOn: _mock.time(2),
      status: 'active',
    },
    // {
    //   id: _mock.id(1),
    //   comment: 'lorem ipsum',
    //   secret: new Array(24).fill('*').join(''),
    //   createdAt: _mock.time(4),
    //   updatedAt: _mock.time(5),
    //   expiresOn: _mock.time(6),
    //   status: 'expired',
    // },
  ]);

  const handleDeleteRow = (id: string) => {};

  const handleEditRow = () => {};

  return (
    <Card>
      <Scrollbar>
        <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
          <TableHeadCustom
            order={table.order}
            orderBy={table.orderBy}
            headLabel={TABLE_HEAD}
            rowCount={data.length}
            numSelected={table.selected.length}
            onSort={table.onSort}
          />

          <TableBody>
            {data
              .slice(
                table.page * table.rowsPerPage,
                table.page * table.rowsPerPage + table.rowsPerPage
              )
              .map((row) => (
                <SetupTableRow
                  key={row.id}
                  row={row}
                  selected={table.selected.includes(row.id)}
                  onSelectRow={() => table.onSelectRow(row.id)}
                  onDeleteRow={() => handleDeleteRow(row.id)}
                  // onViewRow={() => handleViewRow(row.id)}
                />
              ))}

            <TableEmptyRows
              height={table.dense ? 56 : 56 + 20}
              emptyRows={emptyRows(table.page, table.rowsPerPage, data.length)}
            />

            <TableNoData notFound={false} />
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>
  );
};
