import {
  Button,
  Checkbox,
  Chip,
  IconButton,
  MenuItem,
  MenuList,
  Stack,
  TableCell,
  TableRow,
} from '@mui/material';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import type { IApiEndpointItem } from 'src/types/apiEndpoint';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Label } from 'src/components/label';

type Props = {
  row: IApiEndpointItem;
  selected: boolean;
  onEditRow: () => void;
  onSelectRow: () => void;
  onDeleteRow: () => void;
};

export function ApiEndpointTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }: Props) {
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
        <TableCell>{row.apiEndpointName}</TableCell>
        <TableCell>{row.apiEndpointDescription}</TableCell>
        <TableCell>
          <Stack direction={'row'} gap={3}>
            <Label>
              {row.apiEndpointMethod}
            </Label>
            {row.apiEndpointURI}
          </Stack>
        </TableCell>
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
        title="Delete API Definition"
        content={`Are you sure want to delete the apiEndpoint: ${row.apiEndpointName}?`}
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
