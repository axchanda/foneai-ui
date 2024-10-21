import Button from '@mui/material/Button';

import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import type { IZapItem } from 'src/types/zap';
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
import { ZapTableRow } from 'src/sections/zaps/zaps-table-row';
import { useCallback, useEffect, useState } from 'react';
import API from 'src/utils/API';
import { LoadingScreen } from 'src/components/loading-screen';
import { useRouter } from 'src/routes/hooks';
import { deleteZap } from 'src/utils/api/zaps';

const TABLE_HEAD = [
  { id: 'zapName', label: 'Zap Name', width: 200 },
  { id: 'zapDescription', label: 'Description', width: 220 },
  { id: 'zapAction', label: 'Action', width: 200 },
  { id: '', width: 88 },
];

function Zaps() {
  const table = useTable();
  const confirm = useBoolean();
  const router = useRouter();

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(`/zaps/${id}`);
    },
    [router]
  );

  const [zaps, setZaps] = useState<IZapItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  const getZaps = useCallback(async () => {
    const { data } = await API.get<{
      zaps: IZapItem[];
    }>('/zaps');
    setZaps(data.zaps);
    setLoaded(true);
  }, []);

  useEffect(() => {
    getZaps();
  }, [getZaps]);

  const handleDeleteRow = useCallback(
    async (id: string) => {
      await deleteZap(id, () => {
        const deleteRow = zaps.filter((row) => row._id !== id);
        setZaps(deleteRow);
        table.onUpdatePageDeleteRow(zaps.length);
      });
    },
    [zaps, table]
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Zaps"
        action={
          <Button
            component={RouterLink}
            href="/zaps/create"
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Zap
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
              rowCount={zaps.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  zaps.map((row) => row._id)
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
                  rowCount={zaps.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      zaps.map((row) => row._id)
                    )
                  }
                />

                <TableBody>
                  {zaps
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <ZapTableRow
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
                    emptyRows={emptyRows(table.page, table.rowsPerPage, zaps.length)}
                  />

                  <TableNoData notFound={zaps.length < 1} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            // dense={table.dense}
            count={zaps.length}
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

export default Zaps;
