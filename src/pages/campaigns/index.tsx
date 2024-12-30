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
import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------


// ----------------------------------------------------------------------

export default function CampaignListView() {
  const [loaded, setLoaded] = useState(false);
  const [campaigns, setCampaigns] = useState<ICampaignType[]>([]);
  const [agents, setAgents] = useState<IAgentListType[]>([]);

  const table = useTable();

  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState<ICampaignType[]>([]);

  const filters = useSetState<ICampaignFilters>({ id: '', campaignName: '' });

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset = !!filters.state.id || filters.state.campaignName.length > 0;

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

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(`/campaigns/${id}/edit`);
    },
    [router]
  );

  const getCampaigns = useCallback(async () => {
    const campaignPromise = API.get<{
      campaigns: ICampaignType[];
      count: number;
    }>('/campaigns');
    const agentsListPromise = API.get<{
      agents: IAgentListType[];
      count: number;
    }>('/agentsList');

    const [{ data }, { data: agentsData }] = await Promise.all([campaignPromise, agentsListPromise]);

    setCampaigns(data.campaigns);
    setAgents(agentsData.agents);
    setTableData(data.campaigns);
    setLoaded(true);
  }, []);

  const {t} = useTranslate();

  useEffect(() => {
    getCampaigns();
  }, [getCampaigns]);
  

  const TABLE_HEAD = [
    // { id: 'checkbox', width: '' },
    { id: 'campaignName', label: t('Campaign Name'), width: 220 },
    { id: 'campaignId', label: t('Campaign ID'), width: 180 },
    { id: 'linkedAppId', label: t('Linked App'), width: 220 },
    { id: 'description', label: t('Description'), width: 180 },
    // { id: 'status', label: 'Status', width: 100 },
    { id: '', width: 88 },
  ];

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading={t('Campaigns')}
          action={
            <Button
              component={RouterLink}
              href="/campaigns/create"
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              {t('New Campaign')}
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
                  <Tooltip title={t('Delete')}>
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
                        <CampaignTableRow
                          key={row._id}
                          row={row}
                          selected={table.selected.includes(row._id)}
                          onSelectRow={() => table.onSelectRow(row._id)}
                          onDeleteRow={() => handleDeleteRow(row._id)}
                          onEditRow={() => handleEditRow(row._id)}
                          agents={agents}
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
            Are you sure want to delete <strong> {table.selected.length} </strong> ?
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
            {t('Delete')}
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: ICampaignType[];
  filters: ICampaignFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData = [], comparator, filters }: ApplyFilterProps) {
  const { id, campaignName } = filters;
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

  if (campaignName.length) {
    inputData = inputData.filter((campaign) => campaignName.includes(campaign.campaignName));
  }

  return inputData;
}
