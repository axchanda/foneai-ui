import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import type { ICampaignType } from 'src/types/campaign';
import { Checkbox, Typography } from '@mui/material';
import useClipboard from 'react-use-clipboard';
import type { IBotListType } from 'src/types/bot';
import { ILogType } from 'src/types/log';
import { Label } from 'src/components/label';
// ----------------------------------------------------------------------

type Props = {
  row: ILogType;
  selected?: boolean;
  onOpenRow: () => void;
  onDeleteRow: () => void;
};

export function LogTableRow({
  row,
  onOpenRow,
  onDeleteRow,
}: Props) {
  const confirm = useBoolean();

  const popover = usePopover();

  const quickEdit = useBoolean();

  function transformDate(dateInput: Date | string): string {
    const now = new Date(dateInput);  
    return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')} ${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')}`;
  }
  
  return (
    <>
      <TableRow
        hover
        onDoubleClick={onOpenRow}
        tabIndex={-1}
      >
        <TableCell padding="checkbox">
          <Iconify width={16} icon={'simple-icons:asterisk'} color="orange" sx={{ flexShrink: 0 }} />
        </TableCell>

        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}> */}
        <TableCell>
            {row._id}
        </TableCell>
        <TableCell>
            {row.sessionStart ? transformDate(row.sessionStart) : 'N/A'}
        </TableCell>
        <TableCell>
            {row.sessionEnd ? transformDate(row.sessionEnd) : 'N/A'}
        </TableCell>
        <TableCell>
            {row.chargeableDuration ? row.chargeableDuration : 1}
        </TableCell>
        <TableCell>
            {row.costPerMinute ? String(row.costPerMinute?.$numberDecimal) : 1}
        </TableCell>
        <TableCell>
            {row.costPerMinute ? String(row.totalCost) : 1}
        </TableCell>
        <TableCell>
            {row.campaignId && row.campaignId.campaignName}
        </TableCell> 
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Label
                variant="soft"
                color={'primary'}
                sx={{
                  padding: '2px 8px',
                }}
            >
                {row.app ? row.app : 'Agent'}
            </Label>
            {row.botId && row.botId.botName}
          </Stack>
        </TableCell>

        <TableCell>
          <Stack direction="row" justifyContent="end" alignItems="end">
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Stack>
        </TableCell>
      </TableRow>

      {/* <UserQuickEditForm currentUser={row} open={quickEdit.value} onClose={quickEdit.onFalse} /> */}

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              popover.onClose();
              onOpenRow();
            }}
          >
            <Iconify icon="material-symbols-light:view-list-outline" />
            See full log
          </MenuItem>
          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete Log Entry"
        content={`Are you sure want to delete the log entry: ${String(row._id)}?`}
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
