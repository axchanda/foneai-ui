import {
  Button,
  Checkbox,
  Chip,
  IconButton,
  MenuItem,
  MenuList,
  TableCell,
  TableRow,
} from '@mui/material';
import React from 'react';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { ConfirmDialog } from 'src/components/custom-dialog';
import type { IFunctionItem } from 'src/types/function';

type Props = {
  row: IFunctionItem;
  selected: boolean;
  onEditRow: () => void;
  onSelectRow: () => void;
  onDeleteRow: () => void;
};

export function FunctionTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }: Props) {
  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow
        onDoubleClick={onEditRow}
        hover
        selected={selected}
        aria-checked={selected}
        tabIndex={-1}
      >
        <TableCell padding="checkbox">
          <Checkbox id={row._id} checked={selected} onClick={onSelectRow} />
        </TableCell>
        <TableCell>{row.functionName}</TableCell>
        <TableCell>{row.functionDescription}</TableCell>
        <TableCell>
          <Chip
            sx={{
              backgroundColor: 'primary.light',
            }}
            size="small"
            label={row.functionAction.type}
          />
          {/* {row.webhookMethod} */}
        </TableCell>
        {/* <TableCell>{row.fun}</TableCell> */}
        {/* <TableCell>{row.timeout}</TableCell>
        <TableCell>
          <Label color="primary">{row.restMethod}</Label>
        </TableCell> */}
        <TableCell align="right">
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              onEditRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
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
        title="Delete function"
        content={`Are you sure want to delete the function: ${row.functionName}?`}
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
