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
import type { IAgentListType } from 'src/types/agent';
import { Label } from 'src/components/label';
import { useTranslate } from 'src/locales';
// ----------------------------------------------------------------------

type Props = {
  row: ICampaignType;
  agents: IAgentListType[];
  selected: boolean;
  onEditRow: () => void;
  onSelectRow: () => void;
  onDeleteRow: () => void;
};

export function CampaignTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  agents,
}: Props) {
  const confirm = useBoolean();
  const { t } = useTranslate();
  const popover = usePopover();

  const quickEdit = useBoolean();
  const [isCopied, setCopied] = useClipboard(row.campaignId, {
    successDuration: 3000,
  });

  const linkedAgent = agents.find((agent) => agent._id === row.linkedAppId)?.name || row.linkedAppId;

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

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.campaignName}</TableCell>
        <TableCell>
          <Stack spacing={1} direction="row" alignItems="center">
            <Typography>{row.campaignId}</Typography>
            <IconButton
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                if (!isCopied) {
                  setCopied();
                }
              }}
            >
              <Iconify
                color={isCopied ? 'green' : undefined}
                icon={isCopied ? 'lets-icons:check-fill' : 'solar:copy-linear'}
              />
            </IconButton>
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Stack direction={'row'} gap={1}>
            <Label>
              {t('Agent')}
            </Label>
            {linkedAgent}
          </Stack>
        </TableCell>

        <TableCell>
          <Typography>{row.description}</Typography>
        </TableCell>

        {/* <TableCell>
                    <Label
                        variant="soft"
                        color={
                            (row.status === 'active' && 'success') ||
                            (row.status === 'pending' && 'warning') ||
                            (row.status === 'banned' && 'error') ||
                            'default'
                        }
                    >
                        {row.status}
                    </Label>
                </TableCell> */}

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
        content={t('Are you sure want to delete') + ' : ' + row.campaignName }
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            {t('Delete')}
          </Button>
        }
      />
    </>
  );
}
