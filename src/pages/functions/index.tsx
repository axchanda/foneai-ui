import Button from '@mui/material/Button';

import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import type { IFunctionItem } from 'src/types/function';
import { Box, Card, IconButton, Table, TableBody, Tooltip } from '@mui/material';
import {
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  useTable,
} from 'src/components/table';
import { useBoolean } from 'src/hooks/use-boolean';
import { Scrollbar } from 'src/components/scrollbar';
import { FunctionTableRow } from 'src/sections/functions/functions-table-row';
import { useCallback, useEffect, useState } from 'react';
import API from 'src/utils/API';
import { LoadingScreen } from 'src/components/loading-screen';
import { useRouter } from 'src/routes/hooks';
import { deleteFunction } from 'src/utils/api/functions';

const TABLE_HEAD = [
  // { id: 'checkbox', width: '' },
  { id: 'functionName', label: 'Function Name', width: 200 },
  // { id: 'functionDescription', label: 'Description', width: 220 },
  { id: 'functionAction', label: 'Action', width: 200 },
  // { id: 'webhookURI', label: 'URI', width: 250 },
  { id: '', width: 88 },
];

// const functions: IFunctionItem[] = [
//   {
//     _id: '1',
//     functionName: 'Function 1',
//     functionDescription: 'Function 1 Description',
//     functionAction: {
//       type: 'webhook',
//       data: {
//         linkedWebhook: '1',
//         slug: 'function-1',
//       },
//     },
//     parameters: [],
//   },
//   {
//     _id: '2',
//     functionName: 'Function 2',
//     functionDescription: 'Function 2 Description',
//     functionAction: {
//       type: 'transfer',
//       data: null,
//     },
//     parameters: [
//       {
//         parameterIsRequired: true,
//         parameterName: 'parameterName',
//         parameterType: 'string',
//         parameterDescription: 'parameterDescription',
//       },
//     ],
//   },
//   {
//     _id: '3',
//     functionName: 'Function 3',
//     functionDescription: 'Function 3 Description',
//     functionAction: {
//       type: 'hangup',
//       data: null,
//     },
//     parameters: [],
//   },
// ];

function Functions() {
  const table = useTable();
  const confirm = useBoolean();
  const router = useRouter();

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(`/functions/${id}`);
    },
    [router]
  );

  const [functions, setFunctions] = useState<IFunctionItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  const getFunctions = useCallback(async () => {
    const { data } = await API.get<{
      functions: IFunctionItem[];
    }>('/functions');
    setFunctions(data.functions);
    setLoaded(true);
  }, []);

  useEffect(() => {
    getFunctions();
  }, [getFunctions]);

  const handleDeleteRow = useCallback(
    async (id: string) => {
      await deleteFunction(id, () => {
        const deleteRow = functions.filter((row) => row._id !== id);
        setFunctions(deleteRow);
        table.onUpdatePageDeleteRow(functions.length);
      });
    },
    [functions, table]
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Functions"
        action={
          <Button
            component={RouterLink}
            href="/functions/create"
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Function
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {loaded ? (
        <Card>
          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={functions.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  functions.map((row) => row._id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={functions.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      functions.map((row) => row._id)
                    )
                  }
                />

                <TableBody>
                  {functions
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <FunctionTableRow
                        key={row._id}
                        row={row}
                        selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onDeleteRow={() => handleDeleteRow(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, functions.length)}
                  />

                  <TableNoData notFound={functions.length < 1} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            // dense={table.dense}
            count={functions.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            // onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      ) : (
        <LoadingScreen />
      )}
    </DashboardContent>
  );
}

export default Functions;
