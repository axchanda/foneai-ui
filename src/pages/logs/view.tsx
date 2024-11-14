import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useParams } from 'react-router';
import { useCallback, useEffect, useState } from 'react';
import API from 'src/utils/API';
import { LoadingScreen } from 'src/components/loading-screen';
import { ISessionLogType } from 'src/types/log';
import {
    Box,
    Card,
    Table,
    TableBody,
    TableRow,
    TableCell,
    TableSortLabel,
    TablePagination,
    Button,
    Typography,
    Checkbox,
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
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
import { LogTableRow } from 'src/sections/logs/log-table-row';
import { ILogFilters, ILogType } from 'src/types/log';
import { useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';
import { applyFilter } from 'src/components/phone-input/utils';
import { toast } from 'sonner';
import { SessionLogTableRow } from 'src/sections/logs/sessionLog-table-row';


const TABLE_HEAD = [
    { id: 'errorBox', width: '' },
    { id: 'processCounter', label: '', width: 5 },
    { id: 'type', label: 'Type', width: 15 },
    { id: 'message', label: 'Message', width: 250 },
    { id: 'error', label: 'Error', width: 75 },
  ];

export default function LogView() {
  const [loaded, setLoaded] = useState(false);
  const { id } = useParams();
  const [sessionLog, setSessionLog] = useState<any[]>([]);

  const table = useTable({
    defaultDense: true,
    defaultOrder: 'desc',
    defaultOrderBy: 'sessionStart',
    defaultRowsPerPage: 25,
  });
  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState<ILogType[]>([]);


  const getSessionLog = useCallback(async () => {
    const { data } = await API.get<ISessionLogType>('/logs/' + id);
    setSessionLog(data.sessionLog);
    setLoaded(true);
  }, [id]);

  useEffect(() => {
    getSessionLog();
  }, [getSessionLog]);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading={`Session Log - ${id}`}
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
                    numSelected={table.selected.length}
                    checkBoxHidden={true}
                    onSort={table.onSort}
                  />

                  <TableBody>
                    {sessionLog
                      .map((row, index) => (
                        <SessionLogTableRow
                          key={index}
                          sessionType={'agent'}
                          row={row}
                        />
                      ))}
                  </TableBody>
                </Table>
              </Scrollbar>
            </Box>
          </Card>
        ) : (
          <LoadingScreen />
        )}
      </DashboardContent>
    </>
  );
}
