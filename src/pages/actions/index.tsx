import Button from '@mui/material/Button';

import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import type { IActionItem } from 'src/types/action';
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
import { ActionTableRow } from 'src/sections/actions/actions-table-row';
import { useCallback, useEffect, useState } from 'react';
import API from 'src/utils/API';
import { LoadingScreen } from 'src/components/loading-screen';
import { useRouter } from 'src/routes/hooks';
import { deleteAction } from 'src/utils/api/actions';

const TABLE_HEAD = [
  { id: 'actionName', label: 'Action Name', width: 200 },
  { id: 'actionDescription', label: 'Description', width: 220 },
  { id: 'actionOperation', label: 'Operation', width: 200 },
  { id: '', width: 88 },
];

function Actions() {
  const table = useTable();
  const confirm = useBoolean();
  const router = useRouter();

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(`/actions/${id}`);
    },
    [router]
  );

  const [actions, setActions] = useState<IActionItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  const getActions = useCallback(async () => {
    const { data } = await API.get<{
      actions: IActionItem[];
    }>('/actions');
    setActions(data.actions);
    setLoaded(true);
  }, []);

  useEffect(() => {
    getActions();
  }, [getActions]);

  const handleDeleteRow = useCallback(
    async (id: string) => {
      await deleteAction(id, () => {
        const deleteRow = actions.filter((row) => row._id !== id);
        setActions(deleteRow);
        table.onUpdatePageDeleteRow(actions.length);
      });
    },
    [actions, table]
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Actions"
        action={
          <Button
            component={RouterLink}
            href="/actions/create"
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Action
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
              rowCount={actions.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  actions.map((row) => row._id)
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
                  rowCount={actions.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      actions.map((row) => row._id)
                    )
                  }
                />

                <TableBody>
                  {actions
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <ActionTableRow
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
                    emptyRows={emptyRows(table.page, table.rowsPerPage, actions.length)}
                  />

                  <TableNoData notFound={actions.length < 1} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            // dense={table.dense}
            count={actions.length}
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

export default Actions;
