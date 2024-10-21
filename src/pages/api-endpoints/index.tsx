import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import type { IApiEndpointFilters, IApiEndpointItem } from 'src/types/apiEndpoint';
import { ApiEndpointTableRow } from 'src/sections/api-endpoints/apiEndpoint-table-row';
import API from 'src/utils/API';
import { LoadingScreen } from 'src/components/loading-screen';
import { deleteApiEndpoint } from 'src/utils/api/apiEndpoints';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  // { id: 'checkbox', width: '' },
  { id: 'apiEndpointName', label: 'API Endpoint Name', width: 160 },
  { id: 'apiEndpointDescription', label: 'Description', width: 220 },
  { id: 'apiEndpointMethod', label: 'Method', width: 30 },
  { id: 'apiEndpointURI', label: 'URI', width: 250 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export default function ApiEndpointListView() {
  const [loaded, setLoaded] = useState(false);
  const [apiEndpoints, setApiEndpoints] = useState<IApiEndpointItem[]>([]);

  const table = useTable();

  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState<IApiEndpointItem[]>([]);

  const filters = useSetState<IApiEndpointFilters>({ id: '', apiEndpointName: '' });

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset = !!filters.state.id || filters.state.apiEndpointName.length > 0;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    async (id: string) => {
      await deleteApiEndpoint(id, () => {
        const deleteRow = tableData.filter((row) => row._id !== id);
        setTableData(deleteRow);
        table.onUpdatePageDeleteRow(dataInPage.length);
      });
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row._id));

    toast.success('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(`/apiEndpoints/${id}`);
    },
    [router]
  );

  const getApiEndpoints = useCallback(async () => {
    const apiEndpointPromise = API.get<{
      apiEndpoints: IApiEndpointItem[];
      count: number;
    }>('/apiEndpoints');

    const { data } = await apiEndpointPromise;

    setApiEndpoints(data.apiEndpoints);
    setTableData(data.apiEndpoints);
    setLoaded(true);
  }, []);

  useEffect(() => {
    getApiEndpoints();
  }, [getApiEndpoints]);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="API Manager"
          action={
            <Button
              component={RouterLink}
              href="/apiEndpoints/create"
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Define a new API Endpoint
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        {loaded ? (
          <Card>
            {/* {canReset && (
                        <UserTableFiltersResult
                            filters={filters}
                            totalResults={dataFiltered.length}
                            onResetPage={table.onResetPage}
                            sx={{ p: 2.5, pt: 0 }}
                        />
                    )} */}

            <Box sx={{ position: 'relative' }}>
              <TableSelectedAction
                dense={table.dense}
                numSelected={table.selected.length}
                rowCount={dataFiltered.length}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((row) => row._id)
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
                    rowCount={dataFiltered.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        dataFiltered.map((row) => row._id)
                      )
                    }
                  />

                  <TableBody>
                    {dataFiltered
                      .slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                      )
                      .map((row) => (
                        <ApiEndpointTableRow
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
                      emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                    />

                    <TableNoData notFound={notFound} />
                  </TableBody>
                </Table>
              </Scrollbar>
            </Box>

            <TablePaginationCustom
              page={table.page}
              // dense={table.dense}
              count={dataFiltered.length}
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

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete APi Endpoint"
        content={
          <>
            Are you sure want to delete the API Endpoint <strong> {table.selected.length} </strong> ?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: IApiEndpointItem[];
  filters: IApiEndpointFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData = [], comparator, filters }: ApplyFilterProps) {
  const { id, apiEndpointName } = filters;
  // console.log(inputData);
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (id) {
    inputData = inputData.filter(
      (apiEndpoint) => apiEndpoint._id.toLowerCase().indexOf(id.toLowerCase()) !== -1
    );
  }

  // if (status !== 'all') {
  //     inputData = inputData.filter((user) => user.status === status);
  // }

  if (apiEndpointName.length) {
    inputData = inputData.filter((apiEndpoint) => apiEndpointName.includes(apiEndpoint.apiEndpointName));
  }

  return inputData;
}
