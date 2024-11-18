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
import { ILogType, ISessionLogDetailType } from 'src/types/log';
import { Label } from 'src/components/label';
// ----------------------------------------------------------------------

type Props = {
    row: ISessionLogDetailType;
    key: number;
    sessionType: string;
};

export function SessionLogTableRow({
  row,
  key,
  sessionType='agent'
}: Props) {  
  return (
      <TableRow
        hover
        tabIndex={-1}
      >
        <TableCell padding="checkbox">
          { row.error ? 
            <Iconify width={16} icon={'mi:circle-error'} 
                color='error.main' 
                sx={{ flexShrink: 0 }} /> 
          : '' }
        </TableCell>

        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}> */}
        <TableCell>
            {row.processCounter}
        </TableCell>
        <TableCell>
            {row.type}
        </TableCell>
        <TableCell>
            {row.message}
        </TableCell>
        <TableCell>
            {row.error ? row.error : ''}
        </TableCell>
        {/* <TableCell>
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
        </TableCell> */}
      </TableRow>
  );
}
