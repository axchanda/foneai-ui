import type { IUserItem, IUserTableFilters } from 'src/types/user';

import { useState, useCallback } from 'react';

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
import { _userList, USER_STATUS_OPTIONS } from 'src/_mock';

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

import { UserTableRow } from '../../sections/user/user-table-row';
import { UserTableFiltersResult } from '../../sections/user/user-table-filters-result';
import { ICampaignFilters, ICampaignType } from 'src/types/campaign';
import { _campaignList } from 'src/_mock/_campaign';
import { CampaignTableRow } from 'src/sections/campaigns/campaign-table-row';

// ----------------------------------------------------------------------


const TABLE_HEAD = [
    { id: 'id', label: 'Campaign ID', width: 200 },
    { id: 'campaignName', label: 'Campaign Name', width: 180 },
    { id: 'linkedBot', label: 'Linked Bot', width: 220 },
    { id: 'description', label: 'Description', width: 180 },
    // { id: 'status', label: 'Status', width: 100 },
    { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export default function UserListView() {
    const table = useTable();

    const router = useRouter();

    const confirm = useBoolean();

    const [tableData, setTableData] = useState<ICampaignType[]>(_campaignList);

    const filters = useSetState<ICampaignFilters>({ id: '', campaignName: '' });

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
        filters: filters.state,
    });

    const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

    const canReset =
        !!filters.state.id || filters.state.campaignName.length > 0

    const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

    const handleDeleteRow = useCallback(
        (id: string) => {
            const deleteRow = tableData.filter((row) => row.id !== id);

            toast.success('Delete success!');

            setTableData(deleteRow);

            table.onUpdatePageDeleteRow(dataInPage.length);
        },
        [dataInPage.length, table, tableData]
    );

    const handleDeleteRows = useCallback(() => {
        const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

        toast.success('Delete success!');

        setTableData(deleteRows);

        table.onUpdatePageDeleteRows({
            totalRowsInPage: dataInPage.length,
            totalRowsFiltered: dataFiltered.length,
        });
    }, [dataFiltered.length, dataInPage.length, table, tableData]);

    const handleEditRow = useCallback(
        (id: string) => {
            router.push(`/users/${id}/edit`);
        },
        [router]
    );


    return (
        <>
            <DashboardContent>
                <CustomBreadcrumbs
                    heading="Campaigns"

                    action={
                        <Button
                            component={RouterLink}
                            href="/users/create"
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                        >
                            New campaign
                        </Button>
                    }
                    sx={{ mb: { xs: 3, md: 5 } }}
                />

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
                                    dataFiltered.map((row) => row.id)
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
                                // onSelectAllRows={(checked) =>
                                //   table.onSelectAllRows(
                                //     checked,
                                //     dataFiltered.map((row) => row.id)
                                //   )
                                // }
                                />

                                <TableBody>
                                    {dataFiltered
                                        .slice(
                                            table.page * table.rowsPerPage,
                                            table.page * table.rowsPerPage + table.rowsPerPage
                                        )
                                        .map((row) => (
                                            <CampaignTableRow
                                                key={row.id}
                                                row={row}
                                                selected={table.selected.includes(row.id)}
                                                onSelectRow={() => table.onSelectRow(row.id)}
                                                onDeleteRow={() => handleDeleteRow(row.id)}
                                                onEditRow={() => handleEditRow(row.id)}
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
            </DashboardContent>

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Delete"
                content={
                    <>
                        Are you sure want to delete <strong> {table.selected.length} </strong> items?
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
    inputData: ICampaignType[];
    filters: ICampaignFilters;
    comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
    const { id, campaignName } = filters;

    const stabilizedThis = inputData.map((el, index) => [el, index] as const);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (id) {
        inputData = inputData.filter(
            (campaign) => campaign.id.toLowerCase().indexOf(id.toLowerCase()) !== -1
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
