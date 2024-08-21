import {
  Button,
  Checkbox,
  IconButton,
  MenuItem,
  MenuList,
  TableCell,
  TableRow,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import type { IKnowledgeBaseItem } from 'src/types/knowledge-base';
import { ConfirmDialog } from 'src/components/custom-dialog';
import API from 'src/utils/API';
import { toast } from 'sonner';

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

  const [isLinkedToBot, setIsLinkedToBot] = useState<boolean>(false);
  const [loaded, setIsLoaded] = useState(false);
  const fetchLinkedBot = useCallback(async () => {
    try {
      const response = await API.get<{
        isLinkedToBot: boolean;
      }>(`/knowledgebases/${row._id}/isLinkedToBot`);
      setIsLinkedToBot(response.data.isLinkedToBot);
    } catch (error) {
      toast.error('Failed to fetch linked bot');
    }
    setIsLoaded(true);
  }, [row._id]);

  useEffect(() => {
    fetchLinkedBot();
  }, [fetchLinkedBot]);

  const header = isLinkedToBot ? 'Cannot delete' : 'Delete knowledge base';

  const content = isLinkedToBot
    ? 'This knowledge base is linked to a bot'
    : `Are you sure want to delete the knowledgeBase: ${row.knowledgeBaseName}?`;

  const buttonText = isLinkedToBot ? 'Close' : 'Delete';

  const onClick = isLinkedToBot ? confirm.onFalse : onDeleteRow;

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
        <TableCell>{row.knowledgeBaseName}</TableCell>
        <TableCell>{row.knowledgeBaseDescription}</TableCell>
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
            disabled={!loaded}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={header}
        content={content}
        action={
          <Button variant="contained" color="error" onClick={onClick}>
            {buttonText}
          </Button>
        }
      />
    </>
  );
}
