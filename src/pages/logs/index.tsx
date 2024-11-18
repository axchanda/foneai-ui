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

import type { ICampaignFilters, ICampaignType } from 'src/types/campaign';
import { CampaignTableRow } from 'src/sections/campaigns/campaign-table-row';
import API from 'src/utils/API';
import { LoadingScreen } from 'src/components/loading-screen';
import type { IAgentListType } from 'src/types/agent';
import { deleteCampaign } from 'src/utils/api/campaigns';
import { ILogFilters, ILogType } from 'src/types/log';
import { LogTableRow } from 'src/sections/logs/log-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  // { id: 'checkbox', width: '' },
  { id: 'id', label: 'Log ID', width: 100 },
  { id: 'sessionStart', label: 'Start Time', width: 150 },
  { id: 'sessionEnd', label: 'End Time', width: 150 },
  { id: 'chargableDuration', label: 'Billed Mins', width: 75 },
  { id: 'costPerMinute', label: 'CPM', width: 75 },
  { id: 'totalCost', label: `Used credits`, width: 100 },
  { id: 'campaignId', label: 'Campaign', width: 200 },
  { id: 'linkedAppId', label: 'App', width: 250 },
  // { id: 'sessionLog', label: 'Session Log', width: 100 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export default function LogListView() {
  const [loaded, setLoaded] = useState(false);
  
  const [logs, setLogs] = useState<ILogType[]>([]);

  const table = useTable({
    defaultDense: true,
    defaultOrder: 'desc',
    defaultOrderBy: 'sessionStart',
    defaultRowsPerPage: 25,
  });

  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState<ILogType[]>([]);

  const filters = useSetState<ILogFilters>({ id: '', sessionStart: '' });

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset = !!filters.state.id || filters.state.sessionStart.length > 0;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    async (id: string) => {
      await deleteCampaign(id, () => {
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


  const getLogs = useCallback(async () => {
    const logPromise = API.get<{
      logs: ILogType[];
      count: number;
    }>('/logs');

    const { data } = await logPromise;

    setLogs(data.logs);
    setTableData(data.logs);
    setLoaded(true);
  }, []);

  useEffect(() => {
    getLogs();
  }, [getLogs]);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Logs"
          // action={
            // <Button
            //   component={RouterLink}
            //   href="/campaigns/create"
            //   variant="contained"
            //   startIcon={<Iconify icon="mdi:download" />}
            // >
            //   Download Logs
            // </Button>

          // }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        {loaded ? (
          <Card>
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
                <Table size={table.dense ? 'small' : 'medium'}  
                  sx={{ 
                    minWidth: 960,
                    scrollBehavior: 'smooth',                    
                  }}>
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={dataFiltered.length}
                    numSelected={table.selected.length}
                    checkBoxHidden={true}
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
                        <LogTableRow
                          key={row._id}
                          row={row}
                          onOpenRow={() => router.push(`/logs/${row._id}`)}
                          onDeleteRow={() => handleDeleteRow(row._id)}
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
        title="Delete"
        content={
          <>
            Are you sure want to delete the log <strong> {table.selected.length} </strong> ?
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
  inputData: ILogType[];
  filters: ILogFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData = [], comparator, filters }: ApplyFilterProps) {
  const { id, sessionStart } = filters;
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
      (campaign) => campaign._id.toLowerCase().indexOf(id.toLowerCase()) !== -1
    );
  }

  // if (status !== 'all') {
  //     inputData = inputData.filter((user) => user.status === status);
  // }

  // if (sessionStart.length) {
  //   inputData = inputData.filter((campaign) => campaignName.includes(campaign.campaignName));
  // }

  return inputData;
}
