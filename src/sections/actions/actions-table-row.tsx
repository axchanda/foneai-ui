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
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { ConfirmDialog } from 'src/components/custom-dialog';
import type { IActionItem } from 'src/types/action';
import { Label } from 'src/components/label';
import { useTranslate } from 'src/locales';

type Props = {
  row: IActionItem;
  selected: boolean;
  onEditRow: () => void;
  onSelectRow: () => void;
  onDeleteRow: () => void;
};

export function ActionTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }: Props) {
  const confirm = useBoolean();
  const {t, currentLang} = useTranslate();
  const popover = usePopover();
  
  const labelModifier = (labelKey: string) => {
    const localizedLabel = t(labelKey);
  
    // Avoid uppercase for non-Latin scripts
    if (currentLang.value === 'ar') {
      return localizedLabel.replace(/\d+/g, (match) => `(${match})`);
    } 

    return localizedLabel.toUpperCase();
  };
  

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
          {/* <Checkbox id={row._id} checked={selected} onClick={onSelectRow} /> */}
        </TableCell>
        <TableCell>{row.actionName}</TableCell>
        <TableCell>{row.actionDescription}</TableCell>
        <TableCell>
          <Label>
            {labelModifier(row.actionOperation.type)}
          </Label>
        </TableCell>
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
            {t('Edit')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            {t('Delete')}
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('Delete?')}
        content={t('Are you sure want to delete ') + ' : ' + row.actionName}
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            {t('Delete')}
          </Button>
        }
      />
    </>
  );
}
