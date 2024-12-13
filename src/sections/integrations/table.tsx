import { Card, Table, TableBody } from '@mui/material';
import { useEffect, useState } from 'react';
import { Scrollbar } from 'src/components/scrollbar';
import {
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  useTable,
} from 'src/components/table';
import type { IApiKeyItem } from 'src/types/apiKey';
import { ApiKeyTableRow } from './table-row';

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
    id: 'updateAt',
    label: 'Updated At',
    width: 110,
    align: 'center',
  },
  { id: 'status', label: 'Status', width: 110 },
  { id: '', width: 50 },
];
export const ApiKeyTable = ({ apiKeys = [], setComment }: { apiKeys: IApiKeyItem[]; setComment: (comment: string) => void }) => {
  const table = useTable(); // Assuming this hook manages table-related state like sorting, pagination
  const [data, setData] = useState<IApiKeyItem[]>(apiKeys);

  useEffect(() => {
    setData(apiKeys); // Ensure table data updates when apiKeys change
  }, [apiKeys]);

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
                <ApiKeyTableRow
                  row={row}
                  onRotateRow={() => setComment(row.comment)} // Assuming this function sets the comment for the key
                />
              ))}

            {/* Handle empty rows when pagination does not fill the entire page */}
            <TableEmptyRows
              height={table.dense ? 56 : 56 + 20}
              emptyRows={emptyRows(table.page, table.rowsPerPage, data.length)}
            />

            {/* Handle case when no data is found */}
            <TableNoData notFound={data.length === 0} />
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>
  );
};
