import {
  Button,
  Checkbox,
  IconButton,
  MenuItem,
  MenuList,
  TableCell,
  TableRow,
} from '@mui/material';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import type { IKnowledgeBaseItem } from 'src/types/knowledge-base';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Label } from 'src/components/label';
import { useTranslate } from 'src/locales';

type Props = {
  row: IKnowledgeBaseItem;
  selected: boolean;
  onEditRow: () => void;
  onSelectRow: () => void;
  onDeleteRow: () => void;
};

export function KnowledgeBaseTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const confirm = useBoolean();

  const popover = usePopover();

  function getLabelColor(status: string) {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  }
  function getLabelIcon(status: any) {
    console.log(status);
    switch (status) {
      case 'active':
        return "eva:checkmark-circle-2-fill";
      case 'pending':
        return "material-symbols-light:pending-outline";
      case 'error':
        return "material-symbols:error-outline";
      default:
        return '';
    }
  }
  const {t} = useTranslate();
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
        <TableCell>{row.knowledgeBaseName}</TableCell>
        <TableCell>{row.knowledgeBaseDescription}</TableCell>
        <TableCell>
          <Label color={getLabelColor(row?.status || 'pending')} startIcon={<Iconify icon={getLabelIcon(row?.status)} />}>
            {t(row?.status || 'pending')}
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
        title="Delete knowledge base"
        content={`Are you sure want to delete the knowledgeBase: ${row.knowledgeBaseName}?`}
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
