import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover } from 'src/components/custom-popover';
import type { ISetupItem } from 'src/types/setup';
import { Tooltip, Typography } from '@mui/material';

type Props = {
  row: ISetupItem;
  selected: boolean;
  onSelectRow: () => void;
  onDeleteRow: () => void;
};

export function SetupTableRow({ row, selected, onSelectRow, onDeleteRow }: Props) {
  const confirm = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell>
        <Typography variant="body2">{row.comment}</Typography>
      </TableCell>

      <TableCell>
        <Typography variant="body2">{row.secret}</Typography>
      </TableCell>

      <TableCell align="center">
        <Typography variant="body2">{fDate(row.createdAt)}</Typography>
      </TableCell>

      <TableCell align="center">
        <Typography variant="body2">{fDate(row.updatedAt)}</Typography>
      </TableCell>

      <TableCell align="center">
        <Typography variant="body2">{fDate(row.expiresOn)}</Typography>
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (row.status === 'active' && 'success') ||
            (row.status === 'expired' && 'error') ||
            'default'
          }
        >
          {row.status}
        </Label>
      </TableCell>

      <TableCell
        align="right"
        sx={{
          px: 1,
          // whiteSpace: 'nowrap',
          justifyContent: 'space-around',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
        }}
      >
        <Tooltip title="Regenerate key">
          <IconButton
            color="primary"
            onClick={collapse.onToggle}
            // sx={{ ...(collapse.value && { bgcolor: 'action.hover' }) }}
          >
            <Iconify icon="hugeicons:refresh" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete key">
          <IconButton color="error" onClick={popover.onOpen}>
            <Iconify icon="weui:delete-filled" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
